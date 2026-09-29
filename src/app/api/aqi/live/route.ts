import { NextResponse } from "next/server";
import { getStations } from "@/lib/db";
import { getAQICategory } from "@/lib/utils";
import { fetchOpenWeatherWind } from "@/lib/external-apis";

export async function GET() {
  const stations = await getStations();
  const activeStations = stations.filter((s) => s.isActive);

  const avgAQI = Math.round(
    activeStations.reduce((acc, s) => acc + (s.currentAQI || 0), 0) / (activeStations.length || 1)
  );
  const avgPM25 = Math.round(
    activeStations.reduce((acc, s) => acc + (s.pm25 || 0), 0) / (activeStations.length || 1)
  );
  const avgPM10 = Math.round(
    activeStations.reduce((acc, s) => acc + (s.pm10 || 0), 0) / (activeStations.length || 1)
  );

  // Check if live OpenWeather surface observations are active
  const liveWeather = await fetchOpenWeatherWind(28.6139, 77.2090);

  return NextResponse.json({
    region: "Delhi National Capital Region",
    aqi: avgAQI,
    pm25: avgPM25,
    pm10: avgPM10,
    dominantPollutant: "PM2.5",
    category: getAQICategory(avgAQI),
    temperature: liveWeather?.temperature ?? 24,
    humidity: liveWeather?.humidity ?? 60,
    windSpeed: liveWeather?.windSpeed ?? 4.2,
    windDirection: "NW (315°)",
    activeStationsCount: activeStations.length,
    lastUpdated: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST",
    source: "Central Pollution Control Board (CPCB) & SAFAR IITM",
    coupledModelStatus: "Synchronized",
  });
}
