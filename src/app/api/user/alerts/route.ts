import { NextResponse } from "next/server";
import { getUserAlerts, addUserAlert, deleteUserAlert } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || undefined;
  const alerts = await getUserAlerts(userId);
  return NextResponse.json(alerts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newAlert = {
      id: `alt-${Date.now()}`,
      userId: body.userId || "usr-citizen-01",
      stationId: body.stationId,
      stationName: body.stationName || "Custom Station",
      thresholdAQI: Number(body.thresholdAQI) || 250,
      location: body.location || "Custom Location",
      isActive: true,
      notifyEmail: body.notifyEmail !== undefined ? body.notifyEmail : true,
      notifySms: body.notifySms !== undefined ? body.notifySms : false,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const created = await addUserAlert(newAlert);
    return NextResponse.json({ success: true, alert: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create alert" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      await deleteUserAlert(id);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete alert" }, { status: 400 });
  }
}
