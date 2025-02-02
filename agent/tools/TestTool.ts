import { Tool } from "./Tool";

export class TestTool extends Tool {
  public readonly name = "test-tool";
  public readonly description = "A test tool for demonstration purposes.";
  public readonly arguments = {
    message: {
      type: "string",
      description: "The message to log to the console.",
    },
  };
  public readonly required_arguments = ["message"];

  public async run(params: { message: string }) {
    console.log(params.message);
  }
}
