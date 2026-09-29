"use client";

import { useState } from "react";
import { HealthAdviceItem } from "@/types";
import { 
  Users, 
  Baby, 
  HeartPulse, 
  HardHat, 
  ShieldCheck, 
  AlertTriangle 
} from "lucide-react";

interface HealthCardProps {
  advice: HealthAdviceItem;
}

export default function HealthCard({ advice }: HealthCardProps) {
  const [activeTab, setActiveTab] = useState<"general" | "children" | "elderly" | "workers">("general");

  const tabs = [
    { id: "general", label: "General", icon: Users },
    { id: "children", label: "Children", icon: Baby },
    { id: "elderly", label: "Elderly", icon: HeartPulse },
    { id: "workers", label: "Outdoor Workers", icon: HardHat },
  ] as const;

  return (
    <div className="rounded-2xl bg-white p-6 border border-[#e2eaf3] shadow-sm flex flex-col justify-between hover:border-[#0ea5e9]/40 transition-all">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#e2eaf3]">
          <div className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full shadow-xs"
              style={{ backgroundColor: advice.color }}
            />
            <div>
              <h3 className="text-base font-extrabold text-[#10243e]">{advice.aqiCategory}</h3>
              <span className="text-xs text-[#64748b] font-mono">
                AQI Range: {advice.range}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-[#64748b] uppercase font-bold">Mask Advice</div>
            <div className="text-xs font-bold text-[#0ea5e9] flex items-center justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {advice.recommendedMask}
            </div>
          </div>
        </div>

        {/* Audience Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 my-4 bg-[#f5f8fc] p-1 rounded-xl border border-[#e2eaf3]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-[#0ea5e9] text-white shadow-xs"
                    : "text-[#64748b] hover:text-[#10243e] hover:bg-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="min-h-[85px] bg-[#f5f8fc] p-4 rounded-xl border border-[#e2eaf3]">
          <p className="text-xs sm:text-sm text-[#1e293b] leading-relaxed font-medium">
            {activeTab === "general" && advice.general}
            {activeTab === "children" && advice.children}
            {activeTab === "elderly" && advice.elderly}
            {activeTab === "workers" && advice.outdoorWorkers}
          </p>
        </div>
      </div>

      {advice.airPurifierNeeded && (
        <div className="mt-4 flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Indoor HEPA air purification strongly recommended for homes &amp; offices.</span>
        </div>
      )}
    </div>
  );
}
