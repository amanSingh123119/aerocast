"use client";

import { getAQICategory, getAQIColor } from "@/lib/utils";

interface AQIGaugeProps {
  aqi: number;
  size?: number;
  showSubtitle?: boolean;
}

export default function AQIGauge({ aqi, size = 260, showSubtitle = true }: AQIGaugeProps) {
  const category = getAQICategory(aqi);
  const color = getAQIColor(category);

  const strokeWidth = 18;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const percentage = Math.min(Math.max(aqi / 500, 0), 1);
  const strokeDashoffset = arcLength - arcLength * percentage;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Soft Ambient Glow */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-20"
          style={{ backgroundColor: color.hex }}
        />

        <svg
          width={size}
          height={size}
          className="transform -rotate-[135deg]"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Light Track Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Colored Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color.hex}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center AQI Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            Current AQI
          </span>
          <span
            className="text-6xl font-black tracking-tight"
            style={{ color: color.hex }}
          >
            {aqi}
          </span>
          <span
            className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${color.badge}`}
          >
            {category}
          </span>
        </div>
      </div>

      {showSubtitle && (
        <div className="mt-2 text-center max-w-sm">
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {category === "Severe" || category === "Very Poor"
              ? "Health alert: Everyone may experience serious respiratory effects. Sensitive groups should remain indoors."
              : category === "Poor"
              ? "Breathing discomfort to most people on prolonged outdoor exposure."
              : "Air quality is acceptable for outdoor recreation and activities."}
          </p>
        </div>
      )}
    </div>
  );
}
