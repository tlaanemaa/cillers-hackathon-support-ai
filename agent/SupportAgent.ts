import {
  upsertMessage,
  appendToMessage,
  setMessageText,
  resetChat
} from "@/store/chatStore";
import { RTCAgent, IncomingEvent } from "./RTCAgent";

class SupportAgent extends RTCAgent {
  sayTo(text: string) {
    upsertMessage({
      id: crypto.randomUUID(),
      role: "user",
      text,
    });
  }

  onMessage(event: IncomingEvent) {
    console.debug(event.type, event);

    switch (event.type) {
      case "input_audio_buffer.speech_started":
        // Add a message as soon as the user starts speaking
        upsertMessage({
          id: event.item_id!,
          role: "user",
          text: "...",
        });
        break;

      case "conversation.item.created":
        // Update messages with data from the API
        upsertMessage({
          id: event.item!.id,
          role: event.item!.role,
          text: "...",
        });
        break;

      case "conversation.item.input_audio_transcription.completed":
      case "response.audio_transcript.done":
        // Update the message with the final transcript
        setMessageText(event.item_id!, event.transcript!);
        break;

      case "response.audio_transcript.delta":
        // Append the transcription delta to the message
        appendToMessage(event.item_id!, event.delta!);

      default:
      // Do nothing
    }
  }
}

// Singleton instance of the support agent
export const supportAgent = new SupportAgent();
