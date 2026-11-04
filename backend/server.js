const express = require('express');
const cors = require('cors');
const path = require('node:path');
const fs = require('node:fs');
const db = require('./database');
const { fetchPuneWeather, PUNE_COORDINATES } = require('./services/weatherService');
const { calculateFAO56ET0, evaluateIrrigationDecision, TARIFFS } = require('./services/aiEngine');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'AquaSync AI Predictive Municipal Irrigation Controller',
    version: '1.0.0',
    targetCity: 'Pune & PCMC',
    timestamp: new Date().toISOString()
  });
});

// 2. Live Pune Weather Feed
app.get('/api/weather/live', async (req, res) => {
  try {
    const weather = await fetchPuneWeather();
    const et0 = calculateFAO56ET0(weather.temperature, weather.humidity, weather.windSpeed);
    res.json({
      ...weather,
      et0_fao56: et0,
      coordinates: PUNE_COORDINATES
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get All Parks (With dynamically calculated AI states)
app.get('/api/parks', async (req, res) => {
  try {
    const weather = await fetchPuneWeather();
    const stmt = db.prepare('SELECT * FROM parks ORDER BY total_area_sqm DESC');
    const parks = stmt.all();

    // Map each park with dynamic AI status evaluation
    const enrichedParks = parks.map(park => {
      const evaluation = evaluateIrrigationDecision({
        irrigatedAreaSqm: park.irrigated_area_sqm,
        cropCoefficient: park.crop_coefficient,
        tempCelsius: weather.temperature,
        relativeHumidity: weather.humidity,
        windSpeedKmh: weather.windSpeed,
        rainForecastMm: park.rain_expected_mm,
        rainProbabilityPct: weather.next12HoursRainProb
      });

      return {
        ...park,
        currentEt0: evaluation.et0_mm,
        currentEtc: evaluation.etc_mm,
        recommendedDecision: evaluation.decision,
        reasoning: evaluation.reasoning,
        tariffs: TARIFFS
      };
    });

    res.json(enrichedParks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Toggle Park Irrigation / Override
app.post('/api/parks/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;
    const park = db.prepare('SELECT * FROM parks WHERE id = ?').get(id);

    if (!park) {
      return res.status(404).json({ error: 'Park not found' });
    }

    const newStatus = park.status === 'OVERRIDDEN' ? 'SCHEDULED' : 'OVERRIDDEN';
    let newLitersSaved = park.liters_saved_today;
    let newKwhSaved = park.kwh_saved_today;
    let newInrSaved = park.inr_saved_today;

    if (newStatus === 'OVERRIDDEN') {
      newLitersSaved = park.water_need_liters;
      newKwhSaved = Math.round((newLitersSaved / 1000.0) * TARIFFS.KWH_PER_KL_PUMPED * 100) / 100;
      newInrSaved = Math.round(((newLitersSaved / 1000.0) * TARIFFS.WATER_PER_KL_INR + newKwhSaved * TARIFFS.ELECTRICITY_PER_KWH_INR) * 100) / 100;
    } else {
      newLitersSaved = 0;
      newKwhSaved = 0;
      newInrSaved = 0;
    }

    db.prepare(`
      UPDATE parks 
      SET status = ?, liters_saved_today = ?, kwh_saved_today = ?, inr_saved_today = ?, updated_at = ?
      WHERE id = ?
    `).run(newStatus, newLitersSaved, newKwhSaved, newInrSaved, new Date().toISOString(), id);

    // Record in Audit Log
    db.prepare(`
      INSERT INTO audit_logs (timestamp, park_id, park_name, event_type, description, liters_saved, kwh_saved, inr_saved, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      new Date().toISOString(),
      park.id,
      park.name,
      'STATUS_TOGGLE',
      `Pump state manually changed to ${newStatus}. Liters saved: ${newLitersSaved.toLocaleString()} L.`,
      newLitersSaved,
      newKwhSaved,
      newInrSaved,
      'Command Dashboard Action'
    );

    res.json({
      success: true,
      parkId: id,
      newStatus,
      litersSaved: newLitersSaved,
      inrSaved: newInrSaved
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Watchman Acknowledge Alert (Human-in-the-Loop)
app.post('/api/parks/:id/acknowledge', (req, res) => {
  try {
    const { id } = req.params;
    const park = db.prepare('SELECT * FROM parks WHERE id = ?').get(id);

    if (!park) {
      return res.status(404).json({ error: 'Park not found' });
    }

    db.prepare(`
      UPDATE parks 
      SET watchman_acknowledged = 1, updated_at = ?
      WHERE id = ?
    `).run(new Date().toISOString(), id);

    db.prepare(`
      INSERT INTO audit_logs (timestamp, park_id, park_name, event_type, description, source)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      new Date().toISOString(),
      park.id,
      park.name,
      'WATCHMAN_CONFIRMATION',
      `Ground watchman ${park.watchman_name} acknowledged pump shutoff alert via mobile interface.`,
      'Mobile Staff Interface'
    );

    res.json({
      success: true,
      message: 'Watchman acknowledged pump status',
      acknowledged: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Hackathon Judges' Simulation Engine
app.post('/api/simulate', async (req, res) => {
  try {
    const {
      temp = 28,
      humidity = 80,
      windSpeed = 12,
      rainForecastMm = 15.0,
      rainProbabilityPct = 85
    } = req.body;

    const parks = db.prepare('SELECT * FROM parks').all();

    let totalLitersSaved = 0;
    let totalKwhSaved = 0;
    let totalInrSaved = 0;
    let overriddenCount = 0;

    const simulatedParks = parks.map(park => {
      const result = evaluateIrrigationDecision({
        irrigatedAreaSqm: park.irrigated_area_sqm,
        cropCoefficient: park.crop_coefficient,
        tempCelsius: Number(temp),
        relativeHumidity: Number(humidity),
        windSpeedKmh: Number(windSpeed),
        rainForecastMm: Number(rainForecastMm),
        rainProbabilityPct: Number(rainProbabilityPct)
      });

      if (result.decision === 'OVERRIDDEN' || result.decision === 'ALERT') {
        totalLitersSaved += result.litersSaved;
        totalKwhSaved += result.kwhSaved;
        totalInrSaved += result.inrSavedTotal;
        overriddenCount++;
      }

      return {
        id: park.id,
        name: park.name,
        zone: park.zone,
        simulatedDecision: result.decision,
        reasoning: result.reasoning,
        litersSaved: result.litersSaved,
        kwhSaved: result.kwhSaved,
        inrSaved: result.inrSavedTotal
      };
    });

    const co2ReductionKg = Math.round(totalKwhSaved * 0.82 * 100) / 100; // ~0.82 kg CO2 per grid kWh in Maharashtra

    res.json({
      simulationInputs: { temp, humidity, windSpeed, rainForecastMm, rainProbabilityPct },
      et0_calculated: calculateFAO56ET0(Number(temp), Number(humidity), Number(windSpeed)),
      metrics: {
        totalLitersSaved: Math.round(totalLitersSaved),
        totalKwhSaved: Math.round(totalKwhSaved * 100) / 100,
        totalInrSaved: Math.round(totalInrSaved * 100) / 100,
        co2ReductionKg: co2ReductionKg,
        overriddenParksCount: overriddenCount,
        totalParksCount: parks.length
      },
      parks: simulatedParks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Municipal Metrics Summary (Executive Counters)
app.get('/api/metrics/summary', async (req, res) => {
  try {
    const parks = db.prepare('SELECT * FROM parks').all();
    
    let totalLitersSaved = 0;
    let totalKwhSaved = 0;
    let totalInrSaved = 0;
    let activeOverridesCount = 0;

    parks.forEach(p => {
      totalLitersSaved += p.liters_saved_today;
      totalKwhSaved += p.kwh_saved_today;
      totalInrSaved += p.inr_saved_today;
      if (p.status === 'OVERRIDDEN' || p.status === 'ALERT') {
        activeOverridesCount++;
      }
    });

    const co2KgSaved = Math.round(totalKwhSaved * 0.82 * 100) / 100;

    res.json({
      totalLitersSaved: Math.round(totalLitersSaved),
      totalKwhSaved: Math.round(totalKwhSaved * 100) / 100,
      totalInrSaved: Math.round(totalInrSaved * 100) / 100,
      co2KgSaved,
      activeOverridesCount,
      totalParksCount: parks.length,
      tariffs: TARIFFS,
      city: 'Pune & PCMC'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Hourly Analytics for the Spline Area Chart
app.get('/api/analytics/hourly', async (req, res) => {
  try {
    const weather = await fetchPuneWeather();
    
    // Generate 7 time points for the glowing curve matching user's reference mockup
    const points = [
      { time: '6 AM', temp: 22, et0: 1.8, rainfall: 4.5, waterSaved: 120000, activeDecision: 'OVERRIDE' },
      { time: '9 AM', temp: 25, et0: 2.4, rainfall: 8.2, waterSaved: 175000, activeDecision: 'OVERRIDE' },
      { time: '12 PM', temp: 29, et0: 4.1, rainfall: 14.2, waterSaved: 246500, activeDecision: 'OVERRIDE' },
      { time: '3 PM', temp: 28, et0: 3.8, rainfall: 6.0, waterSaved: 190000, activeDecision: 'OVERRIDE' },
      { time: '6 PM', temp: 26, et0: 2.2, rainfall: 2.1, waterSaved: 140000, activeDecision: 'ALERT' },
      { time: '9 PM', temp: 24, et0: 1.2, rainfall: 0.5, waterSaved: 75000, activeDecision: 'SCHEDULED' },
      { time: '12 AM', temp: 23, et0: 0.8, rainfall: 0.0, waterSaved: 0, activeDecision: 'SCHEDULED' }
    ];

    res.json({
      city: 'Pune',
      timeline: points,
      legend: {
        et0: 'Evapotranspiration (mm/day)',
        rainfall: 'Forecast Precipitation (mm)',
        waterSaved: 'Liters Conserved (L)'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Add Park (Future Scope Endpoint)
app.post('/api/parks', (req, res) => {
  try {
    const { name, zone, latitude, longitude, totalAreaSqm, irrigatedAreaSqm, watchmanName, watchmanPhone } = req.body;
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const waterNeed = Math.round(Number(irrigatedAreaSqm) * 3.5);

    db.prepare(`
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
    `).run(
      id,
      name,
      zone || 'Pune Municipal Zone',
      Number(latitude) || 18.5204,
      Number(longitude) || 73.8567,
      Number(totalAreaSqm) || 20000,
      Number(irrigatedAreaSqm) || 15000,
      0.80,
      25000,
      'Black Cotton Loam',
      60.0,
      'SCHEDULED',
      '06:00 AM',
      0.0,
      waterNeed,
      0,
      0,
      0,
      watchmanName || 'Municipal Staff',
      watchmanPhone || '+91 98000 00000',
      0,
      new Date().toISOString()
    );

    res.json({ success: true, parkId: id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. Serve Built Frontend (Single-command full stack deployment)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(frontendDistPath, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`🚀 AquaSync Full-Stack System running on http://localhost:${PORT}`);
});
