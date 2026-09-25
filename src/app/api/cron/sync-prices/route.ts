import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const PAGE_LIMIT = 500;

/**
 * Parse arrival_date in DD/MM/YYYY format to YYYY-MM-DD.
 * Falls back to today's date if parsing fails.
 */
function parseArrivalDate(raw: unknown): string {
  if (!raw) return new Date().toISOString().split("T")[0];
  const parts = String(raw).split("/");
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  return new Date().toISOString().split("T")[0];
}

interface GovRecord {
  commodity?: string;
  market?: string;
  modal_price?: string | number;
  arrival_date?: string;
  [key: string]: unknown;
}

export async function GET() {
  const apiKey = process.env.DATA_GOV_KEY || "579b464db66ec23bdd000001543e537b8b474a1b49fe2e5e73b67f57";
  if (!apiKey) {
    return NextResponse.json(
      { error: "DATA_GOV_KEY is missing in environment variables." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase client is not initialized" },
      { status: 500 }
    );
  }

  let totalSynced = 0;
  let totalSkipped = 0;
  const errors: Array<{ offset: number; error: string }> = [];

  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    try {
      const url =
        `https://api.data.gov.in/resource/${RESOURCE_ID}` +
        `?api-key=${apiKey}` +
        `&format=json` +
        `&limit=${PAGE_LIMIT}` +
        `&offset=${offset}` +
        `&filters[state.keyword]=Maharashtra`;

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`data.gov.in returned status ${res.status}`);
      }

      const json = await res.json();
      const records: GovRecord[] = json.records ?? [];

      if (records.length === 0) {
        hasMore = false;
        break;
      }

      // Build batch of rows to upsert
      const rows: Array<{
        crop: string;
        market: string;
        price: number;
        unit: string;
        date: string;
        source: string;
      }> = [];

      for (const row of records) {
        if (!row.modal_price || !row.market || !row.commodity) {
          totalSkipped++;
          continue;
        }

        const price = Number(row.modal_price);
        if (isNaN(price) || price <= 0) {
          totalSkipped++;
          continue;
        }

        rows.push({
          crop: row.commodity.trim(),
          market: row.market.trim(),
          price,
          unit: "quintal",
          date: parseArrivalDate(row.arrival_date),
          source: "Agmarknet (data.gov.in)",
        });
      }

      if (rows.length > 0) {
        // Upsert with unique constraint on (crop, market, date) to avoid duplicates.
        // The constraint name "prices_crop_market_date_key" must exist in Supabase.
        const { error, count } = await supabase
          .from("prices")
          .upsert(rows, {
            onConflict: "crop,market,date",
            ignoreDuplicates: false,
          })
          .select("id", { count: "exact", head: true });

        if (error) {
          // If unique constraint does not exist on table, fallback to regular insert
          const { error: insertError, count: insertCount } = await supabase
            .from("prices")
            .insert(rows)
            .select("id", { count: "exact", head: true });

          if (insertError) {
            errors.push({ offset, error: insertError.message });
          } else {
            totalSynced += insertCount ?? rows.length;
          }
        } else {
          totalSynced += count ?? rows.length;
        }
      }

      // If we got fewer records than the limit, we've reached the last page
      if (records.length < PAGE_LIMIT) {
        hasMore = false;
      } else {
        offset += PAGE_LIMIT;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      errors.push({ offset, error: msg });
      hasMore = false; // Stop paginating on fetch errors
    }
  }

  return NextResponse.json({
    success: true,
    totalSynced,
    totalSkipped,
    pagesProcessed: Math.ceil(offset / PAGE_LIMIT) + 1,
    errors,
  });
}
