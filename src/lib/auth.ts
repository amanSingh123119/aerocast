"use client";

import { User } from "@/types";

export const DEMO_CITIZEN: User = {
  id: "usr-citizen-01",
  name: "Aman Sharma",
  email: "aman@example.com",
  phone: "+91 98765 43210",
  role: "citizen",
  createdAt: "2026-09-01",
};

export const DEMO_ADMIN: User = {
  id: "usr-admin-01",
  name: "Dr. K. Swaminathan (MoES Admin)",
  email: "admin.aerocast@nic.in",
  phone: "+91 11 2468 9900",
  role: "admin",
  createdAt: "2026-01-15",
};

const USER_STORAGE_KEY = "aerocast_active_user";
const COOKIE_NAME = "aerocast_session";

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(USER_STORAGE_KEY);
    // Expire cookie
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  } else {
    const serialized = JSON.stringify(user);
    localStorage.setItem(USER_STORAGE_KEY, serialized);
    // Write session cookie for Next.js middleware (valid for 7 days)
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(serialized)}; path=/; max-age=${
      60 * 60 * 24 * 7
    }; SameSite=Lax`;
  }
  // Dispatch custom event for reactive Navbar updates
  window.dispatchEvent(new Event("auth-changed"));
}

export function logout(): void {
  setCurrentUser(null);
}
