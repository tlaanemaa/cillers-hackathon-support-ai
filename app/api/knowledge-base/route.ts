import { NextRequest, NextResponse } from "next/server";
import couchbase from "../db";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface SearchRequest {
    question: string;
    k?: number;
}

export async function POST(req: NextRequest) {
    // Validate and typecast the request body
    const body: SearchRequest = await req.json();
    const question = body.question;
    const k = Math.min(body.k ?? 5, 10); // Default to 5 if not provided

    // Generate embeddings using OpenAI
    const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: question,
    });

    const embedding = embeddingResponse.data[0].embedding;
    if (!embedding) {
        throw new Error("Failed to generate embedding");
    }

    await couchbase.connect();
    // const indexName = "vector_search_index"; // Ensure this index exists in Couchbase

    // Perform vector search
    const result = await couchbase
        .cluster!
        .query('SELECT * FROM `cs-hackathon`._default._default LIMIT 2;');


    return NextResponse.json({ results: result.rows });
}
