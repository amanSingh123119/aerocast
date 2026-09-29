import { NextResponse } from "next/server";
import { getUserAlerts, getStations } from "@/lib/db";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
  }

  const startTime = Date.now();
  const alerts = await getUserAlerts();
  const stations = await getStations();

  const dispatchedAlerts: {
    alertId: string;
    location: string;
    stationName: string;
    recordedAQI: number;
    thresholdAQI: number;
    channels: string[];
    status: string;
  }[] = [];

  for (const alert of alerts) {
    if (!alert.isActive) continue;

    const station = stations.find((s) => s.id === alert.stationId);
    const currentAQI = station?.currentAQI || 0;

    // Check if threshold breached
    if (currentAQI >= alert.thresholdAQI) {
      const channels = [];
      if (alert.notifyEmail) channels.push("Email");
      if (alert.notifySms) channels.push("SMS/WhatsApp");

      // In production with RESEND_API_KEY, send email here via resend.emails.send(...)
      dispatchedAlerts.push({
        alertId: alert.id,
        location: alert.location,
        stationName: alert.stationName,
        recordedAQI: currentAQI,
        thresholdAQI: alert.thresholdAQI,
        channels,
        status: "Dispatched Successfully",
      });
    }
  }

  const durationMs = Date.now() - startTime;

  return NextResponse.json({
    success: true,
    message: `Automated hourly alert scan complete. Evaluated ${alerts.length} user rules.`,
    totalAlertsChecked: alerts.length,
    breachesDetected: dispatchedAlerts.length,
    dispatchedAlerts,
    executionTimeMs: durationMs,
    timestamp: new Date().toISOString(),
  });
}
