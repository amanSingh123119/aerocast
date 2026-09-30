"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AQIGauge from "@/components/AQIGauge";
import AQIScale from "@/components/AQIScale";
import MetricCard from "@/components/MetricCard";
import ForecastCard from "@/components/ForecastCard";
import StationDetailModal from "@/components/StationDetailModal";
import { initialStations, initialForecasts } from "@/lib/data";
import { Station } from "@/types";
import { 
  Wind, 
  Thermometer, 
  MapPin, 
  ArrowRight, 
  BellRing, 
  Activity, 
  Compass, 
  Flame,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

export default function HomePage() {
  const [stations] = useState<Station[]>(initialStations);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [liveData, setLiveData] = useState<{
    aqi: number;
    pm25: number;
    pm10: number;
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    lastUpdated: string;
  }>({
    aqi: 319,
    pm25: 185,
    pm10: 280,
    temperature: 24,
    humidity: 60,
    windSpeed: 4.2,
    windDirection: "NW",
    lastUpdated: "Just now",
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchLive = () => {
    setRefreshing(true);
    fetch("/api/aqi/live")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.aqi) {
          setLiveData({
            aqi: data.aqi,
            pm25: data.pm25,
            pm10: data.pm10,
            temperature: data.temperature,
            humidity: data.humidity,
            windSpeed: data.windSpeed,
            windDirection: data.windDirection,
            lastUpdated: data.lastUpdated,
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setTimeout(() => setRefreshing(false), 500));
  };

  useEffect(() => {
    fetchLive();
  }, []);

  const activeStations = stations.filter((s) => s.isActive);
  const sortedStations = [...activeStations].sort((a, b) => (b.currentAQI || 0) - (a.currentAQI || 0));
  const hotspots = sortedStations.slice(0, 3);
  const cleanest = [...sortedStations].reverse().slice(0, 3);
  const forecastPreview = initialForecasts.slice(0, 3);

  // 5 Iconic Delhi NCR Landmarks for rotating background
  const delhiLandmarks = [
    {
      image: "/delhi-india-gate.jpg",
      name: "India Gate & Kartavya Path",
      location: "Central Delhi",
      grid: "Central CAAQMS Telemetry Grid",
    },
    {
      image: "/delhi-lotus-temple.jpg",
      name: "Lotus Temple & Kalkaji Green Ridge",
      location: "South Delhi",
      grid: "South Delhi Clean Atmospheric Corridor",
    },
    {
      image: "/delhi-akshardham.jpg",
      name: "Akshardham & Yamuna Riverfront",
      location: "East Delhi",
      grid: "Trans-Yamuna Dispersion Zone",
    },
    {
      image: "/delhi-central-vista.jpg",
      name: "Rashtrapati Bhavan & Raisina Hill",
      location: "New Delhi",
      grid: "Lutyens Boundary Layer Cluster",
    },
    {
      image: "/delhi-qutub-minar.jpg",
      name: "Qutub Minar & Mehrauli Forest Ridge",
      location: "South NCR",
      grid: "Aravalli Biodiversity & Wind Buffer",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % delhiLandmarks.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [delhiLandmarks.length]);

  return (
    <div className="relative overflow-hidden bg-[#f5f8fc]">
      {/* Delhi Landmarks Dynamic Backdrop Carousel with Crossfade */}
      <div className="absolute top-0 inset-x-0 h-[560px] overflow-hidden pointer-events-none z-[-1]">
        {delhiLandmarks.map((landmark, idx) => (
          <div
            key={landmark.image}
            className={`absolute inset-0 bg-no-repeat bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? "opacity-85 scale-100" : "opacity-0 scale-105"
            }`}
            style={{
              backgroundImage: `url('${landmark.image}')`,
              transitionProperty: "opacity, transform",
              transitionDuration: "1000ms",
            }}
          />
        ))}
        {/* Smooth gradient overlay to ensure crystal clear contrast with light UI cards */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/45 to-[#f5f8fc]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-8 pb-12 sm:pt-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Landmark Ticker & Manual Controls Bar */}
        <div className="flex items-center justify-between max-w-3xl mx-auto mb-6 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#e2eaf3] shadow-xs">
          <div className="flex items-center gap-2 text-xs truncate mr-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0" />
            <span className="text-[#64748b] font-medium hidden sm:inline">Delhi NCR Skyline:</span>
            <strong className="text-[#10243e] font-bold truncate">
              {delhiLandmarks[currentSlide].name}
            </strong>
            <span className="text-[10px] text-[#64748b] hidden md:inline">
              ({delhiLandmarks[currentSlide].location})
            </span>
          </div>

          {/* Interactive Slide Dots */}
          <div className="flex items-center gap-1.5 shrink-0">
            {delhiLandmarks.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`View ${delhiLandmarks[i].name}`}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide
                    ? "w-6 bg-[#0ea5e9]"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-[#0284c7] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-ping" />
            Live Coupled Meteorological Model Active
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#10243e] leading-tight">
            Delhi NCR Air Quality &amp; <br className="hidden sm:inline" />
            <span className="text-[#0ea5e9]">
              Coupled Weather Forecast
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#64748b] leading-relaxed font-normal">
            High-precision 72-hour air quality predictions combining physical dispersion dynamics, planetary boundary layer meteorology, and ground CAAQMS sensors.
          </p>
        </div>

        {/* Live Regional AQI Display & Quick Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-[#e2eaf3] shadow-[0_10px_35px_rgba(16,36,62,0.04)] relative">
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="text-center mb-3">
              <span className="text-xs uppercase tracking-widest text-[#64748b] font-extrabold flex items-center justify-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0ea5e9]" /> Delhi National Capital Region
              </span>
              <p className="text-xs text-[#64748b] mt-0.5">Aggregated from {activeStations.length} continuous CAAQMS stations</p>
            </div>

            <AQIGauge aqi={liveData.aqi} size={270} />

            <div className="mt-4 flex items-center gap-2 text-xs text-[#64748b] bg-[#f5f8fc] px-3.5 py-1.5 rounded-full border border-[#e2eaf3]">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span>Real-time CPCB / SAFAR feed · {liveData.lastUpdated}</span>
              <button
                onClick={fetchLive}
                disabled={refreshing}
                title="Refresh live data"
                className="ml-1 p-1 hover:text-[#10243e] text-[#64748b] transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#0ea5e9]" : ""}`} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#10243e] tracking-tight">
                Severe Particulate Smog Alert in Force
              </h2>
              <p className="mt-2 text-sm text-[#64748b] leading-relaxed font-normal">
                Stagnant northwest winds and low thermal boundary layer thickness have trapped particulates across East Delhi, Noida, and Ghaziabad. High concentration of fine inhalable particulate matter (PM2.5) detected.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/map"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold shadow-md shadow-[#0ea5e9]/25 transition-all"
              >
                <MapPin className="w-4 h-4" />
                Explore Live NCR Map
              </Link>
              <Link
                href="/forecast"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#f5f8fc] hover:bg-slate-100 text-[#10243e] text-xs font-bold transition-all border border-[#e2eaf3]"
              >
                72h Dispersion Outlook
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#0284c7] text-xs font-bold transition-all"
              >
                <BellRing className="w-4 h-4" />
                Set My AQI Alert
              </Link>
            </div>

            {/* Scale guide inside hero */}
            <div className="pt-4 border-t border-[#e2eaf3]">
              <AQIScale currentAQI={liveData.aqi} />
            </div>
          </div>
        </div>
      </section>

      {/* Key Meteorological & Pollutant Metrics */}
      <section className="relative z-10 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#10243e]">Atmospheric &amp; Pollutant Matrix</h2>
            <p className="text-xs text-[#64748b]">Coupled ground and surface meteorological observations</p>
          </div>
          <Link href="/stations" className="text-xs font-bold text-[#0ea5e9] hover:text-[#0284c7] hover:underline flex items-center gap-1">
            All CAAQMS Stations <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="PM2.5 (Fine Particulates)"
            value={liveData.pm25}
            unit="µg/m³"
            icon={<Activity className="w-5 h-5 text-rose-500" />}
            statusBadge="Dominant"
            statusBadgeColor="bg-rose-50 text-rose-700 border border-rose-200"
            subtext="Safe limit: 60 µg/m³"
            accentColor="from-rose-500/10 to-red-500/5"
          />
          <MetricCard
            label="PM10 (Coarse Dust)"
            value={liveData.pm10}
            unit="µg/m³"
            icon={<Wind className="w-5 h-5 text-amber-500" />}
            statusBadge="Elevated"
            statusBadgeColor="bg-amber-50 text-amber-700 border border-amber-200"
            subtext="Safe limit: 100 µg/m³"
            accentColor="from-amber-500/10 to-orange-500/5"
          />
          <MetricCard
            label="Surface Wind Dynamics"
            value={liveData.windSpeed}
            unit="km/h"
            icon={<Compass className="w-5 h-5 text-[#0ea5e9]" />}
            statusBadge="Calm NW"
            statusBadgeColor="bg-sky-50 text-[#0284c7] border border-sky-200"
            subtext="Poor dispersion conditions"
            accentColor="from-sky-500/10 to-blue-500/5"
          />
          <MetricCard
            label="Temperature &amp; Humidity"
            value={`${liveData.temperature}°C`}
            unit={`/ ${liveData.humidity}%`}
            icon={<Thermometer className="w-5 h-5 text-[#10b981]" />}
            statusBadge="Inversion Likely"
            statusBadgeColor="bg-emerald-50 text-[#0e9f91] border border-emerald-200"
            subtext="Nocturnal shallow boundary"
            accentColor="from-teal-500/10 to-emerald-500/5"
          />
        </div>
      </section>

      {/* 72-Hour Forecast Preview Section */}
      <section className="relative z-10 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#e2eaf3] gap-2">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#0ea5e9] font-bold">
              Predictive AI Dispersion
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#10243e]">72-Hour Coupled Air Forecast</h2>
          </div>
          <Link
            href="/forecast"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0ea5e9] hover:text-[#0284c7]"
          >
            Open Interactive Timeline &amp; Analysis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {forecastPreview.map((item) => (
            <ForecastCard key={item.id} forecast={item} />
          ))}
        </div>
      </section>

      {/* Hotspots & Cleanest Zones Leaderboard with Interactive Modal Trigger */}
      <section className="relative z-10 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#10243e]">Spatial Station Observations</h2>
            <p className="text-xs text-[#64748b]">Click any station to inspect its 24-hour diurnal curve</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Critical Pollution Hotspots */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2eaf3] shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-extrabold text-[#10243e]">Critical Hotspots (Highest AQI)</h3>
            </div>
            <div className="space-y-3">
              {hotspots.map((st, index) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStation(st)}
                  className="w-full text-left flex items-center justify-between p-3.5 rounded-2xl bg-[#f5f8fc] border border-[#e2eaf3] hover:border-rose-300 hover:bg-rose-50/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-[#10243e] group-hover:text-rose-700 transition-colors">
                        {st.name}
                      </div>
                      <div className="text-xs text-[#64748b]">{st.city} · PM2.5: {st.pm25} µg/m³</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-rose-600">{st.currentAQI}</span>
                    <span className="block text-[10px] font-bold uppercase text-rose-700">{st.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Relatively Better Air Quality Zones */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2eaf3] shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
              <h3 className="text-base font-extrabold text-[#10243e]">Relatively Better Zones (Lowest AQI)</h3>
            </div>
            <div className="space-y-3">
              {cleanest.map((st, index) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStation(st)}
                  className="w-full text-left flex items-center justify-between p-3.5 rounded-2xl bg-[#f5f8fc] border border-[#e2eaf3] hover:border-emerald-300 hover:bg-emerald-50/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#0e9f91] text-xs font-bold flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-[#10243e] group-hover:text-[#0e9f91] transition-colors">
                        {st.name}
                      </div>
                      <div className="text-xs text-[#64748b]">{st.city} · PM2.5: {st.pm25} µg/m³</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-[#10b981]">{st.currentAQI}</span>
                    <span className="block text-[10px] font-bold uppercase text-[#0e9f91]">{st.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Citizen Alert Notification Call-to-action */}
      <section className="relative z-10 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#1769e0] via-[#0284c7] to-[#0ea5e9] p-8 sm:p-12 shadow-xl shadow-[#0ea5e9]/20 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-200 uppercase tracking-wider mb-2">
              <BellRing className="w-4 h-4" /> Citizen Early Warning System
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Stay ahead of dangerous Delhi NCR smog spikes.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-sky-50 leading-relaxed">
              Configure personal AQI thresholds for your home, school, or workplace and receive instant automated notifications when air conditions deteriorate.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/signup"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#0284c7] font-bold text-xs uppercase tracking-wider shadow-lg text-center transition-all"
            >
              Sign Up for Free Alerts
            </Link>
            <Link
              href="/health"
              className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider border border-white/30 text-center transition-all"
            >
              Health Guidelines
            </Link>
          </div>
        </div>
      </section>

      {/* Station Diurnal Curve Inspector Modal */}
      <StationDetailModal
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />
    </div>
  );
}
