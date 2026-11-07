# 🌊 AquaSync: AI-Driven Predictive Municipal Irrigation Control

> **PCCOE International Grand Challenge 2026 (Indradhanu 2nd Edition)**  
> **Theme:** AI for Climate Change & Urban Sustainability  
> **Domain:** Smart Cities, Energy & Circular Economy  
> **Developed by:** Pratik Gavkare & Team | B.Tech CSE (AIML)  
> **GitHub Repository:** [https://github.com/patricxGavkare/AquaSync.git](https://github.com/patricxGavkare/AquaSync.git)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v24.18-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-brightgreen.svg)](https://leafletjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-node:sqlite-003B57.svg)](https://sqlite.org/)
[![Design System](https://img.shields.io/badge/Design%20System-Unslop%20Craft-black.svg)](https://github.com/heydamir/unslop)

---

## 📸 Interface Previews

### 1. Executive Dashboard (Unslop Craft & Photographic Telemetry)
![AquaSync Dashboard Overview](docs/preview.png)

### 2. Pune Regional Geospatial Relay Mesh (Interactive Leaflet GIS)
![AquaSync Pune Geospatial Map](docs/map_preview.png)

### 3. Judges' Live Simulation Lab (FAO-56 Parameter Testing)
![AquaSync Simulation Lab](docs/simulation_preview.png)

---

## 📌 Executive Summary

Municipal corporations in cities like **Pune (PMC)** and **Pimpri-Chinchwad (PCMC)** waste millions of liters of purified treated water and megawatts of electrical pumping power by running automated park sprinklers on rigid mechanical timers, even right before or during heavy monsoon rain events.

**AquaSync** is a predictive, climate-responsive software bridge that integrates live satellite weather forecasts with the **FAO-56 Penman-Monteith Evapotranspiration standard**. It forecasts soil moisture needs 12 to 24 hours in advance and automatically overrides planned pump activations during rain events, converting dumb mechanical timers into intelligent, climate-resilient urban infrastructure.

---

## 🎨 Design Philosophy: The "Unslop" Engineering System

AquaSync implements the **Unslop design standard** (by Damir Sokolovsky) to eliminate AI-generated interface tropes (*gradient text, glowing background blur blobs, pulsing badges, and emoji labels*) in favor of a calm, technical municipal workstation:

1. **Ink Neutral Palette**: Standardized on `#0b0d14` (canvas), `#11141c` (cards), and `#1a2030` (raised controls) with subtle 8% white hairline borders (`border-white/[0.08]`).
2. **Tabular Numerals**: Enforced `.tabular-nums` and monospace fonts across all water volumes (L), electrical figures (kWh), and PMC financial tariffs (₹) to eliminate visual layout jitter.
3. **Quiet Status Indicators**: Solid 6px indicators (`#4cc38a` for scheduled irrigation, `#e5484d` for emergency halts) replacing flashing animations.
4. **Focused Richness**: Chrome is kept quiet so visual focus is directed toward authentic Pune landmark photography, crisp GIS cartography, and predictive spline curves.

---

## 🏛️ System Architecture

```
                 [ 🛰️ Satellite Weather Ingestion ]
            (Open-Meteo Live API: Pune 18.5204° N, 73.8567° E)
                                │
                                ▼
         [ 🧠 AI Predictive Moisture Engine (Regression) ]
           (FAO-56 Penman-Monteith Evapotranspiration ET0)
                                │
                                ▼
       [ ⚖️ Effective Precipitation Classifier (Decision Logic) ]
         (Compares: Forecast Rain Volume vs. Soil Absorption)
                                │
                                ▼
                [ 🚨 Decision & Actuation Engine ]
               /                                  \
              /                                    \
   [ Rain Incoming ]                        [ Dry Forecast ]
            │                                        │
            ▼                                        ▼
 🛑 OVERRIDE PUMP (OFF)                     ✅ RUN NORMAL SCHEDULE
 • Conserve Municipal Water                 • Prevent Turf Wilting
 • Conserve MSEDCL Grid Power
            │                                        │
            └───────────────────┬────────────────────┘
                                │
                                ▼
                [ 🖥️ Multi-Section Modular Hub ]
               /        |          |          \
              ▼         ▼          ▼           ▼
       [ Overview ]  [ Map ]  [ Forecast ]  [ Simulation & Analytics ]
```

---

## 🧭 5 Modular Navigation Views

1. **Dashboard (Overview)**: High-level command view with live Pune weather hero (24°C), 4 executive KPI cards, 3-column landmark park showcase with authentic photography, and quick map preview.
2. **Pune Regional Map**: Dedicated geospatial GIS view bounded strictly to Pune coordinates (`18.52° N, 73.85° E`). Features park relay selectors, dark view toggle, custom SVG pins, and auto-resizing Leaflet canvas.
3. **Microclimate Forecast**: 24-Hour hourly weather timeline and 7-day predictive outlook comparing rainfall probability against irrigation dispatch decisions.
4. **Judges' Simulation Lab**: Interactive test environment enabling judges to adjust temperature (15–45°C), humidity (20–100%), rain volume (0–50mm), and probability sliders to observe real-time FAO-56 decision overrides and savings recalculations.
5. **Water, Energy & Tariff Audit**: 24-Hour spline predictive curve and official PMC treated water (₹32/kL) / MSEDCL Commercial LT-III (₹6.50/kWh) financial ledger.

---

## 🔬 Mathematical Modeling & Regional Tariffs

### 1. FAO-56 Penman-Monteith Evapotranspiration ($ET_0$)
$$\Delta = \frac{4098 \cdot e_s}{(T + 237.3)^2}, \quad \gamma \approx 0.063 \text{ kPa/°C at Pune altitude (560m)}$$
$$ET_0 = \frac{0.408 \Delta (R_n - G) + \gamma \frac{900}{T + 273} u_2 (e_s - e_a)}{\Delta + \gamma (1 + 0.34 u_2)}$$
* **10m to 2m Wind Speed Profile**: $u_2 \approx 0.748 \times u_{10}$ (FAO-56 logarithmic profile).
* **Crop Water Demand ($ET_c$)**: $ET_c = ET_0 \times K_c$ ($K_c = 0.80$ for warm-season Bermuda turf grass).

### 2. Official Regional Tariffs (PMC & MSEDCL Grounded)
* **Water Supply Tariff**: **₹32.00 per 1,000 Liters (1 kL)** (Pune Municipal Corporation treated water distribution rate).
* **Pumping Power Consumption**: **0.45 kWh per 1,000 Liters** pumped (35m head municipal pump).
* **Electricity Tariff**: **₹6.50 per kWh** (MSEDCL Public Water Works LT-III rate).
* **Carbon Emission Factor**: **0.82 kg CO₂ / kWh** (CEA Maharashtra grid emission factor).

---

## 🌳 Demonstrated Pune Landmark Parks

| Park Name | Location | Irrigated Turf | Real-Time Scenario | Status |
|---|---|---|---|---|
| **Sarasbaug Municipal Garden** | Swargate (South Pune) | $50,000 \text{ m}^2$ | 14.2 mm Monsoon Rain Incoming | 🛑 **PUMPS HALTED (175,000 L Saved)** |
| **Chhatrapati Sambhaji Garden** | JM Road (Central Pune) | $25,000 \text{ m}^2$ | 0.8 mm Non-effective Drizzle | ✅ **SCHEDULED (87,500 L Demand)** |
| **Pu La Deshpande Japanese Garden** | Sinhagad Road (West Pune) | $22,000 \text{ m}^2$ | 85% Humidity / Cloud Cover | 🛑 **PUMPS HALTED (71,500 L Saved)** |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher; v24 recommended)
- **npm** (v9 or higher)

### Installation & Run (Single Command)
```bash
# 1. Clone repository
git clone https://github.com/patricxGavkare/AquaSync.git
cd AquaSync

# 2. Install backend dependencies
cd backend && npm install && cd ..

# 3. Start the unified Full-Stack server
npm start
```

Open your browser and navigate to:  
👉 **`http://localhost:5000`**

### Development Mode (With Hot Reloading)
```bash
# Terminal 1: Backend Express Server
npm run backend

# Terminal 2: Vite React Frontend
npm run frontend
```

---

## 🧪 Automated Testing
Run the comprehensive 7-point API test suite:
```bash
npm run test:api
```

---

## 📜 License
This project is open-source under the [MIT License](LICENSE).
