import { Tool } from "../core/Tool";

export class IncreaseLineHeight extends Tool {
  public readonly name = "line-height";
  public readonly description = "Modify line height for better readability.";
  public readonly arguments = {
    "line-height": {
      type: "string",
      description: "Changes the line height of user chat bubbles.",
    },
  };

  public async run(params: Record<string, string>) {
    Object.entries(params).forEach(([key, value]) => {
      if (Object.hasOwn(this.arguments, key)) {
        document.documentElement.style.setProperty('--line-height', value);
      }
    });
  }
}