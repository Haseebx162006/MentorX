import { NextResponse } from "next/server";

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || searchParams.get("user_id") || "";

    const url = userId
      ? `${BACKEND_URL}/api/chat/sessions?user_id=${encodeURIComponent(userId)}`
      : `${BACKEND_URL}/api/chat/sessions`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const sessions = await res.json();
      return NextResponse.json(sessions);
    }

    return NextResponse.json([], { status: res.status });
  } catch (error) {
    console.warn("Backend session fetch failed, returning empty list:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, title, sessionId } = body;

    const res = await fetch(`${BACKEND_URL}/api/chat/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId || null,
        title: title || "New Conversation",
        session_id: sessionId || null,
      }),
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Failed to create session" }, { status: res.status });
  } catch (error: any) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: error?.message || "Internal error" }, { status: 500 });
  }
}
