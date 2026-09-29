"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { initialStations } from "@/lib/data";
import { Station } from "@/types";
import { 
  Radio, 
  ArrowLeft, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Power, 
  MapPin 
} from "lucide-react";

export default function AdminStationsPage() {
  const [stations, setStations] = useState<Station[]>(initialStations);
  const [name, setName] = useState("");
  const [city, setCity] = useState("Delhi");
  const [lat, setLat] = useState("28.6139");
  const [lng, setLng] = useState("77.2090");
  const [aqi, setAqi] = useState(250);
  const [pm25, setPm25] = useState(140);
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  useEffect(() => {
    fetch("/api/stations")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStations(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleToggleStation = async (id: string) => {
    const updated = stations.map((st) => (st.id === id ? { ...st, isActive: !st.isActive } : st));
    setStations(updated);
    const station = updated.find((s) => s.id === id);
    try {
      await fetch("/api/admin/stations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(station),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateStation = async (e: React.FormEvent) => {
    e.preventDefault();
    const newStationData = {
      name,
      city,
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      isActive: true,
      currentAQI: Number(aqi),
      pm25: Number(pm25),
      pm10: Math.round(Number(pm25) * 1.6),
    };

    try {
      const res = await fetch("/api/stations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStationData),
      });
      const data = await res.json();
      if (data.station) {
        setStations([data.station, ...stations]);
      }
    } catch {
      const fallback: Station = {
        id: `station-${Date.now()}`,
        ...newStationData,
        temperature: 24,
        humidity: 58,
        windSpeed: 4.0,
        windDirection: "NW",
        status: Number(aqi) > 300 ? "Very Poor" : "Poor",
        lastUpdated: "Just now",
      };
      setStations([fallback, ...stations]);
    }

    setShowAddModal(false);
    setName("");
    setFeedbackMsg(`Station "${name}" successfully registered and mapped across NCR grid!`);
    setTimeout(() => setFeedbackMsg(""), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Console
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            CAAQMS Monitoring Stations Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Add, calibrate coordinates, and control telemetry status for Delhi NCR sensor stations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#0ea5e9]/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Station
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Add Station Modal / Form */}
      {showAddModal && (
        <form
          onSubmit={handleCreateStation}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eaf3] shadow-sm space-y-4"
        >
          <h3 className="text-base font-bold text-[#10243e] flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#0ea5e9]" />
            Register New CAAQMS Sensor Station
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1">
                Station Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alipur / Pusa Road"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1">
                City / Region
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9]"
              >
                <option value="Delhi">Delhi</option>
                <option value="Noida">Noida</option>
                <option value="Gurugram">Gurugram</option>
                <option value="Ghaziabad">Ghaziabad</option>
                <option value="Faridabad">Faridabad</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1">
                Latitude
              </label>
              <input
                type="text"
                required
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1">
                Longitude
              </label>
              <input
                type="text"
                required
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1">
                Baseline AQI
              </label>
              <input
                type="number"
                value={aqi}
                onChange={(e) => setAqi(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1">
                PM2.5 (µg/m³)
              </label>
              <input
                type="number"
                value={pm25}
                onChange={(e) => setPm25(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-xl bg-[#f5f8fc] border border-[#e2eaf3] text-[#64748b] text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold shadow-md shadow-[#0ea5e9]/25 transition-all"
            >
              Save &amp; Activate Sensor
            </button>
          </div>
        </form>
      )}

      {/* Stations List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            All Continuous CAAQMS Hardware Devices ({stations.length})
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {stations.filter((s) => s.isActive).length} Operational
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Station</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Coordinates</th>
                <th className="py-3 px-4">Live Telemetry</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Toggle Power</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stations.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{st.name}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{st.city}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {st.latitude.toFixed(4)}, {st.longitude.toFixed(4)}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="font-bold text-slate-900">{st.currentAQI} AQI</span> · PM2.5: {st.pm25} µg/m³
                  </td>
                  <td className="py-3 px-4">
                    {st.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Online
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        <XCircle className="w-3 h-3" /> Suspended
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleStation(st.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        st.isActive
                          ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {st.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
