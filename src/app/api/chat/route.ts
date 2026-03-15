import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

/** Short system prompt to save input tokens */
const SYSTEM_PROMPT = `You are a friendly stylist in a closet app. Give brief outfit/style advice (1–2 short paragraphs). Warm, playful tone. Use closet context if given; otherwise give general tips.`;

/** Max conversation turns to send (user+model pairs) to limit input tokens */
const MAX_MESSAGES = 6;

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "no_api_key",
        message:
          "Add GEMINI_API_KEY to .env.local to enable the AI stylist. For now, try: 'What should I wear on a rainy day?' and we'll give you a tip.",
        fallback:
          "As if I could leave you clueless! Add GEMINI_API_KEY in .env.local to chat with the AI stylist. Until then: when it rains, go for your trench and waterproof shoes—you've got this.",
      },
      { status: 503 }
    );
  }

  let body: {
    messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
    context?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { messages: rawMessages, context } = body;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return NextResponse.json({ error: "messages array required" }, { status: 400 });
  }

  const filtered = rawMessages.filter((m) => m.role !== "system");
  const messages = filtered.slice(-MAX_MESSAGES);

  const systemInstruction = context
    ? `${SYSTEM_PROMPT}\nContext: ${context.slice(0, 400)}`
    : SYSTEM_PROMPT;

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: m.content.slice(0, 800) }],
  }));

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents,
      config: {
        systemInstruction,
        maxOutputTokens: 200,
        temperature: 0.6,
      },
    });

    const text = response.text?.trim();
    if (!text) {
      return NextResponse.json({ error: "Empty model response" }, { status: 500 });
    }

    return NextResponse.json({ message: text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const status = (err as { status?: number })?.status;
    const code = (err as { code?: number })?.code;

    // Rate limit / quota exceeded (429 or RESOURCE_EXHAUSTED)
    if (status === 429 || code === 429 || message.includes("RESOURCE_EXHAUSTED") || message.includes("quota")) {
      const retryMatch = message.match(/retry in ([\d.]+)s/i);
      const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 30;
      return NextResponse.json(
      {
        error: "rate_limit",
        message: "The AI stylist is getting a lot of requests. Please try again in a minute.",
        retryAfterSeconds: retrySeconds,
      },
      { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "gemini_error", message },
      { status: 500 }
    );
  }
}
