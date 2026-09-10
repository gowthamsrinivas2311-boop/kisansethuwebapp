import { Price, PriceWithTrend, Listing } from './types';

// ─── Mock price data ──────────────────────────────────────────────
// ~20 rows: 6 crops × 4 markets × 2 dates each
// When wiring Supabase, replace only the function bodies below.

const MOCK_PRICES: Price[] = [
  // Onion
  { id: '1',  crop: 'Onion',   market: 'Nashik APMC',      price: 1800, unit: 'quintal', date: '2026-09-09', source: 'APMC' },
  { id: '2',  crop: 'Onion',   market: 'Nashik APMC',      price: 1650, unit: 'quintal', date: '2026-09-08', source: 'APMC' },
  { id: '3',  crop: 'Onion',   market: 'Pune APMC',        price: 1950, unit: 'quintal', date: '2026-09-09', source: 'APMC' },
  { id: '4',  crop: 'Onion',   market: 'Pune APMC',        price: 1900, unit: 'quintal', date: '2026-09-08', source: 'APMC' },
  // Tomato
  { id: '5',  crop: 'Tomato',  market: 'Nashik APMC',      price: 2200, unit: 'quintal', date: '2026-09-09', source: 'APMC' },
  { id: '6',  crop: 'Tomato',  market: 'Nashik APMC',      price: 2500, unit: 'quintal', date: '2026-09-08', source: 'APMC' },
  { id: '7',  crop: 'Tomato',  market: 'Nagpur APMC',      price: 2100, unit: 'quintal', date: '2026-09-09', source: 'APMC' },
  { id: '8',  crop: 'Tomato',  market: 'Nagpur APMC',      price: 2300, unit: 'quintal', date: '2026-09-08', source: 'APMC' },
  // Wheat
  { id: '9',  crop: 'Wheat',   market: 'Aurangabad APMC',  price: 2350, unit: 'quintal', date: '2026-09-09', source: 'APMC' },
  { id: '10', crop: 'Wheat',   market: 'Aurangabad APMC',  price: 2300, unit: 'quintal', date: '2026-09-08', source: 'APMC' },
  { id: '11', crop: 'Wheat',   market: 'Pune APMC',        price: 2400, unit: 'quintal', date: '2026-09-09', source: 'APMC' },
  { id: '12', crop: 'Wheat',   market: 'Pune APMC',        price: 2380, unit: 'quintal', date: '2026-09-08', source: 'APMC' },
  // Cotton
  { id: '13', crop: 'Cotton',  market: 'Nagpur APMC',      price: 6200, unit: 'quintal', date: '2026-09-09', source: 'APMC' },
  { id: '14', crop: 'Cotton',  market: 'Nagpur APMC',      price: 6500, unit: 'quintal', date: '2026-09-08', source: 'APMC' },
  { id: '15', crop: 'Cotton',  market: 'Aurangabad APMC',  price: 6100, unit: 'quintal', date: '2026-09-09', source: 'APMC' },
  { id: '16', crop: 'Cotton',  market: 'Aurangabad APMC',  price: 5900, unit: 'quintal', date: '2026-09-08', source: 'APMC' },
  // Soybean
  { id: '17', crop: 'Soybean', market: 'Nashik APMC',      price: 4500, unit: 'quintal', date: '2026-09-09', source: 'APMC' },
  { id: '18', crop: 'Soybean', market: 'Nashik APMC',      price: 4300, unit: 'quintal', date: '2026-09-08', source: 'APMC' },
  { id: '19', crop: 'Soybean', market: 'Nagpur APMC',      price: 4450, unit: 'quintal', date: '2026-09-09', source: 'APMC' },
  { id: '20', crop: 'Soybean', market: 'Nagpur APMC',      price: 4200, unit: 'quintal', date: '2026-09-08', source: 'APMC' },
  // Potato
  { id: '21', crop: 'Potato',  market: 'Pune APMC',        price: 1200, unit: 'quintal', date: '2026-09-09', source: 'APMC' },
  { id: '22', crop: 'Potato',  market: 'Pune APMC',        price: 1350, unit: 'quintal', date: '2026-09-08', source: 'APMC' },
  { id: '23', crop: 'Potato',  market: 'Aurangabad APMC',  price: 1150, unit: 'quintal', date: '2026-09-09', source: 'APMC' },
  { id: '24', crop: 'Potato',  market: 'Aurangabad APMC',  price: 1250, unit: 'quintal', date: '2026-09-08', source: 'APMC' },
];

