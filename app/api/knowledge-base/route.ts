import { NextRequest, NextResponse } from "next/server";
import { SearchRequest, VectorSearch, VectorQuery } from "couchbase";
import couchbase from "../db";
import OpenAI from "openai";

interface SearchApiRequest {
    question: string;
    k?: number;
}

export async function POST(req: NextRequest) {
    try {
        // Validate and typecast the request body
        const body: SearchApiRequest = await req.json();
        const question = body.question;
        const k = Math.min(body.k ?? 5, 10); // Limit to max 10 results

        if (!question) {
            return NextResponse.json({ error: "Question is required" }, { status: 400 });
        }

        // Generate embeddings using OpenAI
        const openai = new OpenAI();
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: question,
        });

        const embedding = embeddingResponse.data[0]?.embedding;
        if (!embedding) {
            return NextResponse.json({ error: "Failed to generate embedding" }, { status: 500 });
        }

        // Ensure connection to Couchbase
        await couchbase.connect();
        if (!couchbase.cluster) {
            return NextResponse.json({ error: "Failed to connect to Couchbase" }, { status: 500 });
        }

        // Vector search query
        const FIELD_NAME = "vector"; // Ensure this matches your index field
        const INDEX_NAME = "cs-hackathon._default.vector"; // Ensure this index exists
        const request = SearchRequest.create(
            VectorSearch.fromVectorQuery(
                VectorQuery.create(FIELD_NAME, embedding).numCandidates(k)
            )
        );

        const knnResult = await couchbase.cluster.search(INDEX_NAME, request);
        const docResult = await Promise.all(knnResult.rows.map(async (row) => {
            const document = await couchbase.collection!.get(row.id);
            delete document.content.vector;
            return { ...row, document: document.content };
        }));

        return NextResponse.json(docResult);

    } catch (error) {
        console.error("Error in KNN search:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
