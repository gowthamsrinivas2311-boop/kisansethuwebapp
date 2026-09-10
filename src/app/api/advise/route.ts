import { NextRequest, NextResponse } from "next/server";
import type { Language } from "@/lib/types";

const fallbackAdvice: Record<Language, (crop: string, trend: number) => string> = {
  english: (crop, trend) => trend >= 0 ? `${crop} prices are rising. Compare your nearby APMC offers today and sell in small lots if the rise continues.` : `${crop} prices softened today. Hold only if storage is safe; otherwise sell to the nearest buyer with a better net return.`,
  hindi: (crop, trend) => trend >= 0 ? `${crop} के भाव बढ़ रहे हैं। आज आसपास की मंडियों के भाव देखें और तेजी रहने पर थोड़ा-थोड़ा माल बेचें।` : `${crop} के भाव आज घटे हैं। भंडारण सुरक्षित हो तभी रुकें, वरना बेहतर शुद्ध भाव वाली नजदीकी मंडी में बेचें।`,
  marathi: (crop, trend) => trend >= 0 ? `${crop} चे भाव वाढत आहेत. आज जवळच्या बाजारांचे दर तपासा आणि तेजी कायम राहिल्यास टप्प्याटप्प्याने विक्री करा.` : `${crop} चे भाव आज कमी झाले आहेत. साठवण सुरक्षित असेल तरच थांबा; अन्यथा जास्त निव्वळ भाव देणाऱ्या जवळच्या बाजारात विक्री करा.`,
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const crop = typeof body?.crop === "string" ? body.crop.slice(0, 40) : "Onion";
  const price = Number(body?.price) || 0;
  const trend = Number(body?.trend) || 0;
  const language: Language = body?.language === "hindi" || body?.language === "marathi" ? body.language : "english";
  const prompt = `Given crop=${crop}, price=${price}, trend=${trend}%, give 2-sentence selling recommendation in ${language}, ≤40 words.`;

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ advice: fallbackAdvice[language](crop, trend), mode: "demo", prompt });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: "You are a practical Indian agricultural market advisor. Be concise and avoid guarantees." }, { role: "user", content: prompt }],
        max_tokens: 90,
        temperature: 0.35,
      }),
    });
    const result = await response.json();
    const advice = result?.choices?.[0]?.message?.content?.trim();
    if (!response.ok || !advice) throw new Error("Groq did not return advice");
    return NextResponse.json({ advice, mode: "groq", prompt });
  } catch {
    return NextResponse.json({ advice: fallbackAdvice[language](crop, trend), mode: "fallback", prompt });
  }
}
