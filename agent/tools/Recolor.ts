import { Tool } from "./Tool";

export class Recolor extends Tool {
  public readonly name = "theme-colors";
  public readonly description = "Modify theme colors of the application.";
  public readonly arguments = {
    background: {
      type: "string",
      description: "Changes the background color.",
    },
    "background-dark": {
      type: "string",
      description: "Changes the dark background color.",
    },
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
      description: "Changes the color of user chat bubbles.",
    },
    "chat-assistant": {
      type: "string",
      description: "Changes the color of assistant chat bubbles.",
    },
    text: {
      type: "string",
      description: "Changes the default text color.",
    },
    "text-light": {
      type: "string",
      description: "Changes the light text color.",
    },
    "text-muted": {
      type: "string",
      description: "Changes the muted text color.",
    },
    button: {
      type: "string",
      description: "Changes the default button color.",
    },
    "button-hover": {
      type: "string",
      description: "Changes the hover state of buttons.",
    },
    input: {
      type: "string",
      description: "Changes the input field background color.",
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
