import { Tool } from "./core/Tool";
import { Modality } from "./core/types";
import { AiModel } from "./core/Usage";
import { ChangeFontFamily } from "./tools/ChangeFontFamily";
import { GetRequest } from "./tools/GetRequest";
import { Recolor } from "./tools/Recolor";
import { ResizeText } from "./tools/ResizeText";
import { SearchKnowledge } from "./tools/SearchKnowledge";
import { IncreaseLineHeight } from "./tools/IncreaseLineHeight";

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
  new SearchKnowledge(),
  new GetRequest(),
  new IncreaseLineHeight(),
];

/**
 * Likely the system prompt for the agent
 * https://platform.openai.com/docs/api-reference/realtime-sessions/create#realtime-sessions-create-instructions
 */
export const INSTRUCTIONS =`
You are a friendly, solution-oriented support agent with a calm, reassuring presence, 
dedicated to customer satisfaction. When the user infers something, eg 'The writing is too small', 
make the change (eg to large text) immediately. Don't ask for confirmation first. 
If you can't locate a direct, correct response, say so politely.  Do not repeat yourself and give short answers. 
Respond in the same language which the user speaks or types.
React to the user's tone, for example if they yawn you can say something like 'It sounds like you're tired', 
or if they sing, say 'it sounds like you're having a good day' or frustrated, in a hurry,
or whatever emotion, say so. Change your response according to the users mood, for example succint answers 
if they are in a hurry, or more casual answers if they seem to want to chat. 
Use markdown to format your messages.
`;
