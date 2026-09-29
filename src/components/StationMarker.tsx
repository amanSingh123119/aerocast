"use client";

import { Station } from "@/types";
import { getAQICategory, getAQIColor } from "@/lib/utils";
import { Radio, Wind, Thermometer, MapPin, ChevronRight } from "lucide-react";

interface StationMarkerProps {
  station: Station;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export default function StationMarker({
  station,
  isSelected = false,
  onClick,
  compact = false,
}: StationMarkerProps) {
  const category = getAQICategory(station.currentAQI || 150);
  const color = getAQIColor(category);

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left w-full ${
          isSelected
            ? "bg-sky-50/70 border-[#0ea5e9] shadow-sm ring-1 ring-[#0ea5e9]/40"
            : "bg-white border-[#e2eaf3] hover:bg-[#f5f8fc] hover:border-[#0ea5e9]/30"
        }`}
      >
        {/* Pulsing Dot */}
        <div className="relative flex items-center justify-center shrink-0">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color.hex }}
          />
          <span
            className="absolute w-4 h-4 rounded-full opacity-75 animate-ping"
            style={{ backgroundColor: color.hex }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-[#10243e] truncate">{station.name}</div>
          <div className="text-[10px] text-[#64748b] truncate">{station.city}</div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-sm font-black" style={{ color: color.hex }}>
            {station.currentAQI}
          </span>
          <span className="block text-[8px] uppercase font-bold text-[#64748b]">
            AQI
          </span>
        </div>
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl p-5 border transition-all cursor-pointer bg-white shadow-xs ${
        isSelected
          ? "border-[#0ea5e9] shadow-md ring-1 ring-[#0ea5e9]/30 bg-sky-50/20"
          : "border-[#e2eaf3] hover:border-[#0ea5e9]/40 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color.hex }}
            />
            <span
              className="absolute w-5 h-5 rounded-full opacity-60 animate-ping"
              style={{ backgroundColor: color.hex }}
            />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#10243e] group-hover:text-[#0ea5e9] transition-colors">
              {station.name}
            </h4>
            <span className="text-xs text-[#64748b] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#64748b]" />
              {station.city} · Sensor Active
            </span>
          </div>
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${color.badge}`}
        >
          {category}
        </span>
      </div>

      <div className="my-4 flex items-baseline justify-between bg-[#f5f8fc] p-3 rounded-xl border border-[#e2eaf3]">
        <div>
          <span className="text-[10px] text-[#64748b] uppercase font-bold">
            Current AQI
          </span>
          <div
            className="text-3xl font-black tracking-tight"
            style={{ color: color.hex }}
          >
            {station.currentAQI}
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-[#64748b] uppercase font-bold">
            PM2.5 Level
          </span>
          <div className="text-base font-extrabold text-[#10243e]">
            {station.pm25} <span className="text-xs text-[#64748b]">µg/m³</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-[#64748b] pt-1 border-t border-[#e2eaf3]">
        <div className="flex items-center gap-1.5 text-[#64748b]">
          <Thermometer className="w-3.5 h-3.5 text-amber-500" />
          <span>{station.temperature}°C / {station.humidity}% RH</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#64748b] justify-end">
          <Wind className="w-3.5 h-3.5 text-[#0ea5e9]" />
          <span>{station.windSpeed} km/h {station.windDirection}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-[#64748b] font-medium">
        <span>Updated: {station.lastUpdated || "Just now"}</span>
        <span className="text-[#0ea5e9] font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
          Details <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
