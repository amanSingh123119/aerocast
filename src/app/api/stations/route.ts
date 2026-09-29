import { NextResponse } from "next/server";
import { getStations, addStation } from "@/lib/db";
import { getAQICategory } from "@/lib/utils";

export async function GET() {
  const stations = await getStations();
  return NextResponse.json(stations);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newStation = {
      id: `station-${Date.now()}`,
      name: body.name,
      latitude: parseFloat(body.latitude),
      longitude: parseFloat(body.longitude),
      city: body.city || "Delhi",
      isActive: body.isActive !== undefined ? body.isActive : true,
      currentAQI: body.currentAQI || 150,
      pm25: body.pm25 || 80,
      pm10: body.pm10 || 130,
      temperature: 25,
      humidity: 55,
      windSpeed: 4.5,
      windDirection: "NW",
      status: getAQICategory(body.currentAQI || 150),
      lastUpdated: "Just now",
    };
    const created = await addStation(newStation);
    return NextResponse.json({ success: true, station: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create station" }, { status: 400 });
  }
}
