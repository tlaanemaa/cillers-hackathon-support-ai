/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tool } from "../core/Tool";

export class SearchKnowledge extends Tool {
  public readonly name = "search-knowledge-base";
  public readonly description = "A tool to search the knowledge base for additional information.";
  public readonly arguments = {
    question: {
      type: "string",
      description: "The question to ask the knowledge base. Use this anytime you need additional context or verification.",
    }
  };


  public async run({ question }: { question: string }) {
    // Fetch the knowledge-base API
    const response = await fetch("/api/knowledge-base", {
      method: "POST",
      body: JSON.stringify({ question, k: 3 }),
    })

    const data = await response.json();

    // Filter responses
    const CONFIDENCE_LIMIT = 0.2;
    const content = data
      .filter((result: any) => result.score > CONFIDENCE_LIMIT)
      .map((result: any) => ({
        content: result.document.content,
        metadata: result.document.metadata,
      }));
    return content;
  }
}
