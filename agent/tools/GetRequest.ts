import { Tool } from "../core/Tool";

export class GetRequest extends Tool {
    public readonly name = "http-get-request";
    public readonly description = "A tool to perform HTTP GET requests to specified URLs.";
    public readonly arguments = {
        url: {
            type: "string",
            description: "The full URL to send the GET request to. Ensure it is a valid and accessible endpoint.",
        },
    };

    public async run({ url }: { url: string }) {
        // Perform GET request
        const response = await fetch(url);
        return response.text();
    }
}
