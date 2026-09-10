import type { Listing, PriceSnapshot } from "@/lib/types";

const latest = "2026-09-10";

export const DEMO_PRICES: PriceSnapshot[] = [
  { crop: "Onion", market: "Nashik APMC", price: 2180, previousPrice: 1960, trend: 11.2, unit: "quintal", date: latest, source: "APMC daily bulletin" },
  { crop: "Onion", market: "Pune APMC", price: 2100, previousPrice: 2160, trend: -2.8, unit: "quintal", date: latest, source: "APMC daily bulletin" },
  { crop: "Tomato", market: "Nashik APMC", price: 2840, previousPrice: 2540, trend: 11.8, unit: "quintal", date: latest, source: "APMC daily bulletin" },
  { crop: "Tomato", market: "Nagpur APMC", price: 2610, previousPrice: 2740, trend: -4.7, unit: "quintal", date: latest, source: "APMC daily bulletin" },
  { crop: "Wheat", market: "Pune APMC", price: 2525, previousPrice: 2480, trend: 1.8, unit: "quintal", date: latest, source: "APMC daily bulletin" },
  { crop: "Wheat", market: "Aurangabad APMC", price: 2470, previousPrice: 2500, trend: -1.2, unit: "quintal", date: latest, source: "APMC daily bulletin" },
  { crop: "Cotton", market: "Nagpur APMC", price: 7240, previousPrice: 6980, trend: 3.7, unit: "quintal", date: latest, source: "APMC daily bulletin" },
  { crop: "Cotton", market: "Aurangabad APMC", price: 7090, previousPrice: 7140, trend: -0.7, unit: "quintal", date: latest, source: "APMC daily bulletin" },
  { crop: "Soybean", market: "Nashik APMC", price: 4530, previousPrice: 4390, trend: 3.2, unit: "quintal", date: latest, source: "APMC daily bulletin" },
  { crop: "Soybean", market: "Nagpur APMC", price: 4470, previousPrice: 4520, trend: -1.1, unit: "quintal", date: latest, source: "APMC daily bulletin" },
  { crop: "Potato", market: "Pune APMC", price: 1780, previousPrice: 1650, trend: 7.9, unit: "quintal", date: latest, source: "APMC daily bulletin" },
  { crop: "Potato", market: "Aurangabad APMC", price: 1710, previousPrice: 1770, trend: -3.4, unit: "quintal", date: latest, source: "APMC daily bulletin" },
];

export const DEMO_LISTINGS: Listing[] = [
  { id: "demo-onion", farmer_name: "Sanjay Patil", crop: "Onion", quantity: 32, price: 2150, location: "Niphad, Nashik", phone: "919820000001", created_at: latest },
  { id: "demo-soybean", farmer_name: "Meera Jadhav", crop: "Soybean", quantity: 18, price: 4480, location: "Katol, Nagpur", phone: "919820000002", created_at: latest },
  { id: "demo-tomato", farmer_name: "Ramesh Shinde", crop: "Tomato", quantity: 12, price: 2780, location: "Junnar, Pune", phone: "919820000003", created_at: latest },
];

export const CROPS = ["Onion", "Tomato", "Wheat", "Cotton", "Soybean", "Potato"];
export const MARKETS = ["Nashik APMC", "Pune APMC", "Nagpur APMC", "Aurangabad APMC"];
