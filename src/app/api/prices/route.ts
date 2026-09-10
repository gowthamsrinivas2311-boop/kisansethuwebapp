import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data } = await supabase
    .from("prices")
    .select("*")
    .order("date", { ascending: false });

  return Response.json(data);
}
