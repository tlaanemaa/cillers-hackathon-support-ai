import { NextResponse } from "next/server";
import { TOOLS, INSTRUCTIONS, MODEL, VOICE, MODALITIES } from "@/agent/config";

// https://platform.openai.com/docs/guides/realtime-webrtc

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
      model: MODEL,
      voice: VOICE,
      modalities: MODALITIES,
      instructions: INSTRUCTIONS,
      temperature: 0.6,
      input_audio_transcription: {
        model: "whisper-1",
      },
      tools: TOOLS.map((tool) => tool.toJSON()),
    }),
  });

  return new NextResponse(r.body, {
    status: r.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
