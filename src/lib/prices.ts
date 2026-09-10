import { DEMO_PRICES } from "@/lib/demo-data";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { PriceSnapshot } from "@/lib/types";

type PriceRow = Omit<PriceSnapshot, "trend" | "previousPrice">;

export async function getPriceSnapshots(crop?: string): Promise<PriceSnapshot[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return filterCrop(DEMO_PRICES, crop);

  let query = supabase.from("prices").select("crop, market, price, unit, date, source").order("date", { ascending: false });
  if (crop) query = query.eq("crop", crop);
  const { data, error } = await query;
  if (error || !data?.length) return filterCrop(DEMO_PRICES, crop);

  const groups = new Map<string, PriceRow[]>();
  for (const row of data as PriceRow[]) {
    const key = `${row.crop}|${row.market}`;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }

  return [...groups.values()].map((rows) => {
    const [current, previous] = rows;
    const previousPrice = previous?.price ?? null;
    const trend = previousPrice ? Number((((current.price - previousPrice) / previousPrice) * 100).toFixed(1)) : 0;
    return { ...current, previousPrice, trend };
  });
}

function filterCrop(prices: PriceSnapshot[], crop?: string) {
  return crop ? prices.filter((item) => item.crop.toLowerCase() === crop.toLowerCase()) : prices;
}
