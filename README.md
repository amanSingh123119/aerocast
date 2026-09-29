# 🍃 CleanAir NCR – Coupled AI Air Quality & Weather Forecasting Platform
**Smart India Hackathon 2026 | Problem Statement: SIH26082**  
*Air Pollution-Weather Coupled Forecasting System for the National Capital Region (Delhi, Noida, Gurugram, Ghaziabad, Faridabad)*

---

## 📌 Executive Summary
**CleanAir NCR** is an end-to-end full-stack air quality monitoring and predictive platform that bridges physical meteorological simulations (planetary boundary layer dynamics, thermal inversion layers, surface wind vectors) with continuous ground-level CAAQMS sensor observations. It delivers hyper-localized, 72-hour air quality forecasts, automated citizen alerts, and an administrative operations console for government and environmental officials.

---

## 🏛️ High-Level System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                                 USERS                                   │
│            (Citizens · Environmental Analysts · Ministry Officials)     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 14)                           │
│  - Live Regional Overview with Animated AQI Gauge & CPCB Spectrum       │
│  - Interactive Spatial CAAQMS Sensor Map (Leaflet)                      │
│  - 72-Hour Physical Dispersion & Inversion Forecast (Recharts)          │
│  - Medical & Vulnerable Demographic Health Advisories                   │
│  - Continuous Monitoring Stations Registry with 24h Diurnal Curves      │
│  - Protected Citizen Early Warning Dashboard                            │
│  - Ministry Operations & Sensor Hardware Console                        │
└──────────────────┬─────────────────────────────────────┬────────────────┘
                   │                                     │
                   ▼                                     ▼
┌──────────────────────────────────────┐   ┌──────────────────────────────┐
│        AUTHENTICATION & RBAC         │   │          API LAYER           │
│  (Next.js Middleware + Cookie Auth)  │   │     (Next.js Route Handlers) │
│  - Role-Based Access: Citizen/Admin  │   │  - /api/aqi/live             │
│  - 1-Click Hackathon Evaluator Login │   │  - /api/stations             │
│  - Route Protection for /admin & /dash│  │  - /api/forecast             │
└──────────────────────────────────────┘   │  - /api/health-advice        │
                                           │  - /api/user/alerts          │
                                           │  - /api/admin/analytics      │
                                           │  - /api/cron/fetch-aqi       │
                                           │  - /api/cron/dispatch-alerts │
                                           └──────────────┬───────────────┘
                                                          │
                         ┌────────────────────────────────┼────────────────────────────────┐
                         ▼                                ▼                                ▼
              ┌─────────────────────┐          ┌─────────────────────┐          ┌─────────────────────┐
              │      DATABASE       │          │    EXTERNAL APIs    │          │  BACKGROUND CRONS   │
              │   (PostgreSQL /     │          │  - CPCB / WAQI Geo  │          │  - Hourly Fetcher   │
              │    Supabase RLS)    │          │  - OpenWeatherMap   │          │  - Alert Dispatcher │
              │  - 6 Relational     │          │  - SAFAR / IITM     │          │  - Vercel Cron      │
              │    Indexed Tables   │          │    Coupled Model    │          │    Automation       │
              └─────────────────────┘          └─────────────────────┘          └─────────────────────┘
