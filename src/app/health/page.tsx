"use client";

import { useState } from "react";
import { healthAdviceList } from "@/lib/data";
import HealthCard from "@/components/HealthCard";
import AQIScale from "@/components/AQIScale";
import { 
  ShieldAlert, 
  HeartHandshake, 
  Wind, 
  CheckCircle, 
  AlertOctagon, 
  FileText 
} from "lucide-react";

export default function HealthPage() {
  const [adviceList] = useState(healthAdviceList);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#489938] mb-2">
          <ShieldAlert className="w-3.5 h-3.5" /> Medical Health Advisory Protocol
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Air Quality Health Advisory Guidelines
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl">
          Clinical recommendations and preventive measures formulated by medical experts and environmental health boards to protect citizens against acute and chronic particulate pollution.
        </p>
      </div>

      {/* AQI Reference Scale */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <AQIScale currentAQI={312} />
      </div>

      {/* Emergency Precaution Summary Box */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-50 via-white to-white border border-rose-200/80 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4" /> Immediate Health Precautions
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            When AQI reaches &quot;Very Poor&quot; (301–400) or &quot;Severe&quot; (401+)
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl">
            Fine particulates (PM2.5) bypass upper respiratory filtration and enter deep alveolar capillaries, elevating heart attack risks and exacerbating asthma.
          </p>
        </div>

        <div className="space-y-2 text-xs text-slate-700 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#489938]" />
            <span>Wear certified <strong>N95 / FFP2 respirators</strong> outdoors</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#489938]" />
            <span>Avoid morning runs &amp; outdoor HIIT workouts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#489938]" />
            <span>Use True-HEPA air purification in bedrooms</span>
          </div>
        </div>
      </div>

      {/* Health Advice Breakdown by AQI Category */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Detailed Precautions by AQI Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adviceList.map((item) => (
            <HealthCard key={item.id} advice={item} />
          ))}
        </div>
      </div>

      {/* Vulnerable Groups Detailed Guidance */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-[#489938]" />
          Special Protective Guidance for High-Risk Populations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-2">School Children</h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Children breathe 50% more air per pound of body weight than adults and their lung airways are still developing. Schools should suspend outdoor assemblies and morning physical education when AQI exceeds 250.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-2">Senior Citizens &amp; Cardiac Patients</h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Elderly individuals face heightened vulnerability to vascular constriction and blood pressure spikes induced by fine particulates. Keep routine medication readily accessible and limit walks to midday sunshine hours.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-2">Traffic Police &amp; Delivery Agents</h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Continuous occupational exposure to vehicular emissions requires mandatory fit-tested N95 masks with exhalation valves, accompanied by regular hydration and eye lubrication drops.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
