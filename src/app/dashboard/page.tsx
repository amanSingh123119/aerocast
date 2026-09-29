"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { initialStations } from "@/lib/data";
import { User, UserAlert, Station } from "@/types";
import { getAQICategory, getAQIColor } from "@/lib/utils";
import StationMarker from "@/components/StationMarker";
import StationDetailModal from "@/components/StationDetailModal";
import { 
  Bell, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Mail, 
  Smartphone, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Heart,
  History,
  Clock,
  Settings,
  Baby,
  HeartPulse,
  HardHat
} from "lucide-react";

interface NotificationLog {
  id: string;
  time: string;
  stationName: string;
  recordedAQI: number;
  thresholdAQI: number;
  channel: "Email" | "SMS" | "Both";
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [user, setUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [stations] = useState<Station[]>(initialStations);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  // Vulnerability Profile State
  const [hasChildren, setHasChildren] = useState(true);
  const [hasElderly, setHasElderly] = useState(true);
  const [hasAsthma, setHasAsthma] = useState(false);

  // New alert form state
  const [locationName, setLocationName] = useState("");
  const [stationId, setStationId] = useState(stations[0]?.id || "");
  const [thresholdAQI, setThresholdAQI] = useState(250);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Simulation and logs state
  const [simulationSent, setSimulationSent] = useState(false);
  const [logs, setLogs] = useState<NotificationLog[]>([
    {
      id: "log-1",
      time: "Today, 08:30 AM",
      stationName: "Anand Vihar, Delhi",
      recordedAQI: 388,
      thresholdAQI: 300,
      channel: "Email",
    },
    {
      id: "log-2",
      time: "Yesterday, 07:15 PM",
      stationName: "Sector 62, Noida",
      recordedAQI: 362,
      thresholdAQI: 250,
      channel: "Both",
    },
  ]);

  // Load user and alerts from API
  useEffect(() => {
    setUser(getCurrentUser());

    fetch("/api/user/alerts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAlerts(data);
        }
      })
      .catch((err) => console.error("Error loading alerts:", err));
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const station = stations.find((s) => s.id === stationId);
    const newAlertData = {
      userId: user?.id || "usr-citizen-01",
      stationId,
      stationName: station?.name || "Selected Station",
      thresholdAQI: Number(thresholdAQI),
      location: locationName || "My Alert Zone",
      notifyEmail,
      notifySms,
    };

    try {
      const res = await fetch("/api/user/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAlertData),
      });
      const data = await res.json();
      if (data.alert) {
        setAlerts([data.alert, ...alerts]);
      }
    } catch {
      // Fallback local update
      const fallback: UserAlert = {
        id: `alt-${Date.now()}`,
        ...newAlertData,
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setAlerts([fallback, ...alerts]);
    }

    setLocationName("");
    setShowAddForm(false);
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      await fetch(`/api/user/alerts?id=${id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
    }
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const handleSimulateAlert = () => {
    const breachedAlert = alerts[0] || {
      stationName: "Anand Vihar, Delhi",
      thresholdAQI: 250,
      notifyEmail: true,
      notifySms: false,
    };

    const newLog: NotificationLog = {
      id: `log-${Date.now()}`,
      time: "Just now",
      stationName: breachedAlert.stationName,
      recordedAQI: 388,
      thresholdAQI: breachedAlert.thresholdAQI,
      channel: breachedAlert.notifySms ? "Both" : "Email",
    };

    setLogs([newLog, ...logs]);
    setSimulationSent(true);
    setTimeout(() => setSimulationSent(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10b981] mb-1">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" /> Citizen Air Watch Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10243e]">
            Welcome, {user?.name || "Citizen"}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1">
            Account: {user?.email || "citizen@aerocast.in"} · Role: <span className="uppercase text-[#10b981] font-bold">{user?.role || "Citizen"}</span>
          </p>
        </div>

        <button
          onClick={handleSimulateAlert}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold shadow-md shadow-[#0ea5e9]/25 transition-all shrink-0 active:scale-[0.98]"
        >
          <Send className="w-4 h-4" />
          Test Early Warning Notification
        </button>
      </div>

      {/* Unauthorized access banner */}
      {error === "admin_required" && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>
            Access Restricted: Administrator privileges are required to view the Ministry Operations Console. Please switch to an Admin account.
          </span>
        </div>
      )}

      {/* Simulator banner */}
      {simulationSent && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong>Early Warning Dispatched!</strong> An automated alert was simulated for &quot;Anand Vihar, Delhi&quot; (Recorded 388 AQI exceeding your 250 threshold) to {user?.email || "your registered email"}.
          </div>
        </div>
      )}

      {/* Health Profile & Sensitive Demographic Settings */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            Household Vulnerability Profile (Personalized Advisory Filters)
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Customizes alert guidance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => setHasChildren(!hasChildren)}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
              hasChildren
                ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Baby className="w-4 h-4 text-emerald-600" />
            <span>School Children in Household {hasChildren ? "✓" : ""}</span>
          </button>

          <button
            onClick={() => setHasElderly(!hasElderly)}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
              hasElderly
                ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <HeartPulse className="w-4 h-4 text-amber-600" />
            <span>Senior Citizens (60+ yrs) {hasElderly ? "✓" : ""}</span>
          </button>

          <button
            onClick={() => setHasAsthma(!hasAsthma)}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
              hasAsthma
                ? "bg-rose-50 border-rose-300 text-rose-800 shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Asthma / Respiratory Sensitivity {hasAsthma ? "✓" : ""}</span>
          </button>
        </div>
      </div>

      {/* Saved Alerts Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eaf3] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2eaf3]">
          <div>
            <h2 className="text-lg font-bold text-[#10243e] flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#0ea5e9]" />
              My Active Air Quality Alert Triggers ({alerts.length})
            </h2>
            <p className="text-xs text-[#64748b]">
              The system automatically queries ground CAAQMS stations and dispatches alerts when thresholds are breached.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold transition-all shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? "Close Form" : "Create New Alert"}
          </button>
        </div>

        {/* Create Alert Form Drawer */}
        {showAddForm && (
          <form
            onSubmit={handleCreateAlert}
            className="p-5 rounded-2xl bg-[#f5f8fc] border border-sky-200 space-y-4"
          >
            <h3 className="text-sm font-bold text-[#10243e]">Configure New Alert Trigger</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#10243e] mb-1">
                  Location Nickname
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home (East Delhi) / Office"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#10243e] mb-1">
                  Monitoring Station
                </label>
                <select
                  value={stationId}
                  onChange={(e) => setStationId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9]"
                >
                  {stations.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#10243e] mb-1">
                  AQI Threshold Trigger ({thresholdAQI} AQI)
                </label>
                <input
                  type="range"
                  min="100"
                  max="450"
                  step="25"
                  value={thresholdAQI}
                  onChange={(e) => setThresholdAQI(Number(e.target.value))}
                  className="w-full mt-2 accent-[#0ea5e9]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#1e293b]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0ea5e9] accent-[#0ea5e9]"
                />
                <Mail className="w-3.5 h-3.5 text-[#64748b]" />
                <span>Email Notifications</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifySms}
                  onChange={(e) => setNotifySms(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0ea5e9] accent-[#0ea5e9]"
                />
                <Smartphone className="w-3.5 h-3.5 text-[#64748b]" />
                <span>SMS / WhatsApp Alert</span>
              </label>

              <button
                type="submit"
                className="ml-auto px-5 py-2 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold transition-all shadow-sm"
              >
                Save Trigger
              </button>
            </div>
          </form>
        )}

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alt) => {
            const station = stations.find((s) => s.id === alt.stationId);
            const isBreached = (station?.currentAQI || 0) >= alt.thresholdAQI;

            return (
              <div
                key={alt.id}
                className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#489938]">
                        {alt.location}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">
                        {alt.stationName}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleDeleteAlert(alt.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        Threshold Trigger
                      </span>
                      <span className="text-base font-extrabold text-amber-600">
                        {alt.thresholdAQI} AQI
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        Live Station AQI
                      </span>
                      <span className="text-base font-extrabold text-rose-600">
                        {station?.currentAQI || 320} AQI
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-3 text-[#64748b]">
                    {alt.notifyEmail && (
                      <span className="flex items-center gap-1 font-medium">
                        <Mail className="w-3.5 h-3.5 text-[#0ea5e9]" /> Email
                      </span>
                    )}
                    {alt.notifySms && (
                      <span className="flex items-center gap-1 font-medium">
                        <Smartphone className="w-3.5 h-3.5 text-sky-600" /> SMS
                      </span>
                    )}
                  </div>

                  {isBreached ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" /> Threshold Breached
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      Normal Range
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monitored Favorite Stations */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eaf3] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#10243e] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#0ea5e9]" />
            Continuous CAAQMS Neighborhood Trackers
          </h2>
          <Link href="/map" className="text-xs text-[#0ea5e9] font-semibold hover:text-[#0284c7] hover:underline">
            View Spatial Map →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stations.slice(0, 3).map((st) => (
            <StationMarker
              key={st.id}
              station={st}
              onClick={() => setSelectedStation(st)}
            />
          ))}
        </div>
      </div>

      {/* Recent Alert Logs Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eaf3] shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-[#10243e] flex items-center gap-2">
          <History className="w-5 h-5 text-[#0ea5e9]" />
          Recent Alert Dispatch History
        </h2>

        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{log.stationName}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Recorded: <span className="text-rose-600 font-semibold">{log.recordedAQI} AQI</span> (Threshold: {log.thresholdAQI} AQI) · Via {log.channel}
                  </div>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-500 flex items-center gap-1 shrink-0">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Station Modal */}
      <StationDetailModal
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading citizen dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
