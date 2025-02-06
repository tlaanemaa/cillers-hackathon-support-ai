import { Tool } from "../core/Tool";

export class Recolor extends Tool {
  public readonly name = "theme-colors";
  public readonly description = "Modify theme colors of the application. Ensure a high contrast, never use light on light or dark on dark colors. Use playful, bright colors, but NEVER choose red or green unless specifically instructed to do so.";
  public readonly arguments = {
    "gradient-start": {
      type: "string",
      description: "Changes the start color of the background gradient.",
    },
    "gradient-end": {
      type: "string",
      description: "Changes the end color of the background gradient.",
    },
    "chat-user": {
      type: "string",
      description: "Changes the background color of user chat bubbles. Has to have a high contrast to background and text colors.",
    },
    "chat-assistant": {
      type: "string",
      description: "Changes the background color of assistant chat bubbles. Has to have a high contrast to background and text colors.",
    },
    text: {
      type: "string",
      description: "Changes the default text color.",
    },
    "text-muted": {
      type: "string",
      description: "Changes the muted text color.",
    },
    button: {
      type: "string",
      description: "Changes the default button color. Has to have a high contrast to input and text colors.",
    },
    "button-hover": {
      type: "string",
      description: "Changes the hover state of buttons.",
    },
    input: {
      type: "string",
      description: "Changes the input field background color. Has to have a high contrast to background and text colors.",
    },
  };

  public async run(params: Record<string, string>) {
    Object.entries(params).forEach(([key, value]) => {
      if (Object.hasOwn(this.arguments, key)) {
        document.documentElement.style.setProperty(`--color-${key}`, value);
      }
    });
  }
}
