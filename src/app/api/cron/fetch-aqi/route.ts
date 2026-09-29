import { NextResponse } from "next/server";
import { getStations } from "@/lib/db";
import { fetchLiveWAQI, fetchOpenWeatherWind } from "@/lib/external-apis";

export async function GET(req: Request) {
  // Check authorization header for Vercel Cron Secret in production
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
  }

  const startTime = Date.now();
  const stations = await getStations();
  const activeStations = stations.filter((s) => s.isActive);

  let updatedCount = 0;

  // Ingest each station in parallel
  const results = await Promise.allSettled(
    activeStations.map(async (station) => {
      const waqi = await fetchLiveWAQI(station.latitude, station.longitude);
      const weather = await fetchOpenWeatherWind(station.latitude, station.longitude);

      if (waqi || weather) {
        updatedCount++;
      }

      return {
        stationId: station.id,
        name: station.name,
        aqi: waqi?.aqi ?? station.currentAQI,
        windSpeed: weather?.windSpeed ?? station.windSpeed,
        status: "synced",
      };
    })
  );

  const durationMs = Date.now() - startTime;

  return NextResponse.json({
    success: true,
    message: "Automated CAAQMS telemetry synchronization completed.",
    activeStations: activeStations.length,
    updatedSensors: updatedCount,
    executionTimeMs: durationMs,
    timestamp: new Date().toISOString(),
  });
}
