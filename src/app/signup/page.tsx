"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setCurrentUser, DEMO_CITIZEN, DEMO_ADMIN } from "@/lib/auth";
import { Eye, EyeOff, CheckCircle2, UserCheck, Wind } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      id: `usr-${Date.now()}`,
      name: name || "New Citizen",
      email: email,
      phone: phone,
      role: "citizen",
      createdAt: new Date().toISOString(),
    });
    router.push("/dashboard");
  };

  const handleQuickLogin = (role: "citizen" | "admin") => {
    if (role === "citizen") {
      setCurrentUser(DEMO_CITIZEN);
      router.push("/dashboard");
    } else {
      setCurrentUser(DEMO_ADMIN);
      router.push("/admin");
    }
  };

  return (
    <div className="relative min-h-[92vh] w-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-10 bg-[#f5f8fc] overflow-hidden">
      {/* Background Image: Delhi Skyline with India Gate */}
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-right pointer-events-none"
        style={{
          backgroundImage: "url('/delhi-bg.jpg')",
          backgroundPosition: "right 20% center",
        }}
      />
      {/* Gradient Overlay for ultra-smooth blend into soft off-white */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#f5f8fc] via-[#f5f8fc]/95 sm:via-[#f5f8fc]/90 md:via-[#f5f8fc]/80 to-transparent pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-xl">
        {/* Brand Header */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-8 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1769e0] via-[#0ea5e9] to-[#38bdf8] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Wind className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-[#10243e] tracking-tight">
            AERO<span className="text-[#0ea5e9]">CAST</span>
          </span>
        </Link>

        {/* Headings */}
        <div className="mb-6">
          <h1 className="text-4xl sm:text-5xl font-black text-[#10243e] tracking-tight">
            Join AEROCAST
          </h1>
          <p className="text-[#64748b] text-sm sm:text-base mt-2">
            Create an account to get personalised air quality alerts and protected atmospheric intelligence access.
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(16,36,62,0.06)] border border-[#e2eaf3]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aman Sharma"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#f5f8fc] border border-[#e2eaf3] text-[#10243e] placeholder:text-[#64748b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/25 focus:border-[#0ea5e9] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#f5f8fc] border border-[#e2eaf3] text-[#10243e] placeholder:text-[#64748b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/25 focus:border-[#0ea5e9] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1.5">
                Mobile Phone (SMS &amp; WhatsApp Alerts)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#f5f8fc] border border-[#e2eaf3] text-[#10243e] placeholder:text-[#64748b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/25 focus:border-[#0ea5e9] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl bg-[#f5f8fc] border border-[#e2eaf3] text-[#10243e] placeholder:text-[#64748b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/25 focus:border-[#0ea5e9] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#10243e] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 text-[11px] text-[#64748b]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Real-time SMS &amp; WhatsApp air alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Custom CPCB threshold notification presets</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold text-sm shadow-md shadow-[#0ea5e9]/25 hover:shadow-lg hover:shadow-[#0ea5e9]/35 transition-all active:scale-[0.99]"
            >
              Create Free Account
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e2eaf3]" />
            </div>
            <span className="relative bg-white px-3 text-xs text-[#64748b] font-medium">
              or sign up with
            </span>
          </div>

          {/* Social Sign In Buttons: Google & Apple */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleQuickLogin("citizen")}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#e2eaf3] bg-white hover:bg-[#f5f8fc] text-xs font-semibold text-[#1e293b] transition-all shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("citizen")}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#e2eaf3] bg-white hover:bg-[#f5f8fc] text-xs font-semibold text-[#1e293b] transition-all shadow-xs"
            >
              <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.7-11.64-13.98-6.19-9.5-11.06-20.12-14.61-31.84-3.56-11.73-5.33-23.08-5.33-34.07 0-14.28 3.7-25.9 11.09-34.87 7.4-8.97 16.59-13.57 27.58-13.8 4.79 0 10.23 1.25 16.32 3.75 6.09 2.5 10.05 3.79 11.9 3.87 1.42 0 5.43-1.33 12.02-3.99 6.59-2.65 12.02-3.83 16.29-3.54 11.56.76 20.89 4.88 27.97 12.37-9.83 5.92-14.64 14.15-14.43 24.69.21 8.85 3.65 16.22 10.31 22.12 6.67 5.9 14.52 9.21 23.57 9.94-2.22 6.74-4.99 13.52-8.32 20.35zM119.22 31.84c0-7.72 2.76-14.99 8.28-21.81 5.53-6.82 12.28-10.74 20.26-11.77.22 1.3.33 2.45.33 3.45 0 7.61-2.9 15.02-8.71 22.23-5.81 7.21-12.56 11.19-20.26 11.93-.11-1.3-.23-2.64-.23-4.03z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          {/* Already have an account */}
          <div className="mt-6 text-center text-xs text-[#64748b] font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0ea5e9] font-semibold hover:text-[#0284c7] hover:underline">
              Sign In
            </Link>
          </div>

          {/* Quick Demo Switcher */}
          <div className="mt-5 pt-4 border-t border-[#e2eaf3]">
            <button
              type="button"
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="w-full flex items-center justify-between text-[11px] text-[#64748b] font-semibold hover:text-[#10243e] transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#10b981]" />
                Platform Quick Role Switcher
              </span>
              <span>{showDemoMenu ? "▲ Hide" : "▼ Show"}</span>
            </button>

            {showDemoMenu && (
              <div className="grid grid-cols-2 gap-2 mt-2 pt-1 animate-fade-in">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("citizen")}
                  className="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0e9f91] text-[11px] font-bold border border-emerald-200 text-center transition-colors"
                >
                  👤 Citizen Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("admin")}
                  className="py-1.5 px-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0284c7] text-[11px] font-bold border border-sky-200 text-center transition-colors"
                >
                  🛡️ Admin Demo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


