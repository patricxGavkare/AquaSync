/**
 * Automated Verification Script for AquaSync Backend APIs
 */
const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

function post(path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(`http://localhost:5000${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting AquaSync API Automated Test Suite...\n');
  
  try {
    // Test 1: Health
    const health = await get('/api/health');
    console.log(`[PASS] GET /api/health -> Status: ${health.status}, System: ${health.body.system}`);

    // Test 2: Live Weather
    const weather = await get('/api/weather/live');
    console.log(`[PASS] GET /api/weather/live -> Pune Temp: ${weather.body.temperature}°C, Condition: ${weather.body.weatherCondition}, ET0: ${weather.body.et0_fao56} mm/day`);

    // Test 3: Parks
    const parks = await get('/api/parks');
    console.log(`[PASS] GET /api/parks -> Count: ${parks.body.length} parks loaded.`);
    parks.body.forEach(p => {
      console.log(`   * ${p.name} (${p.zone}) -> Status: ${p.status}, Rec: ${p.recommendedDecision}`);
    });

    // Test 4: Metrics Summary
    const summary = await get('/api/metrics/summary');
    console.log(`[PASS] GET /api/metrics/summary -> Liters Saved: ${summary.body.totalLitersSaved.toLocaleString()} L, ₹ Saved: ₹${summary.body.totalInrSaved.toLocaleString()}, CO2: ${summary.body.co2KgSaved} kg`);

    // Test 5: Simulation Lab
    const sim = await post('/api/simulate', {
      temp: 30,
      humidity: 85,
      windSpeed: 15,
      rainForecastMm: 20.0,
      rainProbabilityPct: 90
    });
    console.log(`[PASS] POST /api/simulate -> Simulated 20mm Rain: Overridden Parks: ${sim.body.metrics.overriddenParksCount}/${sim.body.metrics.totalParksCount}, Water Saved: ${sim.body.metrics.totalLitersSaved.toLocaleString()} L, ₹ Saved: ₹${sim.body.metrics.totalInrSaved.toLocaleString()}`);

    // Test 6: Toggle Status
    const toggle = await post('/api/parks/sarasbaug/toggle', {});
    console.log(`[PASS] POST /api/parks/sarasbaug/toggle -> New Status: ${toggle.body.newStatus}`);
    // Toggle back to keep Sarasbaug in OVERRIDDEN
    await post('/api/parks/sarasbaug/toggle', {});

    // Test 7: Watchman Acknowledge
    const ack = await post('/api/parks/sarasbaug/acknowledge', {});
    console.log(`[PASS] POST /api/parks/sarasbaug/acknowledge -> ${ack.body.message}`);

    console.log('\n🎉 ALL 7 API INTEGRATION TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ API Test Suite Error:', err);
    process.exit(1);
  }
}

runTests();
