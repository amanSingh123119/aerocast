"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCurrentUser, logout } from "@/lib/auth";
import { User } from "@/types";
import { 
  Wind, 
  MapPin, 
  TrendingUp, 
  ShieldAlert, 
  Radio, 
  LayoutDashboard, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  Menu, 
  X,
  UserCheck
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Wind },
    { href: "/map", label: "Live Map", icon: MapPin },
    { href: "/forecast", label: "72h Forecast", icon: TrendingUp },
    { href: "/health", label: "Health Advice", icon: ShieldAlert },
    { href: "/stations", label: "Stations", icon: Radio },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e2eaf3] shadow-[0_2px_15px_rgba(16,36,62,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo matching AEROCAST Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1769e0] via-[#0ea5e9] to-[#38bdf8] flex items-center justify-center shadow-md shadow-[#0ea5e9]/25 group-hover:scale-105 transition-transform">
              <Wind className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-[#10243e]">
                AERO<span className="text-[#0ea5e9]">CAST</span>
              </span>
              <span className="block text-[9px] text-[#0e9f91] font-bold tracking-wider uppercase">
                Coupled Atmospheric AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#0ea5e9]/10 text-[#0284c7] border border-[#0ea5e9]/25 shadow-xs font-bold"
                      : "text-[#64748b] hover:text-[#10243e] hover:bg-slate-100/80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}

            {/* Citizen Dashboard (if logged in) */}
            {user && (
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  pathname === "/dashboard"
                    ? "bg-[#0ea5e9]/10 text-[#0284c7] border border-[#0ea5e9]/25 font-bold"
                    : "text-[#64748b] hover:text-[#10243e] hover:bg-slate-100/80"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
            )}

            {/* Admin link (if admin) */}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  pathname.startsWith("/admin")
                    ? "bg-sky-100 text-[#0284c7] border border-sky-300 font-bold"
                    : "text-[#0284c7] hover:text-[#1769e0] hover:bg-sky-50"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* Right actions: Auth status */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-[#e2eaf3]">
                <div className="text-right">
                  <div className="text-xs font-bold text-[#10243e] flex items-center justify-end gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#10b981]" />
                    {user.name.split(" ")[0]}
                  </div>
                  <span
                    className={`text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded ${
                      user.role === "admin"
                        ? "bg-sky-100 text-[#0284c7] border border-sky-200"
                        : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-[#64748b] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#1e293b] hover:text-[#10243e] bg-white hover:bg-slate-50 border border-[#e2eaf3] transition-all shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0ea5e9] hover:bg-[#0284c7] shadow-sm shadow-[#0ea5e9]/25 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1e293b] hover:text-[#10243e] hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e2eaf3] bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive
                    ? "bg-[#0ea5e9]/10 text-[#0284c7] border border-[#0ea5e9]/20 font-bold"
                    : "text-[#1e293b] hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}

          {user && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#0284c7] bg-[#0ea5e9]/10"
            >
              <LayoutDashboard className="w-4 h-4" />
              Citizen Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#0284c7] bg-sky-50"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Panel
            </Link>
          )}

          <div className="pt-3 border-t border-[#e2eaf3]">
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#10243e]">{user.name}</div>
                  <div className="text-[11px] text-[#64748b]">{user.email} ({user.role})</div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-semibold text-[#1e293b] bg-slate-100 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-semibold text-white bg-[#0ea5e9] rounded-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
