import { getSupabaseServerClient } from "@/lib/supabase";
import type { PriceSnapshot } from "@/lib/types";

export const dynamic = "force-dynamic";

interface PriceRow {
  crop: string;
  market: string;
  price: number;
  unit: string;
  date: string;
  source: string;
}

import { DEMO_PRICES } from "@/lib/demo-data";

export async function GET() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return Response.json(DEMO_PRICES);

  // Fetch the last 14 days of data to have enough for sparklines and trend
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  const cutoffDate = fourteenDaysAgo.toISOString().split("T")[0];

  let { data, error } = await supabase
    .from("prices")
    .select("crop, market, price, unit, date, source")
    .gte("date", cutoffDate)
    .order("date", { ascending: false });

  // If sparse reporting and no records in last 14 days, fetch latest available records
  if (!error && (!data || data.length === 0)) {
    const fallbackRes = await supabase
      .from("prices")
      .select("crop, market, price, unit, date, source")
      .order("date", { ascending: false })
      .limit(500);
    data = fallbackRes.data;
    error = fallbackRes.error;
  }

  if (error || !data || data.length === 0) {
    return Response.json(DEMO_PRICES);
  }

  const rows = data as PriceRow[];

  // Group rows by crop, then by date → compute daily averages
  const cropMap = new Map<
    string,
    Map<string, { totalPrice: number; count: number }>
  >();

  for (const row of rows) {
    if (!cropMap.has(row.crop)) {
      cropMap.set(row.crop, new Map());
    }
    const dateMap = cropMap.get(row.crop)!;
    if (!dateMap.has(row.date)) {
      dateMap.set(row.date, { totalPrice: 0, count: 0 });
    }
    const entry = dateMap.get(row.date)!;
    entry.totalPrice += row.price;
    entry.count += 1;
  }

  const snapshots: PriceSnapshot[] = [];

  for (const [crop, dateMap] of cropMap) {
    // Sort dates descending so index 0 = most recent
    const sortedDates = [...dateMap.keys()].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    if (sortedDates.length === 0) continue;

    // Compute daily averages
    const dailyAverages: { date: string; avg: number }[] = sortedDates.map(
      (date) => {
        const entry = dateMap.get(date)!;
        return { date, avg: Math.round(entry.totalPrice / entry.count) };
      }
    );

    const latestDate = dailyAverages[0].date;
    const latestPrice = dailyAverages[0].avg;

    // Previous date price (second most recent) for trend calculation
    const previousPrice =
      dailyAverages.length >= 2 ? dailyAverages[1].avg : null;

    // Trend: % change from previous date to latest date
    let trend = 0;
    if (previousPrice !== null && previousPrice > 0) {
      trend = parseFloat(
        (((latestPrice - previousPrice) / previousPrice) * 100).toFixed(1)
      );
    }

    // History: up to 7 most recent daily averages, ordered oldest→newest for sparklines
    const historySlice = dailyAverages.slice(0, 7).reverse();
    const history = historySlice.map((d) => d.avg);

    snapshots.push({
      crop,
      market: "Maharashtra APMC avg",
      price: latestPrice,
      unit: "quintal",
      date: latestDate,
      source: "Agmarknet (data.gov.in)",
      trend,
      previousPrice,
      history,
    });
  }

  // Sort by crop name for consistent ordering
  snapshots.sort((a, b) => a.crop.localeCompare(b.crop));

  return Response.json(snapshots);
}
