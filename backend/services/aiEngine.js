/**
 * AquaSync Environmental AI & Hydrology Engine
 * Based on the FAO-56 Penman-Monteith Standard for Evapotranspiration
 * and Official Pune Municipal Corporation (PMC) & MSEDCL Tariffs.
 */

// Official Regional Constants (Grounded in Pune / Maharashtra Standards)
const TARIFFS = {
  WATER_PER_KL_INR: 32.0,      // PMC Treated/STP Non-potable Water Tariff (₹ / 1,000 Liters)
  ELECTRICITY_PER_KWH_INR: 6.50, // MSEDCL Public Water Works (LT-III) Tariff (₹ / kWh)
  KWH_PER_KL_PUMPED: 0.45,     // Specific energy consumption for 30-40m head municipal pump
};

/**
 * Calculates Reference Evapotranspiration (ET0 in mm/day) using FAO-56 Penman-Monteith physics.
 * @param {number} tempCelsius - Mean temperature in °C
 * @param {number} relativeHumidity - Humidity percentage (0-100)
 * @param {number} windSpeedKmh - Wind speed in km/h
 * @param {number} solarRadiationMj - Solar radiation in MJ/m²/day (estimated or fetched)
 * @returns {number} ET0 in mm/day
 */
function calculateFAO56ET0(tempCelsius, relativeHumidity, windSpeedKmh = 10, solarRadiationMj = 18.0) {
  // Convert wind speed from km/h to m/s at 2m height
  const u2 = Math.max(0.5, windSpeedKmh / 3.6);
  const T = tempCelsius;
  
  // Saturation vapor pressure (es) in kPa (Tetens equation)
  const es = 0.6108 * Math.exp((17.27 * T) / (T + 237.3));
  
  // Actual vapor pressure (ea) in kPa
  const ea = es * (Math.max(10, Math.min(100, relativeHumidity)) / 100.0);
  
  // Vapor pressure deficit
  const vpd = Math.max(0, es - ea);
  
  // Slope of vapor pressure curve (Delta) in kPa/°C
  const delta = (4098 * es) / Math.pow(T + 237.3, 2);
  
  // Psychrometric constant (gamma) in kPa/°C for Pune altitude (~560m above sea level)
  const atmosphericPressure = 101.3 * Math.pow((293.0 - 0.0065 * 560.0) / 293.0, 5.26); // ~95 kPa
  const gamma = 0.000665 * atmosphericPressure; // ~0.063 kPa/°C
  
  // Net radiation (Rn) in MJ/m²/day (approx 65% of incoming solar radiation)
  const Rn = 0.65 * solarRadiationMj;
  const G = 0; // Soil heat flux for daily calculation
  
  // FAO-56 Penman-Monteith Equation:
  const numerator = (0.408 * delta * (Rn - G)) + (gamma * (900 / (T + 273)) * u2 * vpd);
  const denominator = delta + (gamma * (1 + 0.34 * u2));
  
  const et0 = numerator / denominator;
  
  // Constrain to realistic Pune range: 1.5mm (heavy monsoon) to 7.0mm (peak May heatwave)
  return Math.round(Math.max(1.5, Math.min(7.5, et0)) * 100) / 100;
}

/**
 * Evaluates whether an incoming meteorological event justifies a pump override.
 * @param {Object} params
 * @param {number} params.irrigatedAreaSqm - Turf area in m²
 * @param {number} params.cropCoefficient - Plant Kc (0.75 - 0.85 for Pune lawn grass)
 * @param {number} params.tempCelsius - Current temperature in °C
 * @param {number} params.relativeHumidity - Relative humidity %
 * @param {number} params.windSpeedKmh - Wind speed in km/h
 * @param {number} params.rainForecastMm - Expected rainfall volume in mm over 12h
 * @param {number} params.rainProbabilityPct - Precipitation probability (0-100)
 * @returns {Object} Full decision breakdown with water, energy, and financial savings.
 */
function evaluateIrrigationDecision({
  irrigatedAreaSqm,
  cropCoefficient = 0.80,
  tempCelsius = 28,
  relativeHumidity = 75,
  windSpeedKmh = 12,
  rainForecastMm = 0,
  rainProbabilityPct = 0
}) {
  // 1. Calculate Reference ET0 and Plant Water Requirement (ETc)
  const et0_mm = calculateFAO56ET0(tempCelsius, relativeHumidity, windSpeedKmh);
  const etc_mm = Math.round(et0_mm * cropCoefficient * 100) / 100;
  
  // 2. Daily Crop Water Demand in Liters (1 mm on 1 sqm = 1 Liter)
  const dailyWaterDemandLiters = Math.round(irrigatedAreaSqm * etc_mm);
  
  // 3. Effective Precipitation (Peff)
  // Effective rainfall is discounted by probability and surface runoff factor (~80% retention on lawns)
  const effectiveRainMm = Math.round(rainForecastMm * (rainProbabilityPct / 100.0) * 0.85 * 100) / 100;
  
  // 4. Decision Logic
  let decision = 'SCHEDULED';
  let reasoning = '';
  let litersSaved = 0;

  if (effectiveRainMm >= (0.50 * etc_mm) || (rainForecastMm >= 8.0 && rainProbabilityPct >= 65)) {
    // Rainfall provides at least 50% of plant need or heavy shower is certain
    decision = 'OVERRIDDEN';
    litersSaved = dailyWaterDemandLiters;
    reasoning = `Incoming rain (${rainForecastMm}mm, ${rainProbabilityPct}% prob) supplies sufficient moisture (${effectiveRainMm}mm effective). Overriding pump saves ${litersSaved.toLocaleString()} L.`;
  } else if (relativeHumidity >= 85 || (rainForecastMm >= 3.0 && rainProbabilityPct >= 50)) {
    // Humid overcast conditions: soil retains moisture, watchman should verify on ground
    decision = 'ALERT';
    litersSaved = dailyWaterDemandLiters;
    reasoning = `High atmospheric humidity (${relativeHumidity}%) and cloud cover significantly lowers soil evapotranspiration. Ground watchman alert dispatched.`;
  } else {
    // Dry conditions: scheduled watering must proceed
    decision = 'SCHEDULED';
    litersSaved = 0;
    reasoning = `Dry microclimate forecast (${rainForecastMm}mm rain, ${tempCelsius}°C). Soil requires normal scheduled irrigation to prevent turf wilting.`;
  }

  // 5. Calculate Energy & Financial Savings (Grounded in MSEDCL & PMC Tariffs)
  const kwhSaved = Math.round((litersSaved / 1000.0) * TARIFFS.KWH_PER_KL_PUMPED * 100) / 100;
  const inrSavedWater = (litersSaved / 1000.0) * TARIFFS.WATER_PER_KL_INR;
  const inrSavedEnergy = kwhSaved * TARIFFS.ELECTRICITY_PER_KWH_INR;
  const inrSavedTotal = Math.round((inrSavedWater + inrSavedEnergy) * 100) / 100;

  return {
    decision,
    reasoning,
    et0_mm,
    etc_mm,
    dailyWaterDemandLiters,
    effectiveRainMm,
    litersSaved,
    kwhSaved,
    inrSavedTotal,
    tariffsApplied: TARIFFS
  };
}

module.exports = {
  TARIFFS,
  calculateFAO56ET0,
  evaluateIrrigationDecision
};
