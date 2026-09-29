import { NextResponse } from "next/server";
import { getHealthAdvice } from "@/lib/db";

export async function GET() {
  const advice = await getHealthAdvice();
  return NextResponse.json(advice);
}
