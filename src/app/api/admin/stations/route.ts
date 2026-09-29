import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      message: `Station ${body.name || "updated"} processed successfully.`,
      station: body,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to update station" }, { status: 400 });
  }
}
