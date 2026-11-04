const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const dbPath = path.join(__dirname, 'aquasync.db');
const db = new DatabaseSync(dbPath);

// Enable foreign keys and WAL mode for optimal performance
db.exec('PRAGMA foreign_keys = ON;');

// 1. Parks Table (3 Landmark Pune Parks)
db.exec(`
  CREATE TABLE IF NOT EXISTS parks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    zone TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    total_area_sqm REAL NOT NULL,
    irrigated_area_sqm REAL NOT NULL,
    crop_coefficient REAL NOT NULL,
    pump_capacity_lph REAL NOT NULL,
    soil_type TEXT NOT NULL,
    soil_moisture_pct REAL NOT NULL,
    status TEXT NOT NULL,
    scheduled_time TEXT NOT NULL,
    rain_expected_mm REAL NOT NULL,
    water_need_liters REAL NOT NULL,
    liters_saved_today REAL NOT NULL,
    kwh_saved_today REAL NOT NULL,
    inr_saved_today REAL NOT NULL,
    watchman_name TEXT NOT NULL,
    watchman_phone TEXT NOT NULL,
    watchman_acknowledged INTEGER DEFAULT 0,
    updated_at TEXT NOT NULL
  );
`);

// 2. Weather Cache Table
db.exec(`
  CREATE TABLE IF NOT EXISTS weather_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature REAL,
    relative_humidity REAL,
    precipitation_prob REAL,
    precipitation_mm REAL,
    wind_speed REAL,
    solar_radiation REAL,
    et0_mm REAL,
    weather_condition TEXT,
    is_live INTEGER DEFAULT 1,
    fetched_at TEXT NOT NULL
  );
`);

// 3. Hourly Forecast Table (24h Window)
db.exec(`
  CREATE TABLE IF NOT EXISTS hourly_forecasts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hour_label TEXT NOT NULL,
    temperature REAL,
    humidity REAL,
    precipitation_prob REAL,
    precipitation_mm REAL,
    et0_mm REAL,
    water_demand_liters REAL,
    action_decision TEXT
  );
`);

// 4. Audit Log Table
db.exec(`
  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    park_id TEXT NOT NULL,
    park_name TEXT NOT NULL,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    liters_saved REAL DEFAULT 0,
    kwh_saved REAL DEFAULT 0,
    inr_saved REAL DEFAULT 0,
    source TEXT NOT NULL
  );
`);

// Seed Default 3 Landmark Parks if not already seeded
const existingParks = db.prepare('SELECT COUNT(*) as count FROM parks').get();

if (existingParks.count === 0) {
  const insertPark = db.prepare(`
    INSERT INTO parks (
      id, name, zone, latitude, longitude,
      total_area_sqm, irrigated_area_sqm, crop_coefficient, pump_capacity_lph,
      soil_type, soil_moisture_pct, status, scheduled_time, rain_expected_mm,
      water_need_liters, liters_saved_today, kwh_saved_today, inr_saved_today,
      watchman_name, watchman_phone, watchman_acknowledged, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  // Park 1: Sarasbaug (Swargate, South Pune) - 25 Acres total, ~50,000 sqm lawn.
  // Scenario: Heavy Rain Forecast (14.2mm) -> AI Overrides Pump! 100% water saved.
  insertPark.run(
    'sarasbaug',
    'Sarasbaug Municipal Garden',
    'Swargate (South Pune)',
    18.5008,
    73.8544,
    101170, // 25 acres
    50000,  // 50,000 sqm turf
    0.80,   // Bermuda lawn grass Kc
    35000,  // 35,000 L/hr pump
    'Clay Loam (High Retention)',
    78.5,
    'OVERRIDDEN',
    '06:00 AM',
    14.2,
    175000, // Water need
    175000, // Liters saved
    78.75,  // kWh saved (175 kL * 0.45)
    6111.88,// INR saved (175 * 32 + 78.75 * 6.50)
    'Pandurang More',
    '+91 98230 44120',
    1,
    new Date().toISOString()
  );

  // Park 2: Chhatrapati Sambhaji Garden (JM Road, Central Pune) - 11.8 Acres (~48,000 sqm), 25,000 sqm lawn.
  // Scenario: Minor Drizzle (0.8mm) -> Insufficient moisture -> Normal scheduled watering needed!
  insertPark.run(
    'sambhaji_garden',
    'Chhatrapati Sambhaji Garden',
    'JM Road (Central Pune)',
    18.5236,
    73.8478,
    48000, // 11.8 acres
    25000, // 25,000 sqm turf
    0.80,
    20000,
    'Sandy Loam (Fast Drainage)',
    44.2,
    'SCHEDULED',
    '06:30 AM',
    0.8,
    87500,
    0,
    0,
    0,
    'Dnyaneshwar Shinde',
    '+91 94220 18834',
    0,
    new Date().toISOString()
  );

  // Park 3: Pu La Deshpande Garden (Okayama Friendship Garden, Sinhagad Road) - 10 Acres (~40,470 sqm), 22,000 sqm landscape.
  // Scenario: Overcast with 88% humidity -> Watchman Alert Sent, awaiting acknowledgment.
  insertPark.run(
    'pula_deshpande',
    'Pu La Deshpande Japanese Garden',
    'Sinhagad Road (West Pune)',
    18.4947,
    73.8341,
    40470, // 10 acres
    22000, // 22,000 sqm sensitive landscape
    0.75,
    18000,
    'Silt Loam (Moderate)',
    65.0,
    'ALERT',
    '07:00 AM',
    6.4,
    71500,
    71500,
    32.18,
    2497.17,
    'Santosh Gaikwad',
    '+91 97654 32901',
    1,
    new Date().toISOString()
  );

  // Seed Initial Audit Logs
  const insertLog = db.prepare(`
    INSERT INTO audit_logs (timestamp, park_id, park_name, event_type, description, liters_saved, kwh_saved, inr_saved, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertLog.run(
    new Date(Date.now() - 3600000 * 2).toISOString(),
    'sarasbaug',
    'Sarasbaug Municipal Garden',
    'AI_OVERRIDE',
    'Predicted 14.2mm monsoon rain exceeds daily ETc demand (3.5mm). Irrigation pump halted for 12 hours.',
    175000,
    78.75,
    6111.88,
    'AquaSync Predictive Engine'
  );

  insertLog.run(
    new Date(Date.now() - 3600000).toISOString(),
    'pula_deshpande',
    'Pu La Deshpande Japanese Garden',
    'WATCHMAN_ACK',
    'Ground staff Santosh Gaikwad acknowledged morning pump pause via mobile alert.',
    71500,
    32.18,
    2497.17,
    'Watchman Mobile Interface'
  );

  console.log('AquaSync SQLite Database successfully seeded with 3 landmark Pune parks.');
}

module.exports = db;
