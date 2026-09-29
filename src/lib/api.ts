import { Station, ForecastItem, HealthAdviceItem, UserAlert } from "@/types";

export async function fetchLiveAQI() {
  try {
    const res = await fetch("/api/aqi/live", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch live AQI");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function fetchStations(): Promise<Station[]> {
  try {
    const res = await fetch("/api/stations", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch stations");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fetchStationById(id: string): Promise<Station | null> {
  try {
    const res = await fetch(`/api/aqi/station/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch station");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function fetchForecasts(): Promise<ForecastItem[]> {
  try {
    const res = await fetch("/api/forecast", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch forecasts");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fetchHealthAdvice(): Promise<HealthAdviceItem[]> {
  try {
    const res = await fetch("/api/health-advice", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch health advice");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fetchUserAlerts(): Promise<UserAlert[]> {
  try {
    const res = await fetch("/api/user/alerts", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch user alerts");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
