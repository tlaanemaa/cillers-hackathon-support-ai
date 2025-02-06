// Build according to https://platform.openai.com/docs/guides/realtime-webrtc

import { Tool } from "./Tool";
import { Usage, AiModel } from "./Usage";

export type ClientEvent = {
  type: string;
  response?: {
    modalities: string[];
    instructions?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item?: any;
};

export type IncomingEvent = {
  event_id: string;
  response_id: string;
  type: string;
  item_id?: string;
  transcript?: string;
  text?: string;
  delta?: string;
  item?: {
    id: string;
    object: string;
    role: "user" | "assistant";
    status: string;
    type: string;
  };
  response?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    output: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    usage?: any;
  };
};

// https://platform.openai.com/docs/guides/realtime-model-capabilities#detect-when-the-model-wants-to-call-a-function
export type ToolCall = {
  object: string;
  id: string;
  type: string;
  status: string;
  name: string;
  call_id: string;
  arguments: string;
};

export abstract class RTCAgent {
  public model?: AiModel;
  public usage?: Usage;
  public modalities?: string[];
  private key?: string;
  private connection?: RTCPeerConnection;
  private audioElement?: HTMLAudioElement;
  private dataChannel?: RTCDataChannel;
  private micTrack?: MediaStreamTrack;
  public isReady = false;
  public readonly tools: Tool[] = [];

  public async init() {
    // Get an ephemeral key from your server - see server code below
    const tokenResponse = await fetch("/api/rtc-session"); // API code is in ./app/api/rtc-session/route.ts
    const data = await tokenResponse.json();
    this.key = data.client_secret.value;
    this.model = data.model;
    this.usage = new Usage(data.model);
    this.modalities = data.modalities;

    // Create a peer connection
    this.connection = new RTCPeerConnection();

    // Set up to play remote audio from the model
    this.audioElement = document.createElement("audio");
    this.audioElement.autoplay = true;
    this.connection.ontrack = (e) =>
      (this.audioElement!.srcObject = e.streams[0]);

    // Add local audio track for microphone input
    const ms = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    this.micTrack = ms.getAudioTracks()[0]; // Store the mic track
    if (!this.modalities?.includes("audio")) this.micTrack.enabled = false;
    this.connection.addTrack(this.micTrack);

    // Set up data channel for sending and receiving events
    this.dataChannel = this.connection.createDataChannel("oai-events");
    this.dataChannel.addEventListener("message", this.handleMessage.bind(this));

    // Start the session using the Session Description Protocol (SDP)
    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);

    const baseUrl = "https://api.openai.com/v1/realtime";
    const sdpResponse = await fetch(`${baseUrl}?model=${this.model}`, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${this.key}`,
        "Content-Type": "application/sdp",
      },
    });

    await this.connection.setRemoteDescription({
      type: "answer",
      sdp: await sdpResponse.text(),
    });
  }

  private handleMessage(e: MessageEvent) {
    // Realtime events will come here
    const event: IncomingEvent = JSON.parse(e.data);
    console.debug("💬 ", event.type, "\n", event);

    // Handle sessions start
    if (!this.isReady && event.type === "session.created") {
      this.isReady = true;
      return this.onReady();
    }

    // Handle tool calls and track usage
    if (event.type === "response.done") {
      this.usage?.add(event.response?.usage);
      this.usage?.log();
      const output = event?.response?.output ?? [];
      output
        .filter((x) => x.type === "function_call")
        .map((call) => this.handleToolCall(call));
    }

    // Handle incoming messages
    this.onMessage(event);
  }

  private async handleToolCall(toolCall: ToolCall) {
    console.debug("🛠️ Tool call:\n", toolCall);
    const tool = this.tools.find((t) => t.name === toolCall.name);

    try {
      if (!tool) throw new Error(`Tool not found: ${toolCall.name}`);
      const args = JSON.parse(toolCall.arguments);
      const result = await tool.run(args);
      console.debug("🛠️ Tool response:", toolCall.call_id, "\n", result);
      this.send({
        type: "conversation.item.create",
        item: {
          type: "function_call_output",
          call_id: toolCall.call_id,
          output: JSON.stringify(result) || "Done!",
        },
      });
    } catch (e) {
      console.error("Error running tool:", e);
      this.send({
        type: "conversation.item.create",
        item: {
          type: "function_call_output",
          call_id: toolCall.call_id,
          output: JSON.stringify(e instanceof Error ? e.message : String(e)),
        },
      });
    }
  }

  /**
   * Called when the agent is ready to receive messages
   */
  public abstract onReady(): void;

  /**
   * Called when a message is received from the OpenAI API
   */
  public abstract onMessage(data: IncomingEvent): void;

  /**
   * Send an event to the OpenAI API
   */
  public send(event: ClientEvent) {
    this.dataChannel?.send(JSON.stringify(event));
  }

  /**
   * Send a text message to the OpenAI API
   */
  public sendText(text: string, modalities = this.modalities ?? ["text"]) {
    this.send({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text,
          },
        ],
      },
    });

    this.send({
      type: "response.create",
      response: { modalities },
    });
  }

  /**
   * Close the connection and clean up resources
   */
  public close() {
    this.dataChannel?.close();
    this.connection?.close();
    this.audioElement?.remove();
    this.micTrack?.stop(); // Ensure the mic is turned off when closing
  }

  /**
   * Enable or disable the microphone
   */
  public setMicrophone(enabled: boolean) {
    if (!this.micTrack) return;
    this.micTrack.enabled = enabled;
  }

  /**
   * Get the current microphone status
   */
  public get microphoneEnabled(): boolean {
    if (!this.micTrack) return false;
    return this.micTrack.enabled;
  }
}
