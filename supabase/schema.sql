-- ==========================================================
-- CleanAir NCR - PostgreSQL / Supabase Database Schema
-- Smart India Hackathon 2026 | Problem Statement SIH26082
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. STATIONS TABLE (CAAQMS Sensor Network)
CREATE TABLE IF NOT EXISTS stations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    city VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. AQI READINGS TABLE (Continuous Observations)
CREATE TABLE IF NOT EXISTS aqi_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id VARCHAR(50) REFERENCES stations(id) ON DELETE CASCADE,
    pm25 DOUBLE PRECISION NOT NULL,
    pm10 DOUBLE PRECISION NOT NULL,
    aqi INTEGER NOT NULL,
    temperature DOUBLE PRECISION,
    humidity DOUBLE PRECISION,
    wind_speed DOUBLE PRECISION,
    wind_direction VARCHAR(10),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast time-series queries
CREATE INDEX IF NOT EXISTS idx_aqi_station_time ON aqi_readings(station_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_stations_city ON stations(city);

-- 4. FORECASTS TABLE (72-Hour Coupled Dispersion Model Outputs)
CREATE TABLE IF NOT EXISTS forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    forecast_date DATE NOT NULL,
    hour VARCHAR(10) NOT NULL,
    aqi INTEGER NOT NULL,
    pm25 DOUBLE PRECISION NOT NULL,
    pm10 DOUBLE PRECISION,
    temperature DOUBLE PRECISION,
    wind_speed DOUBLE PRECISION,
    wind_direction VARCHAR(20),
    inversion_strength VARCHAR(20) CHECK (inversion_strength IN ('Low', 'Moderate', 'High', 'Severe')),
    confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
    dominant_pollutant VARCHAR(20) DEFAULT 'PM2.5',
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forecasts_date ON forecasts(forecast_date, hour);

-- 5. USER ALERTS TABLE (Citizen Threshold Warnings)
CREATE TABLE IF NOT EXISTS user_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    station_id VARCHAR(50) REFERENCES stations(id) ON DELETE CASCADE,
    threshold_aqi INTEGER NOT NULL,
    location VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    notify_email BOOLEAN DEFAULT TRUE,
    notify_sms BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_alerts_user ON user_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_alerts_station ON user_alerts(station_id);

-- 6. HEALTH ADVICE TABLE (CPCB Guidelines)
CREATE TABLE IF NOT EXISTS health_advice (
    id VARCHAR(50) PRIMARY KEY,
    aqi_category VARCHAR(50) NOT NULL,
    range VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL,
    general TEXT NOT NULL,
    children TEXT NOT NULL,
    elderly TEXT NOT NULL,
    outdoor_workers TEXT NOT NULL,
    recommended_mask VARCHAR(100),
    air_purifier_needed BOOLEAN DEFAULT FALSE
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqi_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_advice ENABLE ROW LEVEL SECURITY;

-- Stations & Health Advice: Anyone can read
CREATE POLICY "Public stations read" ON stations FOR SELECT USING (true);
CREATE POLICY "Public health_advice read" ON health_advice FOR SELECT USING (true);
CREATE POLICY "Public forecasts read" ON forecasts FOR SELECT USING (true);
CREATE POLICY "Public aqi_readings read" ON aqi_readings FOR SELECT USING (true);

-- User Alerts: Users can only see and manage their own alerts
CREATE POLICY "Users view own alerts" ON user_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own alerts" ON user_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own alerts" ON user_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own alerts" ON user_alerts FOR DELETE USING (auth.uid() = user_id);

-- Users: Users can read their own profile
CREATE POLICY "Users view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON users FOR UPDATE USING (auth.uid() = id);
