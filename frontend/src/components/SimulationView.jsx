import React, { useState } from 'react';
import { Sparkles, Sliders, Droplet, Zap, IndianRupee, RotateCcw, AlertTriangle, CheckCircle2, CloudRain } from 'lucide-react';

export default function SimulationView({ onSimulationApplied }) {
  const [temp, setTemp] = useState(28);
  const [humidity, setHumidity] = useState(82);
  const [wind, setWind] = useState(14);
  const [rainMm, setRainMm] = useState(15.0);
  const [rainProb, setRainProb] = useState(85);
  const [simResults, setSimResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temp,
          humidity,
          windSpeed: wind,
          rainForecastMm: rainMm,
          rainProbabilityPct: rainProb
        })
      });
      const data = await res.json();
      setSimResults(data);
      if (onSimulationApplied) onSimulationApplied();
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (presetTemp, presetHum, presetWind, presetRain, presetProb) => {
    setTemp(presetTemp);
    setHumidity(presetHum);
    setWind(presetWind);
    setRainMm(presetRain);
    setRainProb(presetProb);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-[#1c2230] border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Hackathon Judges' Live Simulation Lab
            </h2>
            <p className="text-sm text-slate-300 mt-0.5">
              Dynamically manipulate Pune microclimate variables to observe real-time FAO-56 Penman-Monteith AI overrides.
            </p>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => applyPreset(24, 92, 18, 25.0, 95)}
            className="px-3 py-1.5 rounded-xl bg-blue-950/70 border border-blue-700/60 hover:bg-blue-900 text-blue-200 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            🌧️ Heavy Monsoon (25mm)
          </button>
          <button
            onClick={() => applyPreset(39, 28, 12, 0.0, 5)}
            className="px-3 py-1.5 rounded-xl bg-amber-950/70 border border-amber-700/60 hover:bg-amber-900 text-amber-200 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            ☀️ Peak Summer (39°C)
          </button>
          <button
            onClick={() => applyPreset(27, 65, 8, 1.2, 35)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            🌦️ Light Drizzle (1.2mm)
          </button>
        </div>
      </div>

      {/* Main Grid: Left Controls + Right Real-Time Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Sliders (Span 6) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#1c2230] border border-[#262c3d] flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Sliders className="w-5 h-5 text-blue-400" />
              <span>Microclimate Parameter Sliders</span>
            </div>
            <button
              onClick={() => applyPreset(28, 82, 14, 15.0, 85)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Ambient Temperature</span>
              <span className="font-bold text-white text-sm">{temp}°C</span>
            </div>
            <input
              type="range"
              min="15"
              max="45"
              value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Humidity Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Relative Humidity</span>
              <span className="font-bold text-white text-sm">{humidity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Forecast Rain Volume */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Forecast Precipitation Volume</span>
              <span className="font-bold text-white text-sm">{rainMm.toFixed(1)} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={rainMm}
              onChange={(e) => setRainMm(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Rain Probability */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Rain Probability</span>
              <span className="font-bold text-white text-sm">{rainProb}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={rainProb}
              onChange={(e) => setRainProb(Number(e.target.value))}
              className="w-full accent-indigo-400 cursor-pointer"
            />
          </div>

          {/* Run Simulation Action Button */}
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{loading ? 'Evaluating FAO-56 Engine...' : 'Run Real-Time AI Simulation'}</span>
          </button>
        </div>

        {/* Right Column: AI Output & Decision Comparison (Span 6) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#1c2230] border border-[#262c3d] flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <CloudRain className="w-5 h-5 text-cyan-400" />
              <span>AI Decision & Municipal Impact</span>
            </div>
            <span className="text-xs text-emerald-400 font-medium">Open-Meteo Synced</span>
          </div>

          {simResults ? (
            <div className="space-y-4">
              {/* Decision Badge */}
              <div className={`p-4 rounded-2xl border ${
                simResults.decision === 'OVERRIDE_HALT' 
                  ? 'bg-rose-950/40 border-rose-600/60 text-rose-200'
                  : 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {simResults.decision === 'OVERRIDE_HALT' ? (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                      <span>AI DECISION: EMERGENCY OVERRIDE (HALT ALL PUMPS)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>AI DECISION: SCHEDULE CONFIRMED (PUMP REQUIRED)</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {simResults.explanation}
                </p>
              </div>

              {/* 4 Metric Impact Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#151923] border border-[#283144]">
                  <span className="text-slate-400 text-xs block">Simulated Water Saved</span>
                  <span className="text-lg font-bold text-cyan-400">
                    {simResults.totalLitersSaved.toLocaleString()} L
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#151923] border border-[#283144]">
                  <span className="text-slate-400 text-xs block">Grid Power Conserved</span>
                  <span className="text-lg font-bold text-amber-400">
                    {simResults.totalKwhSaved} kWh
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#151923] border border-[#283144]">
                  <span className="text-slate-400 text-xs block">PMC Budget Saved</span>
                  <span className="text-lg font-bold text-emerald-400">
                    ₹ {simResults.totalInrSaved.toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#151923] border border-[#283144]">
                  <span className="text-slate-400 text-xs block">Calculated FAO-56 ET₀</span>
                  <span className="text-lg font-bold text-indigo-300">
                    {simResults.simulatedEt0} mm/day
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#151923] border border-[#283144] flex items-center justify-center text-blue-400">
                <Sliders className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">Simulation Engine Ready</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Select a preset or move the sliders on the left, then click <strong>Run Real-Time AI Simulation</strong> to observe how AquaSync dynamically predicts soil moisture and halts municipal sprinklers.
              </p>
            </div>
          )}

          {/* Methodology Footer */}
          <div className="p-3 rounded-2xl bg-[#151923] border border-[#283144] text-[11px] text-slate-400 flex items-center justify-between">
            <span>Standard: FAO-56 Penman-Monteith</span>
            <span>Pune Tariffs: ₹32/kL • ₹6.50/kWh</span>
          </div>
        </div>
      </div>
    </div>
  );
}