```

---

## 🛠️ Technology Stack
- **Framework**: [Next.js 14](https://nextjs.org) (App Router, Server-Side Rendering, Route Handlers)
- **Language**: TypeScript (`strict` mode)
- **Styling**: Tailwind CSS (Dark Mode Design System, Custom Glassmorphism, Micro-Animations)
- **Spatial Mapping**: [Leaflet](https://leafletjs.com) + React Leaflet + CartoDB Dark Matter / Voyager Tiles (100% SSR-Safe Dynamic Client Loading)
- **Data Visualization**: [Recharts](https://recharts.org) (Area Charts, Diurnal Curve Timeline)
- **Icons**: [Lucide React](https://lucide.dev)
- **Database**: PostgreSQL / [Supabase](https://supabase.com) with Row-Level Security (RLS) & Time-Series Indices
- **Background Scheduled Tasks**: Vercel Cron (`vercel.json`) for hourly ingestion and threshold evaluation

---

## 🌐 Application Routes & Pages

| Route | Name | Key Functionalities |
| :--- | :--- | :--- |
| `/` | **Home Page** | Live NCR AQI gauge, atmospheric metrics (PM2.5, PM10, Wind, Temperature), official CPCB scale, critical hotspots vs cleanest zones leaderboard, and interactive diurnal inspector drawer. |
| `/map` | **Live Spatial Map** | Interactive NCR map with CAAQMS station circles colored by CPCB risk band, station search, city filters (Delhi, Noida, Gurugram, Ghaziabad, Faridabad), and floating telemetry HUD. |
| `/forecast` | **72-Hour Forecast** | Coupled WRF-Chem dispersion projections, nocturnal thermal boundary layer inversion advisory, and interactive multi-metric timeline (AQI, PM2.5, Wind Speed). |
| `/health` | **Health Advisories** | CPCB-aligned medical guidance categorized by 6 AQI tiers with demographic tabs (**Children**, **Elderly**, **Outdoor Workers**) and N95/HEPA recommendations. |
| `/stations` | **CAAQMS Directory** | Searchable and sortable registry of all continuous monitoring stations with 1-click **24-Hour Diurnal Observation Curve** inspection. |
| `/login` | **Sign In** | Features a **1-Click Evaluator Demo Login Switcher** (`👤 Citizen` vs `🛡️ Admin`) and honors callback URL redirects. |
| `/signup` | **Sign Up** | Citizen account creation with phone number support for early warning alerts. |
| `/dashboard` | **Citizen Dashboard** | Protected portal: custom AQI threshold alert triggers, notification channels (Email/SMS), household vulnerability profile (Children, Elderly, Asthma), and live alert dispatch simulator. |
| `/admin` | **Admin Console** | Protected administrative command center: real-time system metrics, ingestion pipeline health, and quick operational links. |
| `/admin/forecast` | **Forecast Ingestion** | Publishing interface for new forecast timesteps with a 1-click **WRF Model Batch Import** tool. |
| `/admin/stations` | **Hardware Management**| Station registry, coordinate calibrator, and remote hardware **Activate / Deactivate** power controls. |

---

## 📡 REST API Architecture

### Public Telemetry
- `GET /api/aqi/live`: Real-time aggregated Delhi NCR AQI, primary pollutant, weather metrics, and synchronization state.
- `GET /api/stations`: Returns all CAAQMS hardware stations with current observations.
- `POST /api/stations`: Registers a new continuous monitoring station with GPS coordinates.
- `GET /api/aqi/station/[id]`: Station-specific reading plus calculated 24-hour diurnal trend dataset.
- `GET /api/forecast`: Fetches 72-hour air quality & meteorological predictions.
- `POST /api/forecast`: Ingests a new forecast timestep.
- `GET /api/health-advice`: Returns structured clinical precautions for each AQI band.

### Citizen Personal Alerts
- `GET /api/user/alerts`: Returns alert triggers for the authenticated user.
- `POST /api/user/alerts`: Saves a new personal threshold alert rule.
- `DELETE /api/user/alerts?id=[id]`: Disables or removes an alert rule.

### Administrative & Analytics
- `GET /api/admin/analytics`: Real-time platform usage metrics, active stations count, and uptime stats.
- `POST /api/admin/forecast`: Bulk publish coupled model outputs.
- `POST /api/admin/stations`: Update station hardware status.

### Automated Background Workers
- `GET /api/cron/fetch-aqi`: Hourly automated task that syncs ground sensor data from external APIs into the database.
- `GET /api/cron/dispatch-alerts`: Hourly automated task that scans user threshold rules against live readings and dispatches breach warnings.

---

## 🗄️ Database Architecture (PostgreSQL / Supabase)

All database assets are located in the [`supabase/`](file:///c:/Users/aman2/OneDrive/Attachments/sih%2026082/cleanair-ncr/supabase) directory:
- **[`supabase/schema.sql`](file:///c:/Users/aman2/OneDrive/Attachments/sih%2026082/cleanair-ncr/supabase/schema.sql)**:
  - Tables: `users`, `stations`, `aqi_readings`, `forecasts`, `user_alerts`, `health_advice`.
  - Composite time-series indices: `idx_aqi_station_time ON aqi_readings(station_id, recorded_at DESC)`.
  - Row Level Security (RLS) policies for user data isolation.
- **[`supabase/seed.sql`](file:///c:/Users/aman2/OneDrive/Attachments/sih%2026082/cleanair-ncr/supabase/seed.sql)**:
  - Seeds 10 continuous CAAQMS stations across NCR (Anand Vihar, ITO, R.K. Puram, Punjabi Bagh, Dwarka, Lodhi Road, Gurugram, Noida, Ghaziabad, Faridabad).
  - Seeds official CPCB clinical health advisories across all 6 AQI tiers.

---

## ⚡ Quick Start & Local Run

### 1. Prerequisites
- **Node.js** (v18.17+ or v20+)
- **npm** (v9+)

### 2. Installation
```bash
cd cleanair-ncr
npm install
```

### 3. Running Locally
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🛡️ Hackathon Evaluator Quick Login Guide

To test role-based access control and protected views without typing credentials:
1. Navigate to **[http://localhost:3000/login](http://localhost:3000/login)**.
2. Choose one of the quick buttons in the **Evaluator / Quick Demo Login** box:
   - **👤 Log in as Citizen**: Signs in as *Aman Sharma* (`citizen` role) and opens the **Citizen Dashboard** (`/dashboard`).
   - **🛡️ Log in as Admin**: Signs in as *Dr. K. Swaminathan* (`admin` role) and grants full access to the **Ministry Admin Console** (`/admin`).

---

## 🚀 Deployment to Vercel

1. Push this project to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set your Environment Variables in the Vercel Project Settings (refer to [`.env.example`](file:///c:/Users/aman2/OneDrive/Attachments/sih%2026082/cleanair-ncr/.env.example)).
4. Click **Deploy**. Vercel will automatically configure the background cron jobs defined in [`vercel.json`](file:///c:/Users/aman2/OneDrive/Attachments/sih%2026082/cleanair-ncr/vercel.json).

---
© 2026 CleanAir NCR · Smart India Hackathon 2026 (SIH26082)
