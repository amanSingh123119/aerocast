"use client";

import { useState } from "react";
import { initialForecasts } from "@/lib/data";
import ForecastCard from "@/components/ForecastCard";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Area, 
  AreaChart 
} from "recharts";
import { 
  TrendingUp, 
  Wind, 
  Thermometer, 
  ShieldCheck, 
  AlertTriangle, 
  Layers 
} from "lucide-react";

export default function ForecastPage() {
  const [forecasts] = useState(initialForecasts);
  const [viewMetric, setViewMetric] = useState<"aqi" | "pm25" | "wind">("aqi");

  // Format data for Recharts
  const chartData = forecasts.map((item) => ({
    label: `${new Date(item.forecastDate).toLocaleDateString("en-IN", {
      weekday: "short",
    })} ${item.hour || ""}`,
    aqi: item.aqi,
    pm25: item.pm25,
    wind: item.windSpeed,
    temperature: item.temperature,
    category: item.category,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10b981] mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" /> High-Resolution Coupled Dispersion Model
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#10243e]">
          72-Hour Air Quality &amp; Atmospheric Forecast
        </h1>
        <p className="mt-1 text-sm text-[#64748b] max-w-3xl">
          Coupled physics-chemistry forecast linking WRF meteorological simulations (ventilation coefficient, PBL height, mixing depth) with particulate emission inventories for Delhi NCR.
        </p>
      </div>

      {/* Atmospheric Inversion Insight Box */}
      <div className="bg-sky-50/70 rounded-2xl p-6 border border-sky-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-sky-100 text-[#0ea5e9] border border-sky-200">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#10243e] flex items-center gap-2">
              Thermal Inversion Layer Advisory
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-[#0284c7] border border-sky-200 font-bold uppercase tracking-wider">
                High Risk
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-[#64748b] mt-1 max-w-2xl leading-relaxed">
              Nocturnal ground radiation cooling will create a sharp temperature inversion below 350m between 02:00 IST and 08:30 IST tomorrow. Particulate pollutants will remain clamped near ground level before vertical mixing initiates after mid-morning.
            </p>
          </div>
        </div>
        <div className="text-xs bg-white px-4 py-3 rounded-xl border border-[#e2eaf3] text-[#1e293b] shadow-sm shrink-0">
          <div>Ventilation Index: <strong className="text-rose-600">1,820 m²/s</strong> (Poor)</div>
          <div className="mt-1">PBL Height: <strong className="text-amber-600">~290 m</strong> (Suppressed)</div>
        </div>
      </div>

      {/* Interactive Chart Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eaf3] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#10243e]">72-Hour Projection Timeline</h2>
            <p className="text-xs text-[#64748b]">Estimated multi-pollutant trajectory over Delhi NCR</p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f5f8fc] p-1 rounded-xl border border-[#e2eaf3]">
            <button
              onClick={() => setViewMetric("aqi")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMetric === "aqi"
                  ? "bg-[#0ea5e9] text-white shadow-sm"
                  : "text-[#64748b] hover:text-[#10243e]"
              }`}
            >
              Air Quality Index (AQI)
            </button>
            <button
              onClick={() => setViewMetric("pm25")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMetric === "pm25"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-[#64748b] hover:text-[#10243e]"
              }`}
            >
              PM2.5 (µg/m³)
            </button>
            <button
              onClick={() => setViewMetric("wind")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMetric === "wind"
                  ? "bg-sky-500 text-white shadow-sm"
                  : "text-[#64748b] hover:text-[#10243e]"
              }`}
            >
              Wind Speed (km/h)
            </button>
          </div>
        </div>

        {/* Recharts Component */}
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="pmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2eaf3",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#10243e",
                  boxShadow: "0 10px 25px rgba(16,36,62,0.08)",
                }}
              />
              {viewMetric === "aqi" && (
                <Area
                  type="monotone"
                  dataKey="aqi"
                  name="AQI"
                  stroke="#e11d48"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#aqiGrad)"
                />
              )}
              {viewMetric === "pm25" && (
                <Area
                  type="monotone"
                  dataKey="pm25"
                  name="PM2.5"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#pmGrad)"
                />
              )}
              {viewMetric === "wind" && (
                <Area
                  type="monotone"
                  dataKey="wind"
                  name="Wind Speed (km/h)"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#windGrad)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly / Daily Forecast Cards Breakdown */}
      <div>
        <h2 className="text-xl font-bold text-[#10243e] mb-4">Detailed Timestep Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {forecasts.map((item) => (
            <ForecastCard key={item.id} forecast={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
