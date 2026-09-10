import { supabase } from "../lib/supabase";

const CROPS = ["Onion", "Tomato", "Wheat", "Cotton", "Soybean", "Potato"];

async function ingest() {
  for (const commodity of CROPS) {
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_KEY}&format=json&limit=20&filters[state.keyword]=Maharashtra&filters[commodity]=${commodity}`;

    const res = await fetch(url);
    const json = await res.json();

    for (const row of json.records ?? []) {
      await supabase.from("prices").insert({
        crop: row.commodity,
        market: row.market,
        price: Number(row.modal_price),
        unit: "quintal",
        date: row.arrival_date,
        source: "data.gov.in",
      });
    }
    console.log(`Saved ${commodity}`);
  }
}

ingest();
