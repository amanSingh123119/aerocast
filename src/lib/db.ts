import { supabase } from "./supabase";
import { initialStations, initialForecasts, healthAdviceList, initialUserAlerts } from "./data";
import { Station, ForecastItem, HealthAdviceItem, UserAlert } from "@/types";

// In-memory fallbacks
let stationsCache: Station[] = [...initialStations];
let forecastsCache: ForecastItem[] = [...initialForecasts];
let userAlertsCache: UserAlert[] = [...initialUserAlerts];

const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo.supabase.co")
  );
};

// 1. STATIONS
export async function getStations(): Promise<Station[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from("stations").select("*");
      if (!error && data && data.length > 0) {
        return data as Station[];
      }
    } catch (err) {
      console.warn("Supabase query fallback to cached stations", err);
    }
  }
  return stationsCache;
}

export async function addStation(station: Station): Promise<Station> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from("stations").insert([station]).select();
      if (!error && data && data[0]) {
        return data[0] as Station;
      }
    } catch (err) {
      console.warn("Supabase insert error", err);
    }
  }
  stationsCache.unshift(station);
  return station;
}

export async function updateStationStatus(id: string, isActive: boolean) {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("stations").update({ is_active: isActive }).eq("id", id);
    } catch (err) {
      console.warn("Supabase update error", err);
    }
  }
  stationsCache = stationsCache.map((s) => (s.id === id ? { ...s, isActive } : s));
}

// 2. FORECASTS
export async function getForecasts(): Promise<ForecastItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("forecasts")
        .select("*")
        .order("forecast_date", { ascending: true });
      if (!error && data && data.length > 0) {
        return data as ForecastItem[];
      }
    } catch (err) {
      console.warn("Supabase forecasts fallback", err);
    }
  }
  return forecastsCache;
}

export async function addForecast(forecast: ForecastItem): Promise<ForecastItem> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from("forecasts").insert([forecast]).select();
      if (!error && data && data[0]) {
        return data[0] as ForecastItem;
      }
    } catch (err) {
      console.warn("Supabase forecast insert error", err);
    }
  }
  forecastsCache.unshift(forecast);
  return forecast;
}

// 3. HEALTH ADVICE
export async function getHealthAdvice(): Promise<HealthAdviceItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from("health_advice").select("*");
      if (!error && data && data.length > 0) {
        return data as HealthAdviceItem[];
      }
    } catch (err) {
      console.warn("Supabase health advice fallback", err);
    }
  }
  return healthAdviceList;
}

// 4. USER ALERTS
export async function getUserAlerts(userId?: string): Promise<UserAlert[]> {
  if (isSupabaseConfigured() && userId) {
    try {
      const { data, error } = await supabase
        .from("user_alerts")
        .select("*")
        .eq("user_id", userId);
      if (!error && data) {
        return data as UserAlert[];
      }
    } catch (err) {
      console.warn("Supabase user alerts fallback", err);
    }
  }
  return userAlertsCache;
}

export async function addUserAlert(alert: UserAlert): Promise<UserAlert> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from("user_alerts").insert([alert]).select();
      if (!error && data && data[0]) {
        return data[0] as UserAlert;
      }
    } catch (err) {
      console.warn("Supabase user alert insert error", err);
    }
  }
  userAlertsCache.unshift(alert);
  return alert;
}

export async function deleteUserAlert(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("user_alerts").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete error", err);
    }
  }
  userAlertsCache = userAlertsCache.filter((a) => a.id !== id);
  return true;
}
