"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Station } from "@/types";
import { getAQICategory, getAQIColor } from "@/lib/utils";
import { 
  X, 
  MapPin, 
  Radio, 
  Thermometer, 
  Droplets, 
  Wind, 
  BellRing, 
  Activity
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface StationDetailModalProps {
  station: Station | null;
  onClose: () => void;
}

export default function StationDetailModal({ station, onClose }: StationDetailModalProps) {
  const [trendData, setTrendData] = useState<{ time: string; aqi: number; pm25: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!station) return;

    setLoading(true);
    fetch(`/api/aqi/station/${station.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.hourlyTrend) {
          setTrendData(data.hourlyTrend);
        }
      })
      .catch((err) => console.error("Error fetching station trend:", err))
      .finally(() => setLoading(false));
  }, [station]);

  if (!station) return null;

  const category = getAQICategory(station.currentAQI || 150);
  const color = getAQIColor(category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eaf3] shadow-2xl overflow-hidden">
        {/* Soft Glow */}
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: color.hex }}
        />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#e2eaf3]">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#10b981] mb-1">
              <Radio className="w-3.5 h-3.5" /> CAAQMS Real-Time Sensor Telemetry
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#10243e]">{station.name}</h2>
            <p className="text-xs text-[#64748b] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#64748b]" />
              {station.city} · Coordinates: {station.latitude.toFixed(4)}° N, {station.longitude.toFixed(4)}° E
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#64748b] hover:text-[#10243e] hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3.5 rounded-2xl bg-[#f5f8fc] border border-[#e2eaf3]">
            <span className="text-[10px] uppercase font-bold text-[#64748b]">Current AQI</span>
            <div className="text-3xl font-black mt-0.5" style={{ color: color.hex }}>
              {station.currentAQI}
            </div>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${color.badge}`}>
              {category}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f5f8fc] border border-[#e2eaf3]">
            <span className="text-[10px] uppercase font-bold text-[#64748b]">PM2.5 / PM10</span>
            <div className="text-xl font-extrabold text-[#10243e] mt-0.5">
              {station.pm25} <span className="text-xs text-[#64748b]">µg/m³</span>
            </div>
            <span className="text-[10px] text-[#64748b] mt-1 block">PM10: {station.pm10 || 240} µg/m³</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f5f8fc] border border-[#e2eaf3]">
            <span className="text-[10px] uppercase font-bold text-[#64748b]">Surface Weather</span>
            <div className="text-xl font-extrabold text-[#10243e] mt-0.5 flex items-center gap-1">
              <Thermometer className="w-4 h-4 text-amber-500" />
              {station.temperature}°C
            </div>
            <span className="text-[10px] text-[#64748b] mt-1 block">Humidity: {station.humidity}%</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f5f8fc] border border-[#e2eaf3]">
            <span className="text-[10px] uppercase font-bold text-[#64748b]">Wind Dynamics</span>
            <div className="text-xl font-extrabold text-[#10243e] mt-0.5 flex items-center gap-1">
              <Wind className="w-4 h-4 text-[#0ea5e9]" />
              {station.windSpeed} <span className="text-xs text-[#64748b]">km/h</span>
            </div>
            <span className="text-[10px] text-[#64748b] mt-1 block">Direction: {station.windDirection || "NW"}</span>
          </div>
        </div>

        {/* 24h Diurnal Trend Chart */}
        <div className="my-5 p-4 rounded-2xl bg-[#f5f8fc] border border-[#e2eaf3]">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold text-[#10243e] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#0ea5e9]" />
              24-Hour Diurnal Observation Curve
            </div>
            <span className="text-[10px] text-[#64748b] font-mono">Calibrated by CPCB</span>
          </div>

          <div className="w-full h-44">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-[#64748b]">
                Loading diurnal telemetry...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="stationGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color.hex} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color.hex} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#cbd5e1",
                      borderRadius: "10px",
                      fontSize: "11px",
                      color: "#0f172a",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="aqi"
                    name="AQI"
                    stroke={color.hex}
                    strokeWidth={2.5}
                    fill="url(#stationGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#e2eaf3]">
          <div className="text-xs text-[#64748b]">
            Last observation: {station.lastUpdated || "5 mins ago"}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/map`}
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-[#e2eaf3] text-xs font-semibold text-[#10243e] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" /> View on Map
            </Link>
            <Link
              href={`/dashboard`}
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-xs font-bold text-white shadow-xs transition-colors"
            >
              <BellRing className="w-3.5 h-3.5" /> Set Custom Alert
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
