export abstract class Tool {
  public abstract readonly name: string;
  public abstract readonly description: string;
  public readonly arguments: {
    [key: string]: {
      type: string; // "string" | "number" | "boolean"
      description: string;
      enum?: string[];
    };
  } = {};
  public readonly required_arguments: string[] = [];

  /**
   * Run the tool with the given parameters.
   * The params object passed, will have the same keys as the properties object in the parameters field.
   */
  public abstract run(params: Record<string, string | number>): Promise<void>;

  public toJSON() {
    return {
      type: "function",
      name: this.name,
      description: this.description,
      parameters: {
        type: "object",
        properties: this.arguments,
        required: this.required_arguments,
      },
    };
  }
}
