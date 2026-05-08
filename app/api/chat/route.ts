import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST() {
  return NextResponse.json(
    {
      error: "not_implemented",
      message:
        "AI provider not configured yet. This endpoint will stream responses in Phase 6.",
    },
    { status: 501 },
  );
}

export async function GET() {
  return NextResponse.json(
    {
      status: "scaffold",
      phase: 6,
      ready: false,
    },
    { status: 200 },
  );
}
