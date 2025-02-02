export abstract class Tool {
  public readonly type = "function";
  public abstract readonly name: string;
  public abstract readonly description: string;
  public abstract readonly parameters: {
    type: "object";
    properties: {
      [key: string]: {
        type: "string" | "number";
        description: string;
        enum?: string[];
      };
    };
    // List of required properties
    required: string[];
  };

  /**
   * Run the tool with the given parameters.
   * The params object passed, will have the same keys as the properties object in the parameters field.
   */
  public abstract run(params: Record<string, string | number>): void;

  public toJSON() {
    return {
      type: this.type,
      name: this.name,
      description: this.description,
      parameters: this.parameters,
    };
  }
}
