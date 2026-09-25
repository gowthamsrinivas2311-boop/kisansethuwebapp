import { NextRequest, NextResponse } from "next/server";
import { DEMO_LISTINGS } from "@/lib/demo-data";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Listing } from "@/lib/types";

let localListings = [...DEMO_LISTINGS];

export async function GET() {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
    if (!error && data && data.length > 0) return NextResponse.json({ listings: data, source: "supabase" });
  }
  return NextResponse.json({ listings: localListings, source: "demo" });
}

export async function POST(request: NextRequest) {
  const input = await request.json().catch(() => null);
  const required = ["farmer_name", "crop", "location", "phone"] as const;
  if (!input || required.some((field) => !String(input[field] ?? "").trim()) || !Number(input.quantity) || !Number(input.price)) {
    return NextResponse.json({ error: "Please complete all listing details." }, { status: 400 });
  }

  const listing = {
    farmer_name: String(input.farmer_name).trim().slice(0, 80),
    crop: String(input.crop).trim().slice(0, 40),
    quantity: Number(input.quantity),
    price: Number(input.price),
    location: String(input.location).trim().slice(0, 100),
    phone: String(input.phone).replace(/\D/g, "").slice(0, 15),
  };
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase.from("listings").insert(listing).select().single();
    if (!error && data) return NextResponse.json({ listing: data, source: "supabase" }, { status: 201 });
  }

  const demoListing: Listing = { ...listing, id: `demo-${Date.now()}`, created_at: new Date().toISOString() };
  localListings = [demoListing, ...localListings];
  return NextResponse.json({ listing: demoListing, source: "demo" }, { status: 201 });
}
