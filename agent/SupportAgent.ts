import { chatStore } from "@/store/chatStore";
import { RTCAgent, IncomingEvent } from "./RTCAgent";
import { TOOLS } from "./tools";

class SupportAgent extends RTCAgent {
  public readonly tools = TOOLS;

  sayTo(text: string) {
    chatStore().upsertMessage({
      id: crypto.randomUUID(),
      role: "user",
      text,
    });
    this.sendText(text);
  }

  public onReady(): void {
    // Add a welcome message when the agent is ready
    chatStore().resetChat();
    chatStore().setChatOn(true);
    this.sendText(
      "Ask me what I need help with, be polite and welcoming and friendly."
    );
  }

  onMessage(event: IncomingEvent) {
    switch (event.type) {
      case "input_audio_buffer.speech_started":
        // Add a message as soon as the user starts speaking
        chatStore().upsertMessage({
          id: event.item_id!,
          role: "user",
          text: "...",
        });
        break;

      case "conversation.item.created":
        // Update messages with data from the API
        chatStore().upsertMessage({
          id: event.item!.id,
          role: event.item!.role,
          text: "",
        });
        break;

      case "conversation.item.input_audio_transcription.completed":
      case "response.audio_transcript.done":
        // Update the message with the final transcript
        chatStore().setMessageText(event.item_id!, event.transcript!);
        break;

      case "response.text.done":
        // Update the message with the final response
        chatStore().setMessageText(event.item_id!, event.text!);
        break;

      case "response.text.delta":
      case "response.audio_transcript.delta":
        // Append the transcription delta to the message
        chatStore().appendMessageText(event.item_id!, event.delta!);
        break;

      default:
      // Do nothing
    }
  }

  public toggleMicrophone() {
    const enabled = !this.microphoneEnabled;
    super.setMicrophone(enabled);
    chatStore().setMicrophoneOn(this.microphoneEnabled);
  }
}

// Singleton instance of the support agent
export const supportAgent = new SupportAgent();
