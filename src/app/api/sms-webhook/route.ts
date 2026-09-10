import twilio from "twilio";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const formData = await req.formData();
  const body = (formData.get("Body") as string)?.trim().toUpperCase();
  const supabase = getSupabaseServerClient();

  const { data } = supabase
    ? await supabase
      .from("prices")
      .select("*")
      .ilike("crop", body)
      .order("date", { ascending: false })
      .limit(1)
      .single()
    : { data: null };

  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(
    data
      ? `${data.crop} @ ${data.market}: Rs ${data.price}/${data.unit}`
      : `No price found for "${body}". Try ONION, WHEAT, COTTON.`
  );

  return new Response(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
