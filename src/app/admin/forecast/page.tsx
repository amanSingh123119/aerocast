"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { initialForecasts } from "@/lib/data";
import { ForecastItem } from "@/types";
import { 
  TrendingUp, 
  ArrowLeft, 
  CheckCircle2, 
  Plus, 
  UploadCloud, 
  FileSpreadsheet,
  FileUp,
  Download
} from "lucide-react";

export default function AdminForecastPage() {
  const [forecasts, setForecasts] = useState<ForecastItem[]>(initialForecasts);
  const [forecastDate, setForecastDate] = useState("2026-10-03");
  const [hour, setHour] = useState("06:00");
  const [aqi, setAqi] = useState(315);
  const [pm25, setPm25] = useState(190);
  const [temp, setTemp] = useState(23);
  const [windSpeed, setWindSpeed] = useState(3.5);
  const [inversion, setInversion] = useState<"Low" | "Moderate" | "High" | "Severe">("High");
  const [confidence, setConfidence] = useState(90);
  const [summary, setSummary] = useState("Predicted nighttime particulate trapping under low boundary layer.");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/forecast")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setForecasts(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      forecastDate,
      hour,
      aqi: Number(aqi),
      pm25: Number(pm25),
      pm10: Math.round(Number(pm25) * 1.5),
      temperature: Number(temp),
      windSpeed: Number(windSpeed),
      windDirection: "NW",
      inversionStrength: inversion,
      confidence: Number(confidence),
      dominantPollutant: "PM2.5",
      summary,
    };

    try {
      const res = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.forecast) {
        setForecasts([data.forecast, ...forecasts]);
      }
    } catch {
      const fallback: ForecastItem = {
        id: `f-${Date.now()}`,
        ...payload,
        category: Number(aqi) > 300 ? "Very Poor" : "Poor",
      };
      setForecasts([fallback, ...forecasts]);
    }

    setIsSubmitting(false);
    setSuccessMsg("Timestep published successfully to the AEROCAST live coupled model!");
    setTimeout(() => setSuccessMsg(""), 4500);
  };

  const handleBulkSimulate = () => {
    const bulkBatch: ForecastItem[] = [
      {
        id: `f-${Date.now()}-1`,
        forecastDate: "2026-10-03",
        hour: "12:00",
        aqi: 260,
        pm25: 140,
        pm10: 220,
        temperature: 28,
        windSpeed: 6.2,
        windDirection: "WNW",
        inversionStrength: "Moderate",
        confidence: 88,
        category: "Poor",
        dominantPollutant: "PM2.5",
        summary: "Afternoon ventilation clears surface particulate concentration.",
      },
      {
        id: `f-${Date.now()}-2`,
        forecastDate: "2026-10-03",
        hour: "18:00",
        aqi: 295,
        pm25: 165,
        pm10: 250,
        temperature: 25,
        windSpeed: 4.8,
        windDirection: "NW",
        inversionStrength: "High",
        confidence: 86,
        category: "Poor",
        dominantPollutant: "PM2.5",
        summary: "Evening commuter peak combined with cooling planetary boundary layer.",
      },
    ];

    setForecasts([...bulkBatch, ...forecasts]);
    setSuccessMsg("Bulk WRF-Chem coupled model run ingested (2 new timesteps registered).");
    setTimeout(() => setSuccessMsg(""), 4500);
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
            Publish &amp; Calibrate Coupled Forecasts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Admin tool to manually publish, calibrate, or batch import numerical weather &amp; dispersion forecast steps.
          </p>
        </div>

        <button
          onClick={handleBulkSimulate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#0284c7] font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto shadow-xs"
        >
          <FileUp className="w-4 h-4" />
          Import WRF Model Batch
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Publishing Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eaf3] shadow-sm space-y-4"
        >
          <h2 className="text-base font-bold text-[#10243e] flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#0ea5e9]" />
            New Forecast Timestep Entry
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1">
                Forecast Date
              </label>
              <input
                type="date"
                required
                value={forecastDate}
                onChange={(e) => setForecastDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1">
                Hour / Slot (IST)
              </label>
              <input
                type="text"
                required
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                placeholder="e.g. 06:00"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1">
                Predicted AQI
              </label>
              <input
                type="number"
                required
                min="0"
                max="500"
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
                required
                min="0"
                value={pm25}
                onChange={(e) => setPm25(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1">
                Temp (°C)
              </label>
              <input
                type="number"
                required
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1">
                Wind (km/h)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={windSpeed}
                onChange={(e) => setWindSpeed(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1">
                Confidence %
              </label>
              <input
                type="number"
                min="50"
                max="99"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#10243e] mb-1">
              Thermal Inversion Strength
            </label>
            <select
              value={inversion}
              onChange={(e) => setInversion(e.target.value as any)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9]"
            >
              <option value="Low">Low (Favorable Dispersion)</option>
              <option value="Moderate">Moderate (Average Mixing)</option>
              <option value="High">High (Particulates Trapped)</option>
              <option value="Severe">Severe (Critical Smog Layer)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#10243e] mb-1">
              Meteorological Advisory Note
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#e2eaf3] text-[#10243e] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#0ea5e9]/25 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {isSubmitting ? "Publishing..." : "Publish Timestep to Production"}
          </button>
        </form>

        {/* Existing Forecast Feed Preview */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#e2eaf3] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#10243e] flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#10b981]" />
              Published Forecast Records ({forecasts.length})
            </h2>
            <span className="text-[10px] text-[#64748b] font-mono">Live WRF Coupled Database</span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {forecasts.map((fc) => (
              <div
                key={fc.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {fc.forecastDate} · {fc.hour || "12:00"}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    PM2.5: {fc.pm25} µg/m³ · Wind: {fc.windSpeed} km/h · Inversion: {fc.inversionStrength}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-rose-600">{fc.aqi} AQI</div>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Conf: {fc.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
