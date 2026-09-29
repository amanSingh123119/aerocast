"use client";

import { useState } from "react";
import Link from "next/link";
import { initialStations } from "@/lib/data";
import { Station } from "@/types";
import { getAQICategory, getAQIColor } from "@/lib/utils";
import StationDetailModal from "@/components/StationDetailModal";
import { 
  Radio, 
  Search, 
  ArrowUpDown, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  XCircle,
  Wind,
  Activity
} from "lucide-react";

export default function StationsPage() {
  const [stations] = useState<Station[]>(initialStations);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [sortBy, setSortBy] = useState<"aqi" | "name" | "pm25">("aqi");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const cities = ["All", "Delhi", "Noida", "Gurugram", "Ghaziabad", "Faridabad"];

  const filtered = stations
    .filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === "All" || s.city.toLowerCase() === selectedCity.toLowerCase();
      return matchesSearch && matchesCity;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortBy === "pm25") {
        const valA = a.pm25 ?? 0;
        const valB = b.pm25 ?? 0;
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
      const valA = a.currentAQI ?? 0;
      const valB = b.currentAQI ?? 0;
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });

  const toggleSort = (field: "aqi" | "name" | "pm25") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#489938] mb-2">
          <Radio className="w-3.5 h-3.5" /> CAAQMS Real-Time Sensor Telemetry
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Delhi NCR Continuous Air Monitoring Stations
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl">
          Real-time readings from Central Pollution Control Board (CPCB) and State Pollution Control Boards across the National Capital Region.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2eaf3] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search station or locality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs text-[#64748b] font-semibold mr-1 hidden sm:inline">Region:</span>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCity === city
                  ? "bg-[#0ea5e9] text-white shadow-sm"
                  : "bg-white border border-[#e2eaf3] text-[#64748b] hover:bg-[#f5f8fc] hover:text-[#10243e]"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Stations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th
                  onClick={() => toggleSort("name")}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    Station Name <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">City / Region</th>
                <th
                  onClick={() => toggleSort("aqi")}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    Air Quality Index (AQI) <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("pm25")}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center gap-1">
                    PM2.5 <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Weather</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Map Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((station) => {
                const cat = getAQICategory(station.currentAQI || 150);
                const color = getAQIColor(cat);

                return (
                  <tr
                    key={station.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{station.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {station.city}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-base font-black"
                          style={{ color: color.hex }}
                        >
                          {station.currentAQI}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${color.badge}`}
                        >
                          {cat}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="font-bold text-slate-900">{station.pm25}</span> µg/m³
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {station.temperature}°C · {station.windSpeed} km/h {station.windDirection}
                    </td>
                    <td className="py-3.5 px-4">
                      {station.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 font-bold">
                          <XCircle className="w-3 h-3" /> Offline
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedStation(station)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0284c7] border border-sky-200 text-xs font-semibold transition-colors"
                        >
                          <Activity className="w-3 h-3" />
                          <span>Diurnal</span>
                        </button>
                        <Link
                          href="/map"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-[#f5f8fc] text-[#1e293b] border border-[#e2eaf3] text-xs font-semibold transition-colors shadow-xs"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Locate</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 24-Hour Diurnal Curve Inspector Modal */}
      <StationDetailModal
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />
    </div>
  );
}
