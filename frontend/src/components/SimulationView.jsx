import React, { useState } from 'react';
import { Sliders, RotateCcw, AlertTriangle, CheckCircle2, CloudRain } from 'lucide-react';

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
      <div className="p-6 rounded-2xl bg-[#11141c] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1a2030] border border-white/[0.08] flex items-center justify-center text-slate-300">
            <Sliders className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">
              Judges' Live Simulation Lab
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dynamically manipulate Pune microclimate variables to observe real-time FAO-56 Penman-Monteith AI overrides.
            </p>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => applyPreset(24, 92, 18, 25.0, 95)}
            className="px-2.5 py-1.5 rounded-lg bg-[#1a2030] border border-white/[0.08] hover:border-white/[0.18] text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Heavy monsoon (25mm)
          </button>
          <button
            onClick={() => applyPreset(39, 28, 12, 0.0, 5)}
            className="px-2.5 py-1.5 rounded-lg bg-[#1a2030] border border-white/[0.08] hover:border-white/[0.18] text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Peak summer (39°C)
          </button>
          <button
            onClick={() => applyPreset(27, 65, 8, 1.2, 35)}
            className="px-2.5 py-1.5 rounded-lg bg-[#1a2030] border border-white/[0.08] hover:border-white/[0.18] text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Light drizzle (1.2mm)
          </button>
        </div>
      </div>

      {/* Main Grid: Left Controls + Right Real-Time Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Sliders (Span 6) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#11141c] border border-white/[0.08] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2 text-white font-medium text-sm">
              <span>Microclimate parameter sliders</span>
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
              <span className="text-slate-400">Ambient temperature</span>
              <span className="font-mono text-white tabular-nums">{temp}°C</span>
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
              <span className="text-slate-400">Relative humidity</span>
              <span className="font-mono text-white tabular-nums">{humidity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Forecast Rain Volume */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Forecast precipitation volume</span>
              <span className="font-mono text-white tabular-nums">{rainMm.toFixed(1)} mm</span>
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
              <span className="text-slate-400">Rain probability</span>
              <span className="font-mono text-white tabular-nums">{rainProb}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={rainProb}
              onChange={(e) => setRainProb(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Run Simulation Action Button */}
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-white text-[#0b0d14] hover:bg-slate-200 font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Evaluating FAO-56 Engine...' : 'Run real-time simulation'}</span>
          </button>
        </div>

        {/* Right Column: AI Output & Decision Comparison (Span 6) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#11141c] border border-white/[0.08] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2 text-white font-medium text-sm">
              <CloudRain className="w-4 h-4 text-slate-400" />
              <span>AI Decision & Municipal Impact</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Open-Meteo Synced</span>
          </div>

          {simResults ? (
            <div className="space-y-4">
              {/* Decision Badge */}
              <div className={`p-4 rounded-xl border ${
                simResults.decision === 'OVERRIDE_HALT' 
                  ? 'bg-[#e5484d]/10 border-[#e5484d]/25 text-[#ff8585]'
                  : 'bg-[#4cc38a]/10 border-[#4cc38a]/25 text-[#4cc38a]'
              }`}>
                <div className="flex items-center gap-2 font-medium text-xs">
                  {simResults.decision === 'OVERRIDE_HALT' ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-[#e5484d]" />
                      <span>DECISION: EMERGENCY OVERRIDE (HALT ALL PUMPS)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#4cc38a]" />
                      <span>DECISION: SCHEDULE CONFIRMED (PUMP REQUIRED)</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {simResults.explanation}
                </p>
              </div>

              {/* 4 Metric Impact Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-lg bg-[#1a2030]/60 border border-white/[0.06]">
                  <span className="text-slate-400 text-[11px] block">Simulated water saved</span>
                  <span className="text-base font-medium text-white tabular-nums font-mono">
                    {simResults.totalLitersSaved.toLocaleString()} L
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#1a2030]/60 border border-white/[0.06]">
                  <span className="text-slate-400 text-[11px] block">Grid power conserved</span>
                  <span className="text-base font-medium text-amber-300 tabular-nums font-mono">
                    {simResults.totalKwhSaved} kWh
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#1a2030]/60 border border-white/[0.06]">
                  <span className="text-slate-400 text-[11px] block">PMC budget saved</span>
                  <span className="text-base font-medium text-[#4cc38a] tabular-nums font-mono">
                    ₹ {simResults.totalInrSaved.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#1a2030]/60 border border-white/[0.06]">
                  <span className="text-slate-400 text-[11px] block">Calculated FAO-56 ET₀</span>
                  <span className="text-base font-medium text-slate-200 tabular-nums font-mono">
                    {simResults.simulatedEt0} mm/day
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
              <div className="w-12 h-12 rounded-lg bg-[#1a2030] border border-white/[0.08] flex items-center justify-center text-slate-400">
                <Sliders className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-medium text-white">Simulation Engine Ready</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Select a preset or move the sliders on the left, then click <strong>Run real-time simulation</strong> to observe how AquaSync dynamically predicts soil moisture and halts municipal sprinklers.
              </p>
            </div>
          )}

          {/* Methodology Footer */}
          <div className="p-2.5 rounded-lg bg-[#1a2030]/60 border border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Standard: FAO-56 Penman-Monteith</span>
            <span>Pune Tariffs: ₹32/kL • ₹6.50/kWh</span>
          </div>
        </div>
      </div>
    </div>
  );
}
