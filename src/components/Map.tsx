"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Station } from "@/types";
import { getAQICategory, getAQIColor } from "@/lib/utils";
import {
  Wind,
  Thermometer,
  Droplets,
  Radio,
  Navigation,
  Layers,
  X,
  Compass,
  Maximize2,
  RefreshCw,
  Activity,
} from "lucide-react";

interface MapProps {
  stations: Station[];
  selectedStationId?: string;
  onSelectStation?: (station: Station) => void;
}

export default function Map({ stations, selectedStationId, onSelectStation }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const currentTileLayerRef = useRef<any>(null);

  const [mounted, setMounted] = useState(false);
  const [activeStation, setActiveStation] = useState<Station | null>(null);
  const [mapStyle, setMapStyle] = useState<"voyager" | "osm">("voyager");
  const [showActiveCard, setShowActiveCard] = useState(true);

  // Sync mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync activeStation with selectedStationId or default to first station
  useEffect(() => {
    if (selectedStationId) {
      const match = stations.find((s) => s.id === selectedStationId);
      if (match) {
        setActiveStation(match);
        setShowActiveCard(true);
        if (mapRef.current) {
          mapRef.current.flyTo([match.latitude, match.longitude], 13, { duration: 1.0 });
        }
      }
    } else if (stations.length > 0 && !activeStation) {
      setActiveStation(stations[0]);
    }
  }, [selectedStationId, stations]);

  // Render markers onto the LayerGroup
  const updateMarkers = useCallback(() => {
    if (!mapRef.current || !markersGroupRef.current || !leafletRef.current) return;
    const L = leafletRef.current;
    const markersGroup = markersGroupRef.current;

    markersGroup.clearLayers();

    stations.forEach((st) => {
      const isSelected = st.id === (selectedStationId || activeStation?.id);
      const cat = getAQICategory(st.currentAQI || 150);
      const color = getAQIColor(cat);

      // Create high-visibility interactive HTML marker
      const customIcon = L.divIcon({
        className: "custom-aerocast-marker",
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            ${
              isSelected
                ? `
              <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: ${color.hex}; opacity: 0.35; animation: pulse 1.6s infinite ease-in-out;"></div>
              <div style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; border: 2px solid ${color.hex};"></div>
            `
                : ""
            }
            <div style="
              position: relative;
              z-index: ${isSelected ? 9999 : 500};
              background: #ffffff;
              color: #10243e;
              border: 2px solid ${isSelected ? "#0ea5e9" : color.hex};
              border-radius: 9999px;
              padding: 2px 7px;
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 11px;
              font-weight: 800;
              box-shadow: 0 4px 14px rgba(16, 36, 62, 0.18);
              display: flex;
              align-items: center;
              gap: 4px;
              transform: ${isSelected ? "scale(1.15)" : "scale(1)"};
              transition: all 0.2s ease;
            ">
              <span style="width: 7px; height: 7px; border-radius: 9999px; background: ${color.hex}; flex-shrink: 0;"></span>
              <span>${st.currentAQI || "--"}</span>
            </div>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      });

      const marker = L.marker([st.latitude, st.longitude], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 0,
      });

      marker.bindTooltip(
        `
        <div style="font-family: system-ui, sans-serif; padding: 2px 4px;">
          <div style="font-weight: 800; color: #10243e; font-size: 12px;">${st.name}</div>
          <div style="color: ${color.hex}; font-weight: 700; font-size: 11px; margin-top: 1px;">AQI ${st.currentAQI || "--"} · ${cat}</div>
          <div style="color: #64748b; font-size: 10px; margin-top: 2px;">${st.city} · PM2.5: ${st.pm25 || "--"} µg/m³</div>
        </div>
      `,
        { direction: "top", offset: [0, -14], opacity: 0.96 }
      );

      marker.on("click", () => {
        setActiveStation(st);
        setShowActiveCard(true);
        if (onSelectStation) {
          onSelectStation(st);
        }
      });

      markersGroup.addLayer(marker);
    });
  }, [stations, selectedStationId, activeStation, onSelectStation]);

  // Initialize Map once mounted
  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    if (mapRef.current) return; // Prevent re-initialization

    let isCancelled = false;

    const initMap = async () => {
      try {
        const L = (await import("leaflet")).default;
        if (isCancelled) return;
        leafletRef.current = L;

        const container = containerRef.current;
        if (!container) return;

        // Clean any leftover leaflet ID
        if ((container as any)._leaflet_id) {
          delete (container as any)._leaflet_id;
        }

        const mapInstance = L.map(container, {
          center: [28.6139, 77.209],
          zoom: 11,
          zoomControl: true,
          attributionControl: true,
        });

        const tileLayer = L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
          {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
            maxZoom: 19,
          }
        ).addTo(mapInstance);

        currentTileLayerRef.current = tileLayer;

        const markersLayer = L.layerGroup().addTo(mapInstance);
        markersGroupRef.current = markersLayer;
        mapRef.current = mapInstance;

        // Invalidate size to guarantee tiles expand to full container width & height
        setTimeout(() => {
          if (!isCancelled && mapRef.current) {
            mapRef.current.invalidateSize();
          }
        }, 200);

        setTimeout(() => {
          if (!isCancelled && mapRef.current) {
            mapRef.current.invalidateSize();
          }
        }, 600);

        // Initial markers render
        updateMarkers();
      } catch (err) {
        console.error("Leaflet map initialization error:", err);
      }
    };

    initMap();

    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isCancelled = true;
      window.removeEventListener("resize", handleResize);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersGroupRef.current = null;
      }
    };
  }, [mounted, updateMarkers]);

  // Update markers on station or selection change
  useEffect(() => {
    if (mapRef.current && markersGroupRef.current) {
      updateMarkers();
    }
  }, [stations, selectedStationId, updateMarkers]);

  // Recenter to Delhi NCR
  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo([28.6139, 77.209], 11, { duration: 1.0 });
    }
  };

  // Toggle Map Tiles
  const toggleMapStyle = () => {
    if (!mapRef.current || !leafletRef.current) return;
    const L = leafletRef.current;
    const newStyle = mapStyle === "voyager" ? "osm" : "voyager";
    setMapStyle(newStyle);

    if (currentTileLayerRef.current) {
      mapRef.current.removeLayer(currentTileLayerRef.current);
    }

    const newLayer =
      newStyle === "voyager"
        ? L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
            {
              attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
              maxZoom: 19,
            }
          )
        : L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
          });

    newLayer.addTo(mapRef.current);
    currentTileLayerRef.current = newLayer;
  };

  if (!mounted) {
    return (
      <div className="w-full h-[600px] rounded-2xl bg-white border border-[#e2eaf3] flex items-center justify-center text-[#64748b]">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 border-2 border-[#0ea5e9] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#10243e]">
            Loading Delhi NCR Spatial Telemetry...
          </span>
        </div>
      </div>
    );
  }

  const selectedCategory = activeStation ? getAQICategory(activeStation.currentAQI || 150) : null;
  const selectedColor = selectedCategory ? getAQIColor(selectedCategory) : null;

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-[#e2eaf3] shadow-md bg-white">
      {/* Map DOM Container */}
      <div ref={containerRef} className="w-full h-full z-0" />

      {/* Map Overlay Controls */}
      <div className="absolute top-4 left-4 z-[990] flex items-center gap-2">
        <button
          onClick={handleRecenter}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-xs font-bold text-[#10243e] border border-[#e2eaf3] shadow-md backdrop-blur-md transition-all active:scale-95"
          title="Recenter to Delhi NCR"
        >
          <Navigation className="w-3.5 h-3.5 text-[#0ea5e9]" />
          <span>Delhi NCR</span>
        </button>

        <button
          onClick={toggleMapStyle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-xs font-bold text-[#10243e] border border-[#e2eaf3] shadow-md backdrop-blur-md transition-all active:scale-95"
          title="Toggle Tile Style"
        >
          <Layers className="w-3.5 h-3.5 text-[#0284c7]" />
          <span className="capitalize">{mapStyle === "voyager" ? "Voyager" : "OSM"}</span>
        </button>

        <div className="px-2.5 py-1.5 rounded-xl bg-white/95 text-[11px] font-bold text-[#64748b] border border-[#e2eaf3] shadow-md backdrop-blur-md hidden sm:flex items-center gap-1">
          <Activity className="w-3 h-3 text-[#10b981]" />
          <span>{stations.length} Active Stations</span>
        </div>
      </div>

      {/* Floating Info Card for Active Station */}
      {activeStation && selectedColor && showActiveCard && (
        <div className="absolute top-4 right-4 z-[990] w-80 bg-white/95 rounded-2xl p-4 border border-[#e2eaf3] shadow-xl backdrop-blur-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#10b981] flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" /> Live CAAQMS Station
              </span>
              <h3 className="text-sm font-extrabold text-[#10243e] mt-0.5 leading-snug">
                {activeStation.name}
              </h3>
              <p className="text-xs text-[#64748b]">{activeStation.city}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${selectedColor.badge}`}
              >
                {selectedCategory}
              </span>
              <button
                onClick={() => setShowActiveCard(false)}
                className="p-1 rounded-lg text-[#64748b] hover:text-[#10243e] hover:bg-slate-100 transition-colors"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between bg-[#f5f8fc] p-3 rounded-xl border border-[#e2eaf3]">
            <div>
              <span className="text-[10px] text-[#64748b] uppercase font-bold">
                Air Quality Index
              </span>
              <div
                className="text-3xl font-black"
                style={{ color: selectedColor.hex }}
              >
                {activeStation.currentAQI || "--"}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#64748b] uppercase font-bold">
                PM2.5 Level
              </span>
              <div className="text-base font-extrabold text-[#10243e]">
                {activeStation.pm25 || "--"}{" "}
                <span className="text-xs text-[#64748b]">µg/m³</span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-[#f5f8fc] p-2 rounded-xl border border-[#e2eaf3]">
              <div className="text-[#64748b] flex items-center justify-center gap-1 text-[11px]">
                <Thermometer className="w-3 h-3 text-amber-500" />
                <span>Temp</span>
              </div>
              <div className="font-bold text-[#10243e] mt-0.5">
                {activeStation.temperature ?? 24}°C
              </div>
            </div>
            <div className="bg-[#f5f8fc] p-2 rounded-xl border border-[#e2eaf3]">
              <div className="text-[#64748b] flex items-center justify-center gap-1 text-[11px]">
                <Droplets className="w-3 h-3 text-blue-500" />
                <span>Humidity</span>
              </div>
              <div className="font-bold text-[#10243e] mt-0.5">
                {activeStation.humidity ?? 52}%
              </div>
            </div>
            <div className="bg-[#f5f8fc] p-2 rounded-xl border border-[#e2eaf3]">
              <div className="text-[#64748b] flex items-center justify-center gap-1 text-[11px]">
                <Wind className="w-3 h-3 text-[#0ea5e9]" />
                <span>Wind</span>
              </div>
              <div className="font-bold text-[#10243e] mt-0.5">
                {activeStation.windSpeed ?? 12} km/h
              </div>
            </div>
          </div>

          <div className="mt-2.5 text-[11px] text-[#64748b] flex items-center justify-between">
            <span>Wind Dir: <strong className="text-[#10243e]">{activeStation.windDirection || "NW"}</strong></span>
            <span>{activeStation.lastUpdated || "Live updated"}</span>
          </div>
        </div>
      )}

      {/* Floating Map Legend */}
      <div className="absolute bottom-4 left-4 z-[990] bg-white/95 rounded-xl p-3 border border-[#e2eaf3] shadow-md backdrop-blur-md hidden sm:block">
        <div className="text-[10px] font-bold text-[#10243e] uppercase tracking-wider mb-1.5 flex items-center justify-between gap-4">
          <span>AQI Severity Scale</span>
          <span className="text-[9px] text-[#64748b] font-normal">CPCB Standards</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#1e293b] font-semibold">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Good (0-50)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> Satisfactory (51-100)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> Moderate (101-200)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" /> Poor (201-300)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" /> Very Poor (301-400)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" /> Severe (401+)
          </span>
        </div>
      </div>
    </div>
  );
}
