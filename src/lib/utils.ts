import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AQICategory } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

export function getAQIColor(category: AQICategory): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  hex: string;
} {
  switch (category) {
    case 'Good':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-500',
        border: 'border-emerald-500/30',
        badge: 'bg-emerald-600 text-white',
        hex: '#10b981',
      };
    case 'Satisfactory':
      return {
        bg: 'bg-green-500/10',
        text: 'text-green-500',
        border: 'border-green-500/30',
        badge: 'bg-green-600 text-white',
        hex: '#22c55e',
      };
    case 'Moderate':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-500',
        border: 'border-amber-500/30',
        badge: 'bg-amber-600 text-white',
        hex: '#f59e0b',
      };
    case 'Poor':
      return {
        bg: 'bg-orange-500/10',
        text: 'text-orange-500',
        border: 'border-orange-500/30',
        badge: 'bg-orange-600 text-white',
        hex: '#f97316',
      };
    case 'Very Poor':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-500',
        border: 'border-rose-500/30',
        badge: 'bg-rose-600 text-white',
        hex: '#f43f5e',
      };
    case 'Severe':
    default:
      return {
        bg: 'bg-purple-500/10',
        text: 'text-purple-500',
        border: 'border-purple-500/30',
        badge: 'bg-purple-700 text-white',
        hex: '#8b5cf6',
      };
  }
}
