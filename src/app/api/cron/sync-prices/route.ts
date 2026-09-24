import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const CROPS = ["Onion", "Tomato", "Wheat", "Cotton", "Soybean", "Potato"];

export async function GET() {
  const apiKey = process.env.DATA_GOV_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "DATA_GOV_KEY is missing in environment variables. Register at https://data.gov.in to obtain a free API key." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase client is not initialized" }, { status: 500 });
  }

  let totalSynced = 0;
  const errors: Array<{ commodity: string; error: string }> = [];

  for (const commodity of CROPS) {
    try {
      const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=25&filters[state.keyword]=Maharashtra&filters[commodity]=${encodeURIComponent(commodity)}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`data.gov.in returned status ${res.status}`);
      const json = await res.json();

      for (const row of json.records ?? []) {
        if (!row.modal_price || !row.market) continue;

        let formattedDate = new Date().toISOString().split("T")[0];
        if (row.arrival_date) {
          const parts = String(row.arrival_date).split("/");
          if (parts.length === 3) {
            formattedDate = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
          } else {
            formattedDate = String(row.arrival_date);
          }
        }

        const { error } = await supabase.from("prices").insert({
          crop: row.commodity || commodity,
          market: `${row.market} APMC`,
          price: Number(row.modal_price),
          unit: "quintal",
          date: formattedDate,
          source: "Agmarknet (data.gov.in)",
        });

        if (!error) totalSynced++;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      errors.push({ commodity, error: msg });
    }
  }

  return NextResponse.json({
    success: true,
    totalSynced,
    errors,
  });
}
