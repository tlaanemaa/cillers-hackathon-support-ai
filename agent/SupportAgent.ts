import {
  upsertMessage,
  appendToMessage,
  setMessageText,
  resetChat,
  setChatOn,
} from "@/store/chatStore";
import { RTCAgent, IncomingEvent } from "./RTCAgent";

class SupportAgent extends RTCAgent {
  sayTo(text: string) {
    upsertMessage({
      id: crypto.randomUUID(),
      role: "user",
      text,
    });
    this.send({
      type: "response.create",
      response: {
        modalities: ["text", "audio"],
        instructions: text,
      },
    });
  }

  public onReady(): void {
    // Add a welcome message when the agent is ready
    resetChat();
    setChatOn(true);
    this.send({
      type: "response.create",
      response: {
        modalities: ["text", "audio"],
        instructions: "Ask me what I need help with, be polite and welcoming and friendly.",
      },
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

      case "response.text.done":
        // Update the message with the final response
        setMessageText(event.item_id!, event.text!);
        break;

      case "response.text.delta":
      case "response.audio_transcript.delta":
        // Append the transcription delta to the message
        appendToMessage(event.item_id!, event.delta!);
        break;

      default:
      // Do nothing
    }
  }
}

// Singleton instance of the support agent
export const supportAgent = new SupportAgent();
