import { RTCAgent } from "./RTCAgent";

export class SupportAgent extends RTCAgent {
  onMessage(event: object) {
    console.log("INCOMING", event);
  }
}
