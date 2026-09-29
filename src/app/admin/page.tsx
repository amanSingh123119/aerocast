"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { User } from "@/types";
import { 
  ShieldCheck, 
  Users, 
  Radio, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight,
  Server,
  Zap
} from "lucide-react";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const stats = [
    {
      label: "Active Monitoring Stations",
      value: "10 / 10",
      sub: "100% operational CAAQMS telemetry",
      icon: Radio,
      color: "text-emerald-400",
      border: "border-emerald-500/30",
    },
    {
      label: "Citizen Alert Subscribers",
      value: "3,892",
      sub: "+24% increase in winter smog period",
      icon: Users,
      color: "text-cyan-400",
      border: "border-cyan-500/30",
    },
    {
      label: "Forecast Model Runs (72h)",
      value: "720",
      sub: "Coupled WRF-Chem runs executed",
      icon: TrendingUp,
      color: "text-purple-400",
      border: "border-purple-500/30",
    },
    {
      label: "Critical Inversion Hotspots",
      value: "4 Zones",
      sub: "East Delhi, Ghaziabad, Noida, Anand Vihar",
      icon: Activity,
      color: "text-rose-400",
      border: "border-rose-500/30",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-purple-50/80 rounded-3xl p-6 sm:p-8 border border-purple-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0ea5e9] mb-1">
            <ShieldCheck className="w-4 h-4 text-[#0ea5e9]" /> Ministry &amp; Admin Operations Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10243e]">
            AEROCAST System Administration
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1">
            Logged in as: <span className="font-semibold text-[#10243e]">{user?.name || "MoES Administrator"}</span> · Role: <span className="uppercase text-[#0ea5e9] font-bold">Admin</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/forecast"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold shadow-md shadow-[#0ea5e9]/25 transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            Update Model Forecast
          </Link>
          <Link
            href="/admin/stations"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#f5f8fc] border border-[#e2eaf3] text-[#10243e] text-xs font-semibold transition-all shadow-xs"
          >
            <Radio className="w-4 h-4" />
            Manage Stations
          </Link>
        </div>
      </div>

      {/* Analytics Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.label}
              className="p-6 rounded-2xl bg-white border border-[#e2eaf3] shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  {st.label}
                </span>
                <Icon className={`w-5 h-5 ${st.color}`} />
              </div>
              <div className="text-3xl font-black text-[#10243e]">{st.value}</div>
              <p className="text-xs text-[#64748b]">{st.sub}</p>
            </div>
          );
        })}
      </div>

      {/* System Telemetry & Quick Admin Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Management Links */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eaf3] shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#10243e] flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Administrative Workflows
          </h2>

          <div className="space-y-3">
            <Link
              href="/admin/forecast"
              className="flex items-center justify-between p-4 rounded-2xl bg-[#f5f8fc] border border-[#e2eaf3] hover:border-[#0ea5e9]/40 hover:bg-sky-50/40 transition-all group"
            >
              <div>
                <h4 className="text-sm font-bold text-[#10243e] group-hover:text-[#0ea5e9] transition-colors">
                  Publish AI Forecast Trajectory
                </h4>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Inject new boundary layer predictions, inversion alerts, and hourly AQI estimates.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#64748b] group-hover:text-[#0ea5e9] transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/admin/stations"
              className="flex items-center justify-between p-4 rounded-2xl bg-[#f5f8fc] border border-[#e2eaf3] hover:border-emerald-300 hover:bg-emerald-50/40 transition-all group"
            >
              <div>
                <h4 className="text-sm font-bold text-[#10243e] group-hover:text-[#10b981] transition-colors">
                  CAAQMS Stations Management
                </h4>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Register new monitoring hardware, calibrate sensors, or mark offline stations.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#64748b] group-hover:text-[#10b981] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Server Status & Ingestion Health */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eaf3] shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#10243e] flex items-center gap-2">
            <Server className="w-5 h-5 text-[#10b981]" />
            Ingestion Pipeline Health
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-700 font-medium">CPCB Central Telemetry Pipeline</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">● Healthy (200 OK)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-700 font-medium">SAFAR / IITM Pune Dispersion Coupler</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">● Synchronized</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-700 font-medium">IMD High-Resolution Surface Wind Radar</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">● Active (4.2 km/h NW)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-700 font-medium">Hourly Alert Dispatcher Queue</span>
              <span className="text-sky-600 font-bold flex items-center gap-1">● 0 Pending Tasks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
