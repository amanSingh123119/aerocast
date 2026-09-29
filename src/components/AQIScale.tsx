"use client";

import { getAQICategory } from "@/lib/utils";

interface AQIScaleProps {
  currentAQI?: number;
}

const SCALE_ITEMS = [
  { label: "Good", range: "0–50", color: "#10b981", bg: "bg-emerald-500", text: "text-emerald-700" },
  { label: "Satisfactory", range: "51–100", color: "#22c55e", bg: "bg-green-500", text: "text-green-700" },
  { label: "Moderate", range: "101–200", color: "#f59e0b", bg: "bg-amber-500", text: "text-amber-700" },
  { label: "Poor", range: "201–300", color: "#f97316", bg: "bg-orange-500", text: "text-orange-700" },
  { label: "Very Poor", range: "301–400", color: "#f43f5e", bg: "bg-rose-500", text: "text-rose-700" },
  { label: "Severe", range: "401–500+", color: "#8b5cf6", bg: "bg-purple-600", text: "text-purple-700" },
];

export default function AQIScale({ currentAQI }: AQIScaleProps) {
  const currentCategory = currentAQI !== undefined ? getAQICategory(currentAQI) : null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#10243e]">
          Official Indian AQI Scale (CPCB Standard)
        </h3>
        {currentAQI !== undefined && (
          <span className="text-xs text-[#64748b]">
            Regional: <strong className="text-[#10243e]">{currentAQI} AQI</strong>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {SCALE_ITEMS.map((item) => {
          const isActive = currentCategory === item.label;
          return (
            <div
              key={item.label}
              className={`relative rounded-xl p-3 border transition-all ${
                isActive
                  ? "border-[#0ea5e9]/50 ring-2 ring-[#0ea5e9]/30 bg-[#0ea5e9]/5 shadow-sm scale-[1.02]"
                  : "border-[#e2eaf3] bg-white hover:border-[#0ea5e9]/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${item.bg}`} />
                <span className="text-[11px] font-mono font-bold text-[#1e293b]">
                  {item.range}
                </span>
              </div>
              <div className={`text-xs font-bold ${item.text}`}>{item.label}</div>
              {isActive && (
                <div className="mt-1 text-[9px] uppercase font-extrabold text-[#0ea5e9] tracking-wider">
                  ● Active Level
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
