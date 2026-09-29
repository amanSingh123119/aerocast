export type AQICategory = 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';

export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  isActive: boolean;
  currentAQI?: number;
  pm25?: number;
  pm10?: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  windDirection?: string;
  status?: AQICategory;
  lastUpdated?: string;
}

export interface AQIReading {
  id: string;
  stationId: string;
  stationName: string;
  pm25: number;
  pm10: number;
  aqi: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  recordedAt: string;
  category: AQICategory;
}

export interface ForecastItem {
  id: string;
  forecastDate: string;
  hour?: string;
  aqi: number;
  pm25: number;
  pm10: number;
  temperature: number;
  windSpeed: number;
  windDirection: string;
  inversionStrength: 'Low' | 'Moderate' | 'High' | 'Severe';
  confidence: number; // percentage, e.g. 88
  category: AQICategory;
  dominantPollutant: string;
  summary: string;
}

export interface UserAlert {
  id: string;
  userId: string;
  stationId: string;
  stationName: string;
  thresholdAQI: number;
  location: string;
  isActive: boolean;
  notifyEmail: boolean;
  notifySms: boolean;
  createdAt: string;
}

export interface HealthAdviceItem {
  id: string;
  aqiCategory: AQICategory;
  range: string;
  color: string;
  general: string;
  children: string;
  elderly: string;
  outdoorWorkers: string;
  recommendedMask: string;
  airPurifierNeeded: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'citizen' | 'admin';
  createdAt: string;
}
