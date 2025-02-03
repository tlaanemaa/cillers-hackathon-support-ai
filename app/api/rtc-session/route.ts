import { NextResponse } from "next/server";
import { TOOLS } from "@/agent/tools";

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
      model: "gpt-4o-mini-realtime-preview", // Change model here
      voice: "alloy", // Change voice here (alloy)
      modalities: ["audio", "text"],
      instructions:
        "You are a friendly, solution-oriented support agent with a calm, reassuring presence, dedicated to customer satisfaction.",
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
