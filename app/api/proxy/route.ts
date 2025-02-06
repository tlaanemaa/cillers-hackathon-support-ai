import { NextRequest, NextResponse } from "next/server";

interface ProxyRequest {
    url: string;
    k?: number;
}

export async function POST(req: NextRequest) {
    const body: ProxyRequest = await req.json();
    const url = body.url;

    const response = await fetch(url)
    return NextResponse.json({ response: await response.text() });
}
