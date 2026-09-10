import { NextRequest, NextResponse } from "next/server";
import type { Language } from "@/lib/types";

type ChatMessage = { role: "user" | "assistant"; content: string };

function demoAnswer(crop: string, trend: number, question: string, language: Language) {
  if (language === "hindi") return `${crop} ka rujhan ${trend >= 0 ? "sakaraatmak" : "kamzor"} hai. Mandi, parivahan aur bhandaran laagat ki tulna karke hi bikri ka nirnay lein.`;
  if (language === "marathi") return `${crop} cha kal ${trend >= 0 ? "sakaraatmak" : "kamzor"} aahe. Bazaarbhav, vahatuk ani sathavan kharch tapasoonach vikricha nirnay ghya.`;
  if (question.toLowerCase().includes("hold") || question.toLowerCase().includes("wait")) return `${crop} is ${trend >= 0 ? "showing positive momentum" : "under price pressure"}. Hold only when safe storage and your expected gain exceed transport, storage, and spoilage risk.`;
  return `${crop} is currently ${trend >= 0 ? "trending up" : "trending down"}. Compare two nearby market offers and your net return before committing a quantity; avoid relying on a single day's movement.`;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const crop = typeof body?.crop === "string" ? body.crop.slice(0, 40) : "Onion";
  const price = Number(body?.price) || 0;
  const trend = Number(body?.trend) || 0;
  const question = typeof body?.question === "string" ? body.question.trim().slice(0, 400) : "";
  const language: Language = body?.language === "hindi" || body?.language === "marathi" ? body.language : "english";
  const history: ChatMessage[] = Array.isArray(body?.history)
    ? body.history.slice(-6).filter((message: unknown): message is ChatMessage => Boolean(message && typeof message === "object" && ((message as ChatMessage).role === "user" || (message as ChatMessage).role === "assistant") && typeof (message as ChatMessage).content === "string"))
    : [];
  const prompt = question
    ? `Market context: crop=${crop}, price=${price} per quintal, trend=${trend}%. Farmer question: ${question}. Answer in ${language}, under 70 words, practical and cautious. Do not invent live prices or guarantees.`
    : `Given crop=${crop}, price=${price}, trend=${trend}%, give a two-sentence selling recommendation in ${language}, under 40 words.`;

  if (!process.env.GROQ_API_KEY) return NextResponse.json({ advice: demoAnswer(crop, trend, question, language), mode: "demo", prompt });

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: "You are KisanSetu's practical Indian agricultural market advisor. Give concise, cautious answers. State when local verification is needed and never guarantee market prices." }, ...history, { role: "user", content: prompt }],
        max_tokens: 160,
        temperature: 0.35,
      }),
    });
    const result = await response.json();
    const advice = result?.choices?.[0]?.message?.content?.trim();
    if (!response.ok || !advice) throw new Error("Groq did not return advice");
    return NextResponse.json({ advice, mode: "groq", prompt });
  } catch {
    return NextResponse.json({ advice: demoAnswer(crop, trend, question, language), mode: "fallback", prompt });
  }
}
