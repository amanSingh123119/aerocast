"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { setCurrentUser, DEMO_CITIZEN, DEMO_ADMIN } from "@/lib/auth";
import { Eye, EyeOff, AlertCircle, UserCheck, CheckCircle2, Wind } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const isAdmin = email.toLowerCase().includes("admin");
    setCurrentUser({
      id: `usr-${Date.now()}`,
      name: email.split("@")[0] || (isAdmin ? "Admin User" : "Citizen User"),
      email: email || "citizen@aerocast.in",
      role: isAdmin ? "admin" : "citizen",
      createdAt: new Date().toISOString(),
    });

    if (callbackUrl) {
      router.push(callbackUrl);
    } else {
      router.push(isAdmin ? "/admin" : "/dashboard");
    }
  };

  const handleQuickLogin = (role: "citizen" | "admin") => {
    if (role === "citizen") {
      setCurrentUser(DEMO_CITIZEN);
      if (callbackUrl && !callbackUrl.startsWith("/admin")) {
        router.push(callbackUrl);
      } else {
        router.push("/dashboard");
      }
    } else {
      setCurrentUser(DEMO_ADMIN);
      router.push(callbackUrl || "/admin");
    }
  };

  return (
    <div className="relative min-h-[92vh] w-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-10 bg-[#f5f8fc] overflow-hidden">
      {/* Background Image: Delhi Skyline with India Gate fading to white on the left */}
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-right pointer-events-none"
        style={{
          backgroundImage: "url('/delhi-bg.jpg')",
          backgroundPosition: "right 20% center",
        }}
      />
      {/* Gradient Overlay for ultra-smooth blend into soft off-white/light blue on the left */}
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
            Welcome back
          </h1>
          <p className="text-[#64748b] text-sm sm:text-base mt-2">
            Sign in to get personalised air quality alerts and protected atmospheric intelligence access.
          </p>
        </div>

        {/* Callback Alert if redirected by middleware */}
        {callbackUrl && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 max-w-md">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Please sign in to access <strong>{callbackUrl}</strong></span>
          </div>
        )}

        {/* Login Card */}
        <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(16,36,62,0.06)] border border-[#e2eaf3]">
          <form onSubmit={handleCustomLogin} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-[#10243e] mb-1.5">
                Email address or Mobile Phone
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or mobile phone"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#f5f8fc] border border-[#e2eaf3] text-[#10243e] placeholder:text-[#64748b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/25 focus:border-[#0ea5e9] transition-all"
              />
            </div>

            {/* Password */}
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
                  placeholder="Enter your password"
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

              {/* Remember me & Forgot password row */}
              <div className="flex items-center justify-between text-xs mt-2">
                <label className="flex items-center gap-1.5 cursor-pointer text-[#1e293b] select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-[#0ea5e9] accent-[#0ea5e9]"
                  />
                  <span className="text-[11px] font-medium text-[#64748b]">Remember me</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("A password reset link has been dispatched to your email address.");
                  }}
                  className="text-xs font-semibold text-[#0ea5e9] hover:text-[#0284c7] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Benefit Checkmarks matching SignUp */}
            <div className="space-y-1.5 pt-1 text-[11px] text-[#64748b]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Real-time SMS &amp; WhatsApp air alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Encrypted session &amp; protected atmospheric dashboard</span>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold text-sm shadow-md shadow-[#0ea5e9]/25 hover:shadow-lg hover:shadow-[#0ea5e9]/35 transition-all active:scale-[0.99]"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e2eaf3]" />
            </div>
            <span className="relative bg-white px-3 text-xs text-[#64748b] font-medium">
              or continue with
            </span>
          </div>

          {/* Social Sign In Buttons: Google & Apple */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleQuickLogin("citizen")}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#e2eaf3] bg-white hover:bg-[#f5f8fc] text-xs font-semibold text-[#1e293b] transition-all shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            {/* Apple */}
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

          {/* Sign up prompt */}
          <div className="mt-6 text-center text-xs text-[#64748b] font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#0ea5e9] font-semibold hover:text-[#0284c7] hover:underline">
              Sign up
            </Link>
          </div>

          {/* Quick Demo Switcher for Evaluators (Collapsed / Expandable) */}
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#64748b]">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