// ─── In-memory listings store ─────────────────────────────────────

let mockListings: Listing[] = [
  {
    id: 'l1',
    farmer_name: 'Suresh Jadhav',
    crop: 'Onion',
    quantity: 50,
    price: 1800,
    location: 'Nashik',
    phone: '919876543210',
    created_at: '2026-09-09T08:30:00Z',
  },
  {
    id: 'l2',
    farmer_name: 'Anita Deshmukh',
    crop: 'Soybean',
    quantity: 30,
    price: 4500,
    location: 'Nagpur',
    phone: '919876543211',
    created_at: '2026-09-09T09:15:00Z',
  },
  {
    id: 'l3',
    farmer_name: 'Manoj Patil',
    crop: 'Tomato',
    quantity: 20,
    price: 2200,
    location: 'Pune',
    phone: '919876543212',
    created_at: '2026-09-09T10:00:00Z',
  },
  {
    id: 'l4',
    farmer_name: 'Rekha Shinde',
    crop: 'Cotton',
    quantity: 100,
    price: 6200,
    location: 'Aurangabad',
    phone: '919876543213',
    created_at: '2026-09-08T14:20:00Z',
  },
  {
    id: 'l5',
    farmer_name: 'Vishal More',
    crop: 'Wheat',
    quantity: 75,
    price: 2400,
    location: 'Pune',
    phone: '919876543214',
    created_at: '2026-09-08T16:45:00Z',
  },
];

// ─── Public API ───────────────────────────────────────────────────

/**
 * Returns prices with trend information.
 * Optionally filter by crop name.
 * To wire Supabase: replace body with a query to the `prices` table.
 */
export async function getPrices(crop?: string): Promise<PriceWithTrend[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 100));

  let filtered = MOCK_PRICES;
  if (crop) {
    filtered = filtered.filter((p) => p.crop.toLowerCase() === crop.toLowerCase());
  }

  // Group by crop+market, compute trend from latest two dates
  const grouped = new Map<string, Price[]>();
  for (const p of filtered) {
    const key = `${p.crop}|${p.market}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(p);
  }

  const result: PriceWithTrend[] = [];
  for (const [, prices] of grouped) {
    const sorted = [...prices].sort((a, b) => b.date.localeCompare(a.date));
    const latest = sorted[0];
    const previous = sorted[1] || sorted[0];
    const trend = previous.price === 0 ? 0 : ((latest.price - previous.price) / previous.price) * 100;

    result.push({
      ...latest,
      trend: Math.round(trend * 10) / 10,
      previousPrice: previous.price,
    });
  }

  return result;
}

/**
 * Returns all marketplace listings.
 * To wire Supabase: replace body with a query to the `listings` table.
 */
export async function getListings(): Promise<Listing[]> {
  await new Promise((r) => setTimeout(r, 100));
  return [...mockListings].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Creates a new listing and returns it.
 * To wire Supabase: replace body with an insert into the `listings` table.
 */
export async function createListing(
  listing: Omit<Listing, 'id' | 'created_at'>
): Promise<Listing> {
  await new Promise((r) => setTimeout(r, 200));
  const newListing: Listing = {
    ...listing,
    id: `l${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  mockListings = [newListing, ...mockListings];
  return newListing;
}

/**
 * Helper: get unique crop names from mock data.
 */
export async function getCrops(): Promise<string[]> {
  const crops = new Set(MOCK_PRICES.map((p) => p.crop));
  return Array.from(crops);
}

/**
 * Helper: get unique market names from mock data.
 */
export async function getMarkets(): Promise<string[]> {
  const markets = new Set(MOCK_PRICES.map((p) => p.market));
  return Array.from(markets);
}
