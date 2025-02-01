// Build according to https://platform.openai.com/docs/guides/realtime-webrtc

export type ClientEvent = {
  type: string;
  response: {
    modalities: string[];
    instructions: string;
  };
};

export type IncomingEvent = {
  event_id: string;
  response_id: string;
  type: string;
  item_id?: string;
  transcript?: string;
  delta?: string;
  item?: {
    id: string;
    object: string;
    role: "user" | "assistant";
    status: string;
    type: string;
  };
};

export abstract class RTCAgent {
  private model?: string;
  private key?: string;
  private connection?: RTCPeerConnection;
  private audioElement?: HTMLAudioElement;
  private dataChannel?: RTCDataChannel;
  private micTrack?: MediaStreamTrack;

  public async init() {
    // Get an ephemeral key from your server - see server code below
    const tokenResponse = await fetch("/api/rtc-session"); // API code is in ./app/api/rtc-session/route.ts
    const data = await tokenResponse.json();
    this.key = data.client_secret.value;
    this.model = data.model;
    this.connection = new RTCPeerConnection();

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

    // Notify the subclass that the connection is ready
    this.onReady();
  }

  private handleMessage(e: MessageEvent) {
    // Realtime server events appear here!
    this.onMessage(JSON.parse(e.data));
  }

  public abstract onReady(): void;
  public abstract onMessage(data: IncomingEvent): void;

  public send(event: ClientEvent) {
    this.dataChannel?.send(JSON.stringify(event));
  }

  public close() {
    this.dataChannel?.close();
    this.connection?.close();
    this.audioElement?.remove();
    this.micTrack?.stop(); // Ensure the mic is turned off when closing
  }

  public setMicrophone(enabled: boolean) {
    if (!this.micTrack) return;
    this.micTrack.enabled = enabled;
  }

  public get microphoneEnabled(): boolean {
    if (!this.micTrack) return false;
    return this.micTrack.enabled;
  }
}
