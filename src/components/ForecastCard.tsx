"use client";

import { ForecastItem } from "@/types";
import { getAQIColor } from "@/lib/utils";
import { Wind, Thermometer, ShieldCheck } from "lucide-react";

interface ForecastCardProps {
  forecast: ForecastItem;
}

export default function ForecastCard({ forecast }: ForecastCardProps) {
  const color = getAQIColor(forecast.category);

  return (
    <div className="relative rounded-2xl bg-white p-5 border border-[#e2eaf3] shadow-sm hover:shadow-md hover:border-[#0ea5e9]/40 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#e2eaf3]">
          <div>
            <h4 className="text-sm font-bold text-[#10243e]">
              {new Date(forecast.forecastDate).toLocaleDateString("en-IN", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </h4>
            <span className="text-xs text-[#64748b] font-mono">
              {forecast.hour || "All-day average"}
            </span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${color.badge}`}
          >
            {forecast.category}
          </span>
        </div>

        <div className="my-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#64748b] font-bold uppercase">Predicted AQI</div>
            <div
              className="text-4xl font-black tracking-tight"
              style={{ color: color.hex }}
            >
              {forecast.aqi}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-[#64748b] font-bold uppercase">Dominant</div>
            <div className="text-lg font-extrabold text-[#10243e]">
              {forecast.dominantPollutant}
            </div>
            <div className="text-xs text-[#64748b]">{forecast.pm25} µg/m³</div>
          </div>
        </div>

        <p className="text-xs text-[#1e293b] bg-[#f5f8fc] p-2.5 rounded-xl border border-[#e2eaf3] leading-relaxed mb-4">
          {forecast.summary}
        </p>
      </div>

      <div className="pt-3 border-t border-[#e2eaf3] grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-[#f5f8fc] p-1.5 rounded-xl border border-[#e2eaf3]">
          <div className="text-[#64748b] flex items-center justify-center gap-1 text-[11px]">
            <Thermometer className="w-3 h-3 text-amber-500" />
            <span>Temp</span>
          </div>
          <div className="font-bold text-[#10243e] mt-0.5">
            {forecast.temperature}°C
          </div>
        </div>

        <div className="bg-[#f5f8fc] p-1.5 rounded-xl border border-[#e2eaf3]">
          <div className="text-[#64748b] flex items-center justify-center gap-1 text-[11px]">
            <Wind className="w-3 h-3 text-[#0ea5e9]" />
            <span>Wind</span>
          </div>
          <div className="font-bold text-[#10243e] mt-0.5">
            {forecast.windSpeed} km/h
          </div>
        </div>

        <div className="bg-[#f5f8fc] p-1.5 rounded-xl border border-[#e2eaf3]">
          <div className="text-[#64748b] flex items-center justify-center gap-1 text-[11px]">
            <ShieldCheck className="w-3 h-3 text-[#10b981]" />
            <span>AI Conf.</span>
          </div>
          <div className="font-bold text-[#10243e] mt-0.5">
            {forecast.confidence}%
          </div>
        </div>
      </div>
    </div>
  );
}
