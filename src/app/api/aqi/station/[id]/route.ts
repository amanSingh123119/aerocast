import { NextResponse } from "next/server";
import { getStations } from "@/lib/db";
import { fetchLiveWAQI } from "@/lib/external-apis";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const stations = await getStations();
  const station = stations.find((s) => s.id === id);

  if (!station) {
    return NextResponse.json({ error: "Station not found" }, { status: 404 });
  }

  // Check if live external WAQI telemetry is active
  const liveSensor = await fetchLiveWAQI(station.latitude, station.longitude);

  const currentAQI = liveSensor?.aqi ?? station.currentAQI ?? 250;
  const pm25 = liveSensor?.pm25 ?? station.pm25 ?? 140;

  // Generate 24-hour hourly trend for this station
  const hourlyTrend = Array.from({ length: 24 }).map((_, i) => {
    const hour = (24 - i + 12) % 24;
    const variation = Math.sin(i / 3) * 45;
    return {
      time: `${hour.toString().padStart(2, "0")}:00`,
      aqi: Math.max(50, Math.round(currentAQI + variation)),
      pm25: Math.max(30, Math.round(pm25 + variation * 0.6)),
    };
  }).reverse();

  return NextResponse.json({
    ...station,
    currentAQI,
    pm25,
    source: liveSensor?.source ?? "CAAQMS Baseline",
    hourlyTrend,
  });
}
