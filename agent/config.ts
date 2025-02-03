import { Tool } from "./core/Tool";
import { Modality } from "./core/types";
import { AiModel } from "./core/Usage";
import { Recolor } from "./tools/Recolor";

// OpenAI realtime model configuration params
export const MODEL: AiModel = "gpt-4o-mini-realtime-preview";
export const VOICE = "alloy";
export const MODALITIES: Modality[] = ["text"]; // ["text", "audio"] for audio support
export const TOOLS: Tool[] = [
  // Add your tools here
  new Recolor(),
];
export const INSTRUCTIONS =
  "You are a friendly, solution-oriented support agent with a calm, reassuring presence, dedicated to customer satisfaction.";
