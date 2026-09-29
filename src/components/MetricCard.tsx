import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  statusBadge?: string;
  statusBadgeColor?: string;
  subtext?: string;
  accentColor?: string;
}

export default function MetricCard({
  label,
  value,
  unit,
  icon,
  statusBadge,
  statusBadgeColor = "bg-slate-100 text-slate-700",
  subtext,
  accentColor = "from-[#0ea5e9]/10 to-[#1769e0]/5",
}: MetricCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-2xl bg-white p-5 border border-[#e2eaf3] shadow-[0_2px_12px_rgba(16,36,62,0.03)] hover:shadow-md hover:border-[#0ea5e9]/40 transition-all duration-300">
      {/* Background subtle micro-tint */}
      <div
        className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br ${accentColor} blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`}
      />

      <div className="flex items-start justify-between">
        <span className="text-xs uppercase tracking-wider font-bold text-[#64748b]">
          {label}
        </span>
        <div className="p-2 rounded-xl bg-[#f5f8fc] border border-[#e2eaf3] text-[#0ea5e9] group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-black text-[#10243e] tracking-tight">
          {value}
        </span>
        <span className="text-sm font-semibold text-[#64748b]">{unit}</span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        {statusBadge && (
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusBadgeColor}`}
          >
            {statusBadge}
          </span>
        )}
        {subtext && (
          <span className="text-xs text-slate-500 font-medium ml-auto truncate">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
