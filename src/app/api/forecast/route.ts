import { NextResponse } from "next/server";
import { getForecasts, addForecast } from "@/lib/db";
import { getAQICategory } from "@/lib/utils";

export async function GET() {
  const forecasts = await getForecasts();
  return NextResponse.json(forecasts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newForecast = {
      id: `f-${Date.now()}`,
      forecastDate: body.forecastDate || new Date().toISOString().split("T")[0],
      hour: body.hour || "12:00",
      aqi: Number(body.aqi),
      pm25: Number(body.pm25),
      pm10: Number(body.pm10 || body.pm25 * 1.5),
      temperature: Number(body.temperature || 24),
      windSpeed: Number(body.windSpeed || 4),
      windDirection: body.windDirection || "NW",
      inversionStrength: body.inversionStrength || "Moderate",
      confidence: Number(body.confidence || 85),
      category: getAQICategory(Number(body.aqi)),
      dominantPollutant: body.dominantPollutant || "PM2.5",
      summary: body.summary || "Admin published forecast update",
    };
    const created = await addForecast(newForecast);
    return NextResponse.json({ success: true, forecast: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to publish forecast" }, { status: 400 });
  }
}
