import {
  createMessage,
  appendToMessage,
  setMessageText,
} from "@/store/chatStore";
import { RTCAgent, IncomingEvent } from "./RTCAgent";

export class SupportAgent extends RTCAgent {
  onMessage(event: IncomingEvent) {
    console.log(event.type, event);

    switch (event.type) {
      case "input_audio_buffer.speech_started":
        createMessage({
          id: event.item_id!,
          role: "user",
          text: "...",
        });
        break;

      case "conversation.item.created":
        createMessage({
          id: event.item!.id,
          role: event.item!.role,
          text: "",
        });
        break;

      case "conversation.item.input_audio_transcription.completed":
      case "response.audio_transcript.done":
        setMessageText(event.item_id!, event.transcript! || "🤷");
        break;

      case "response.audio_transcript.delta":
        appendToMessage(event.item_id!, event.delta!);

      case "response.audio_transcript.done":

      default:
      // Do nothing
    }
  }
}
