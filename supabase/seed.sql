-- ==========================================================
-- CleanAir NCR - Seed Data for PostgreSQL / Supabase
-- ==========================================================

-- Insert Default CAAQMS Stations
INSERT INTO stations (id, name, latitude, longitude, city, is_active) VALUES
('del-01', 'Anand Vihar, Delhi', 28.6469, 77.3160, 'Delhi', true),
('del-02', 'ITO Crossing, Delhi', 28.6289, 77.2407, 'Delhi', true),
('del-03', 'R.K. Puram, Delhi', 28.5660, 77.1767, 'Delhi', true),
('del-04', 'Punjabi Bagh, Delhi', 28.6692, 77.1276, 'Delhi', true),
('del-05', 'Dwarka Sector 8, Delhi', 28.5708, 77.0715, 'Delhi', true),
('del-06', 'Lodhi Road (IMD), Delhi', 28.5918, 77.2273, 'Delhi', true),
('ncr-01', 'Sector 51, Gurugram', 28.4283, 77.0718, 'Gurugram', true),
('ncr-02', 'Sector 62, Noida', 28.6258, 77.3649, 'Noida', true),
('ncr-03', 'Vasundhara, Ghaziabad', 28.6603, 77.3572, 'Ghaziabad', true),
('ncr-04', 'Sector 16A, Faridabad', 28.4089, 77.3178, 'Faridabad', true)
ON CONFLICT (id) DO NOTHING;

-- Insert Official CPCB Health Advisories
INSERT INTO health_advice (id, aqi_category, range, color, general, children, elderly, outdoor_workers, recommended_mask, air_purifier_needed) VALUES
('ha-01', 'Good', '0–50', '#10b981', 'Air quality is considered satisfactory, and air pollution poses little or no risk.', 'Perfect conditions for outdoor sports, exercise, and playtime.', 'Safe for regular outdoor walks and physical activities without restriction.', 'Normal working conditions without additional respiratory protection required.', 'None needed', false),
('ha-02', 'Satisfactory', '51–100', '#22c55e', 'Minor breathing discomfort to sensitive individuals.', 'Safe for outdoor sports, keep hydrated.', 'Safe for walks, sensitive persons should monitor any unusual chest tightness.', 'Safe for standard working hours outdoors.', 'Optional for sensitive individuals', false),
('ha-03', 'Moderate', '101–200', '#f59e0b', 'Breathing discomfort to the people with lungs, asthma and heart diseases.', 'Reduce strenuous outdoor activities during afternoon peak sunlight.', 'Take frequent breaks during outdoor walks; keep inhalers handy if prescribed.', 'Consider taking scheduled indoor rest breaks.', 'Cloth mask or surgical mask if sensitive', false),
('ha-04', 'Poor', '201–300', '#f97316', 'Breathing discomfort to most people on prolonged exposure. May cause throat irritation.', 'Avoid intense outdoor athletics, jogging, and playground time in morning/evening.', 'Limit morning walks before sunrise. Stay indoors in well-ventilated rooms.', 'Wear certified N95 / FFP2 masks and rotate work shifts away from heavy traffic zones.', 'N95 / FFP2 Respirator', true),
('ha-05', 'Very Poor', '301–400', '#f43f5e', 'Respiratory illness on prolonged exposure. Significant trigger for cardiac and pulmonary distress.', 'Keep windows closed. Suspend outdoor school activities and sports.', 'Remain indoors. Use HEPA air purifiers; consult doctor immediately if wheezing occurs.', 'Strictly mandate N95 masks. Curtail non-essential outdoor physical exertion.', 'N95 / N99 mask mandatory', true),
('ha-06', 'Severe', '401–500+', '#8b5cf6', 'Affects healthy people and seriously impacts those with existing diseases. Public health emergency condition.', 'Absolute indoor confinement. Avoid running and heavy breathing indoors as well.', 'Emergency tier: Stay in sealed room with HEPA filtration. Continuous health monitoring.', 'Halt manual outdoor labor if possible, or mandate continuous powered/sealed respirators.', 'N99 / P100 respirator', true)
ON CONFLICT (id) DO NOTHING;
