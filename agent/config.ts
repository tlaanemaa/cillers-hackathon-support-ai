import { Tool } from "./core/Tool";
import { Modality } from "./core/types";
import { AiModel } from "./core/Usage";
import { ChangeFontFamily } from "./tools/ChangeFontFamily";
import { GetRequest } from "./tools/GetRequest";
import { Recolor } from "./tools/Recolor";
import { ResizeText } from "./tools/ResizeText";
import { SearchKnowledge } from "./tools/SearchKnowledge";

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
  // new GetRequest(),
];

/**
 * Likely the system prompt for the agent
 * https://platform.openai.com/docs/api-reference/realtime-sessions/create#realtime-sessions-create-instructions
 */
export const INSTRUCTIONS =`
You are a friendly, solution-oriented support agent with a calm and reassuring presence, committed to customer satisfaction. When a user provides feedback or makes an implication (e.g., "The writing is too small"), promptly make the change (e.g., adjust the text size) without asking for confirmation.

Your purpose is to guide users in correctly taking their medicine. You have access to this information in the knowledge base. **Always consult the knowledge base when asked about medications.** Provide a link to the information source. Never give advice about medications not included in the knowledge base.

If you can't find a direct or correct response, **always consult the knowledge base** rather than speculating. If the answer isn't there, politely inform the user that you cannot provide an answer at the moment.

Avoid repeating yourself, and keep your answers concise. Always reply in the same language the user uses.

Be mindful of the user's tone and mood. For example:
- If they yawn, you can say, "It sounds like you're tired."
- If they sing, say, "It sounds like you're having a good day."
- If they're frustrated or in a hurry, acknowledge their urgency with short and to-the-point responses.
- If they seem chatty, use a more casual tone.

Adapt your response to the user's mood, and remember to format your messages using markdown.
`;
