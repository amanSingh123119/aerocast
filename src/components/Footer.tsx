import Link from "next/link";
import { Wind, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#e2eaf3] bg-white text-[#64748b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1769e0] via-[#0ea5e9] to-[#38bdf8] flex items-center justify-center text-white shadow-sm">
                <Wind className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-[#10243e] tracking-tight">
                AERO<span className="text-[#0ea5e9]">CAST</span>
              </span>
            </div>
            <p className="text-xs text-[#64748b] leading-relaxed max-w-md">
              High-resolution air pollution and weather coupled forecasting system tailored for the National Capital Region (Delhi, Noida, Gurugram, Ghaziabad, Faridabad). Powered by coupled meteorological dispersion modeling.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#10b981] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" />
              <span>Coupled Atmospheric AI &amp; Dispersion Intelligence</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#10243e] mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#0ea5e9] transition-colors">
                  Live NCR Overview
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-[#0ea5e9] transition-colors">
                  Interactive Spatial Map
                </Link>
              </li>
              <li>
                <Link href="/forecast" className="hover:text-[#0ea5e9] transition-colors">
                  72-Hour Forecast &amp; Inversion
                </Link>
              </li>
              <li>
                <Link href="/health" className="hover:text-[#0ea5e9] transition-colors">
                  Medical &amp; Health Advisories
                </Link>
              </li>
              <li>
                <Link href="/stations" className="hover:text-[#0ea5e9] transition-colors">
                  CAAQMS Stations Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#10243e] mb-3">
              Data &amp; Scientific Agencies
            </h4>
            <ul className="space-y-2 text-xs text-[#64748b]">
              <li className="hover:text-[#10243e]">CPCB (Central Pollution Control Board)</li>
              <li className="hover:text-[#10243e]">SAFAR / IITM Pune</li>
              <li className="hover:text-[#10243e]">IMD (India Meteorological Department)</li>
              <li className="hover:text-[#10243e]">Ministry of Earth Sciences (MoES)</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#e2eaf3] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#64748b]">
          <div>© 2026 AEROCAST · All Rights Reserved.</div>
          <div className="mt-2 sm:mt-0 font-medium text-[#10243e]">Coupled Atmospheric Forecasting Architecture</div>
        </div>
      </div>
    </footer>
  );
}

