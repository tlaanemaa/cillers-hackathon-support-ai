import { Tool } from "./core/Tool";
import { Modality } from "./core/types";
import { AiModel } from "./core/Usage";
import { ChangeFontFamily } from "./tools/ChangeFontFamily";
import { Recolor } from "./tools/Recolor";
import { ResizeText } from "./tools/ResizeText";

/*
  All sorts of configurations for the agent
  The actual session creation request is done in app/api/rtc-session/route.ts
  The agent behavior is configured in agent/SupportAgent.ts
*/

/**
 * The model used by the agent
 * https://platform.openai.com/docs/api-reference/realtime-sessions/create#realtime-sessions-create-model
 */
export const MODEL: AiModel = "gpt-4o-mini-realtime-preview";

/**
 * The voice used by the agent
 * https://platform.openai.com/docs/api-reference/realtime-sessions/create#realtime-sessions-create-voice
 */
export const VOICE = "alloy";

/**
 * List of modalities that the agent can use
 * Can be "text" or "audio"
 * https://platform.openai.com/docs/api-reference/realtime-sessions/create#realtime-sessions-create-modalities
 */
export const MODALITIES: Modality[] = ["text"];

/**
 * List of tools that the agent can use
 * https://platform.openai.com/docs/api-reference/realtime-sessions/create#realtime-sessions-create-tools
 */
export const TOOLS: Tool[] = [
  // Add your tools here
  new Recolor(),
  new ResizeText(),
  new ChangeFontFamily(),
];

/**
 * Likely the system prompt for the agent
 * https://platform.openai.com/docs/api-reference/realtime-sessions/create#realtime-sessions-create-instructions
 */
export const INSTRUCTIONS =
  "You are a friendly, solution-oriented support agent with a calm, reassuring presence, dedicated to customer satisfaction. Use markdown to format your messages. Be pro-active, don't ask for too many details, and provide clear, concise answers. If you need help, just ask!";
