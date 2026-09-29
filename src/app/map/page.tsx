"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { initialStations } from "@/lib/data";
import { Station } from "@/types";
import { getAQICategory, getAQIColor } from "@/lib/utils";
import StationMarker from "@/components/StationMarker";
import { Search, MapPin, Filter, Radio, Info } from "lucide-react";

// Dynamically import Map with ssr: false to prevent Next.js window undefined error
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-2xl bg-white border border-[#e2eaf3] shadow-sm flex items-center justify-center text-[#64748b]">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 border-2 border-[#0ea5e9] border-t-transparent rounded-full animate-spin" />
        <span>Initializing Delhi NCR Spatial Telemetry...</span>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const [stations] = useState<Station[]>(initialStations);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedStationId, setSelectedStationId] = useState<string | undefined>(stations[0]?.id);

  const cities = ["All", "Delhi", "Noida", "Gurugram", "Ghaziabad", "Faridabad"];

  const filteredStations = stations.filter((s) => {
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "All" || s.city.toLowerCase() === selectedCity.toLowerCase();
    return matchesQuery && matchesCity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10b981] mb-1">
            <Radio className="w-3.5 h-3.5" /> Spatial CAAQMS Sensor Grid
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10243e]">
            Live Delhi NCR Air Quality Map
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b]">
            Real-time continuous ambient air quality stations mapped across the National Capital Region.
          </p>
        </div>

        {/* Search & City Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search station or locality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] shadow-sm transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
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
      </div>

      {/* Main Map View & Station Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map */}
        <div className="lg:col-span-8">
          <Map
            stations={filteredStations}
            selectedStationId={selectedStationId}
            onSelectStation={(st) => setSelectedStationId(st.id)}
          />
        </div>

        {/* Station List Sidebar */}
        <div className="lg:col-span-4 flex flex-col h-[600px] bg-white rounded-2xl p-4 border border-[#e2eaf3] shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2eaf3]">
            <span className="text-xs font-bold text-[#10243e] uppercase tracking-wider">
              Stations ({filteredStations.length})
            </span>
            <span className="text-[11px] text-[#64748b] font-medium">Click to inspect</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 mt-3">
            {filteredStations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#64748b]">
                <MapPin className="w-8 h-8 text-[#64748b]/40 mb-2" />
                <p className="text-xs font-bold text-[#10243e]">No stations match criteria</p>
                <p className="text-[11px] text-[#64748b] mt-1">
                  No sensors found for &quot;{searchQuery || selectedCity}&quot;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCity("All");
                  }}
                  className="mt-3 px-3 py-1.5 rounded-xl bg-[#0ea5e9] text-white text-xs font-bold hover:bg-[#0284c7] transition-all shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredStations.map((station) => (
                <StationMarker
                  key={station.id}
                  station={station}
                  compact={true}
                  isSelected={station.id === selectedStationId}
                  onClick={() => setSelectedStationId(station.id)}
                />
              ))
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-[#e2eaf3] text-[11px] text-[#64748b] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
            <span>Telemetry calibrated with IMD surface AWS sensors.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
