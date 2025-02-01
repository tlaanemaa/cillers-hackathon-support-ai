// Build according to https://platform.openai.com/docs/guides/realtime-webrtc

type ClientEvent = {
  type: string;
  response: {
    modalities: string[];
    instructions: string;
  };
};

export abstract class RTCAgent {
  private model?: string;
  private key?: string;
  private connection?: RTCPeerConnection;
  private audioElement?: HTMLAudioElement;
  private dataChannel?: RTCDataChannel;

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

    // Add local audio track for microphone input in the browser
    const ms = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    this.connection.addTrack(ms.getTracks()[0]);

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
    // Realtime server events appear here!
    this.onMessage(JSON.parse(e.data));
  }

  public abstract onMessage(data: object): void;

  public send(event: ClientEvent) {
    this.dataChannel?.send(JSON.stringify(event));
  }

  public close() {
    this.dataChannel?.close();
    this.connection?.close();
    this.audioElement?.remove();
  }
}
