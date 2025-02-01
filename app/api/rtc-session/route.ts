import { NextResponse } from "next/server";

export async function GET() {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Missing OpenAI API key" },
      { status: 500 }
    );
  }

  const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-realtime-preview-2024-12-17", // Change model here
      voice: "verse", // Change voice here
      modalities: ["audio", "text"],
      instructions:
        "You are an expert support agent, you talk in English and Estonian and provide helpful funny concise answers.",
      input_audio_transcription: {
        model: "whisper-1",
      },
    }),
  });

  return new NextResponse(r.body, {
    status: r.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
