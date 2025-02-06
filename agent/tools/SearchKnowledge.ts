import { Tool } from "../core/Tool";

export class SearchKnowledge extends Tool {
  public readonly name = "search-knowledge-base";
  public readonly description = "Ask a question from the knowledge-base";
  public readonly arguments = {
    question: {
      type: "string",
      description: "The question to ask the knowledge-base",
    },
    k: {
      type: "number",
      description: "The number of results to return",
    }
  };

  public async run({ question, k }: { question: string, k: number }) {
    // Fetch the knowledge-base API
    const response = await fetch("/api/knowledge-base", {
      method: "POST",
      body: JSON.stringify({ question, k }),
    })

    const data = await response.json();
    console.log(data);
    return data;
  }
}
