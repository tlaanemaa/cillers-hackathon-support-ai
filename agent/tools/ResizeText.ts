import { Tool } from "../core/Tool";

export class ResizeText extends Tool {
    public readonly name = "font-size";
    public readonly description = "Change the font size and font family of the text in the chat window, for better readability.";
    public readonly arguments = {
        fontSize: {
            type: "number",
            description: "Changes the font size of all text in the application. Increase or decrease font size by at least 6 initially, then move in smaller steps unless instructed otherwise. The initial value is 18px.",
        },
    };

    public async run(params: Record<string, string>) {
        Object.entries(params).forEach(([key, value]) => {
          if (Object.hasOwn(this.arguments, key)) {
            document.documentElement.style.setProperty("--font-size", `${value}px`);
          }
        });
      }
}