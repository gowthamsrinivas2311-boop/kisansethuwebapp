export type Language = "english" | "hindi" | "marathi";

export type PriceSnapshot = {
  crop: string;
  market: string;
  price: number;
  unit: string;
  date: string;
  source: string;
  trend: number;
  previousPrice: number | null;
  history: number[];
};

// Kept for the original mock-data helpers, while API routes use PriceSnapshot.
export type Price = {
  id: string;
  crop: string;
  market: string;
  price: number;
  unit: string;
  date: string;
  source: string;
};

export type PriceWithTrend = Price & {
  trend: number;
  previousPrice: number;
};

export type Listing = {
  id: string;
  farmer_name: string;
  crop: string;
  quantity: number;
  price: number;
  location: string;
  phone: string;
  created_at: string;
};
