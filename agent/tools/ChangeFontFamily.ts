import { Tool } from "../core/Tool";

const allowedFontFamilies = ["Quicksand", "Lato", "Raleway"];

export class ChangeFontFamily extends Tool {
    public readonly name = "font-family";
    public readonly description = "Change the font family of the text in the chat window, for better readability.";
    public readonly arguments = {
        fontSize: {
            type: "string",
            description: "Changes the font family of all text in the application. The initial value is 'Quicksand'.",
            enum: allowedFontFamilies,
        },
    };

    public async run(params: Record<string, string>) {
        Object.entries(params).forEach(([key, value]) => {
          if (Object.hasOwn(this.arguments, key)) {
            document.documentElement.style.setProperty("--font-family", `${value}, sans-serif`);
          }
        });
      }
}