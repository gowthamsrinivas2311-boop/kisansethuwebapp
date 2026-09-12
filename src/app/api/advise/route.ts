import { NextRequest, NextResponse } from "next/server";
import type { Language } from "@/lib/types";

type ChatMessage = { role: "user" | "assistant"; content: string };
type StoredSession = { summary: string; messages: ChatMessage[] };

const sessions = new Map<string, StoredSession>();
const MAX_TURNS = 15;

function isVague(question: string) {
  return /^(hi|hello|hey|yo|\.|\?|ok|hmm)$/i.test(question.trim());
}

function similarity(a: string, b: string) {
  const left = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
  const right = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
  const overlap = [...left].filter((word) => right.has(word)).length;
  return overlap / Math.max(left.size, right.size, 1);
}

function trimSession(session: StoredSession) {
  if (session.messages.length <= MAX_TURNS * 2) return session;
  const removed = session.messages.slice(0, -MAX_TURNS * 2);
  const removedText = removed.map((message) => `${message.role}: ${message.content}`).join(" ");
  session.summary = `${session.summary} Earlier conversation: ${removedText}`.trim().slice(-1200);
  session.messages = session.messages.slice(-MAX_TURNS * 2);
  return session;
}

function demoAnswer(crop: string, trend: number, question: string, language: Language) {
  if (isVague(question)) {
    if (language === "hindi") return "Namaskar. Aap kis crop, mandi, ya selling decision ke baare mein madad chahte hain?";
    if (language === "marathi") return "Namaskar. Kontya pik, mandi, kiwa vikri nirnayabaddal madat havi aahe?";
    return "Namaskar. Which crop, market, or selling decision should I help with today?";
  }
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
  const sessionId = typeof body?.sessionId === "string" && body.sessionId.trim() ? body.sessionId.trim().slice(0, 120) : "anonymous";
  const session = trimSession(sessions.get(sessionId) ?? { summary: "", messages: [] });
  const isFirstMessage = session.messages.length === 0;
  session.messages.push({ role: "user", content: question });

  const systemPrompt = `You are KisanSetu's practical Indian agricultural market advisor.
Current market context: crop=${crop}, price=${price} per quintal, trend=${trend}%.
Respond in ${language}, under 70 words, practical and cautious.
Only give the market status summary on the first message of a session; first message: ${isFirstMessage ? "yes" : "no"}.
On later messages, respond specifically to what the farmer typed.
If the message is only a greeting or too vague, ask one short clarifying question instead of repeating the market summary.
Never invent live prices or guarantee market outcomes.
${session.summary ? `Conversation summary: ${session.summary}` : ""}`;

  if (!process.env.GROQ_API_KEY) {
    const advice = demoAnswer(crop, trend, question, language);
    session.messages.push({ role: "assistant", content: advice });
    sessions.set(sessionId, trimSession(session));
    return NextResponse.json({ advice, mode: "demo" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: systemPrompt }, ...session.messages],
        max_tokens: 160,
        temperature: 0.7,
      }),
    });
    const result = await response.json();
    const advice = result?.choices?.[0]?.message?.content?.trim();
    if (!response.ok || !advice) throw new Error("Groq did not return advice");
    const lastAssistant = [...session.messages].reverse().find((message) => message.role === "assistant");
    if (lastAssistant && similarity(lastAssistant.content, advice) > 0.9) console.warn("KisanSetu advisor returned a near-duplicate reply", { sessionId });
    session.messages.push({ role: "assistant", content: advice });
    sessions.set(sessionId, trimSession(session));
    return NextResponse.json({ advice, mode: "groq" });
  } catch {
    const advice = demoAnswer(crop, trend, question, language);
    session.messages.push({ role: "assistant", content: advice });
    sessions.set(sessionId, trimSession(session));
    return NextResponse.json({ advice, mode: "fallback" });
  }
}
