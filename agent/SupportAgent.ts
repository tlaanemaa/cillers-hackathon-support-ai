import { chatStore } from "@/store/chatStore";
import { RTCAgent, IncomingEvent } from "./core/RTCAgent";
import { TOOLS } from "./config";

/**
 * SupportAgent extends RTCAgent to manage user interactions in a chat environment.
 * It handles incoming messages, updates the chat interface, and controls the microphone.
 */
class SupportAgent extends RTCAgent {
  // List of tools available to the SupportAgent
  public readonly tools = TOOLS;

  /**
   * Sends a message on behalf of the user and updates the chat store.
   */
  sayTo(text: string) {
    chatStore().upsertMessage({
      id: crypto.randomUUID(), // Generate a unique ID for the message
      role: "user",
      text,
    });
    this.sendText(text); // Send the text message via RTCAgent
  }

  /**
   * Prepares the agent when it's ready to start interacting with the user.
   * It resets the chat, enables the microphone if applicable, and welcomes the user.
   */
  public onReady(): void {
    chatStore().resetChat(); // Clears previous chat history
    chatStore().setMicrophoneOn(this.microphoneEnabled); // Sync microphone state
    chatStore().setChatOn(true); // Enable chat session
    this.sendText(
      "Ask me what I need help with, be polite and welcoming and friendly."
    ); // Initial greeting message
  }

  /**
   * Handles incoming messages and updates the chat UI based on different event types.
   */
  onMessage(event: IncomingEvent) {
    switch (event.type) {
      case "input_audio_buffer.speech_started":
        // When user starts speaking, add a placeholder message
        chatStore().upsertMessage({
          id: event.item_id!,
          role: "user",
          text: "...", // Placeholder for ongoing speech-to-text processing
        });
        break;

      case "conversation.item.created":
        // Create a new message entry when an API-generated response is received
        chatStore().upsertMessage({
          id: event.item!.id,
          role: event.item!.role,
          text: "", // Initialize with empty text
        });
        break;

      case "conversation.item.input_audio_transcription.completed":
      case "response.audio_transcript.done":
        // Replace placeholder text with the final speech-to-text result
        chatStore().setMessageText(event.item_id!, event.transcript!);
        break;

      case "response.text.done":
        // Update the message with the final textual response from the system
        chatStore().setMessageText(event.item_id!, event.text!);
        break;

      case "response.text.delta":
      case "response.audio_transcript.delta":
        // Append the live transcription or response updates as they come in
        chatStore().appendMessageText(event.item_id!, event.delta!);
        break;

      default:
        // Ignore any unknown event types
        break;
    }
  }

  /**
   * Toggles the microphone on or off and updates the chat store accordingly.
   */
  public toggleMicrophone() {
    const enabled = !this.microphoneEnabled; // Toggle current state
    super.setMicrophone(enabled); // Update the microphone state in RTCAgent
    chatStore().setMicrophoneOn(this.microphoneEnabled); // Sync state with UI
  }
}

// Creates a singleton instance of SupportAgent to be used throughout the application
export const supportAgent = new SupportAgent();
