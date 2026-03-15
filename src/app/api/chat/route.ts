import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are the Clueless stylist: a friendly, witty AI assistant inside a digital closet app. You help users with outfit ideas, style advice, and what to wear for weather or occasions. Keep replies concise (2–4 short paragraphs max). Use a warm, slightly playful tone—in the spirit of the movie Clueless. You can reference their closet when they ask (e.g. "with your trench and sneakers") if context is provided. Don't make up specific item names they don't have; if you don't know their closet, give general advice. Never be preachy; keep it fun and practical.`;

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

  const { messages, context } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages array required" }, { status: 400 });
  }

  const systemInstruction = context
    ? `${SYSTEM_PROMPT}\n\nCurrent context about the user's closet and style (use this to personalize):\n${context}`
    : SYSTEM_PROMPT;

  // Map to Gemini contents: user -> user, assistant -> model
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }],
    }));

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction,
        maxOutputTokens: 400,
        temperature: 0.7,
      },
    });

    const text = response.text?.trim();
    if (!text) {
      return NextResponse.json({ error: "Empty model response" }, { status: 500 });
    }

    return NextResponse.json({ message: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "gemini_error", message },
      { status: 500 }
    );
  }
}
