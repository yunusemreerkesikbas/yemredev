import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      error: "not_implemented",
      message:
        "Contact provider not configured yet. This endpoint will accept submissions in Phase 5.",
    },
    { status: 501 },
  );
}
