import { NextResponse } from "next/server";
import { connectToCouchbase, cluster } from "../db";

// GET API route to fetch all documents
export async function GET() {
  try {
    await connectToCouchbase();

    if (!cluster) {
      return NextResponse.json(
        { error: "Failed to connect to Couchbase" },
        { status: 500 }
      );
    }

    // N1QL query to fetch documents from "documents" collection in "cs-hackathon" bucket
    const query = `SELECT * FROM documents`; // Adjust LIMIT as needed
    const result = await cluster.query(query);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching documents:", error);
      return NextResponse.json(
        { error: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
