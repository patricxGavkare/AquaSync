import React, { useState } from 'react';
import { X, Sliders } from 'lucide-react';

export default function SimulationModal({ isOpen, onClose, onRunSimulation }) {
  const [temp, setTemp] = useState(28);
  const [humidity, setHumidity] = useState(82);
  const [wind, setWind] = useState(14);
  const [rainMm, setRainMm] = useState(15.0);
  const [rainProb, setRainProb] = useState(85);
  const [simResults, setSimResults] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#11141c] border border-white/[0.08] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0b0d14]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a2030] border border-white/[0.08] flex items-center justify-center text-slate-300">
              <Sliders className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white leading-tight">
                AI Microclimate Simulation Lab
              </h3>
              <p className="text-xs text-slate-400">
                Adjust microclimate variables to test dynamic FAO-56 AI overrides in real time
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-[#1a2030] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Quick Presets */}
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Quick test scenarios (Pune microclimates)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => applyPreset(26, 92, 18, 25.0, 95)}
                className="p-2.5 rounded-lg bg-[#1a2030] hover:bg-[#232b40] border border-white/[0.08] text-left transition-colors cursor-pointer"
              >
                <span className="font-medium text-white block">Heavy monsoon</span>
                <span className="text-[10px] text-slate-400 font-mono">25mm rain, 92% humidity</span>
              </button>

              <button
                onClick={() => applyPreset(39, 22, 12, 0.0, 5)}
                className="p-2.5 rounded-lg bg-[#1a2030] hover:bg-[#232b40] border border-white/[0.08] text-left transition-colors cursor-pointer"
              >
                <span className="font-medium text-white block">Peak summer</span>
                <span className="text-[10px] text-slate-400 font-mono">39°C dry, high evaporation</span>
              </button>

              <button
                onClick={() => applyPreset(27, 72, 8, 1.2, 50)}
                className="p-2.5 rounded-lg bg-[#1a2030] hover:bg-[#232b40] border border-white/[0.08] text-left transition-colors cursor-pointer"
              >
                <span className="font-medium text-white block">Light drizzle</span>
                <span className="text-[10px] text-slate-400 font-mono">1.2mm rain (non-effective)</span>
              </button>
            </div>
          </div>

          {/* Interactive Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#1a2030]/60 border border-white/[0.06]">
            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Temperature</span>
                <span className="font-mono text-white tabular-nums">{temp}°C</span>
              </div>
              <input
                type="range"
                min="15"
                max="45"
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Relative Humidity Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Relative Humidity</span>
                <span className="font-mono text-white tabular-nums">{humidity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rain Volume Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Forecast Rain Volume</span>
                <span className="font-mono text-white tabular-nums">{rainMm} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="0.5"
                value={rainMm}
                onChange={(e) => setRainMm(Number(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rain Probability Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Rain Probability</span>
                <span className="font-mono text-white tabular-nums">{rainProb}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rainProb}
                onChange={(e) => setRainProb(Number(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-white text-[#0b0d14] hover:bg-slate-200 font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Evaluating environmental physics...' : 'Run real-time simulation'}</span>
          </button>

          {/* Simulation Output Card */}
          {simResults && (
            <div className="p-4 rounded-xl bg-[#1a2030]/80 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="font-medium text-white text-xs">
                  Simulation Results
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0b0d14] text-slate-300 border border-white/[0.08]">
                  ET₀: {simResults.et0_calculated} mm/day
                </span>
              </div>

              {/* 3 Metrics Cards */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-[#0b0d14] border border-white/[0.06]">
                  <span className="text-[10px] text-slate-400 block">Water Conserved</span>
                  <span className="text-sm font-medium text-white font-mono tabular-nums">
                    {simResults.metrics.totalLitersSaved.toLocaleString()} L
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0b0d14] border border-white/[0.06]">
                  <span className="text-[10px] text-slate-400 block">Energy Conserved</span>
                  <span className="text-sm font-medium text-amber-300 font-mono tabular-nums">
                    {simResults.metrics.totalKwhSaved} kWh
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0b0d14] border border-white/[0.06]">
                  <span className="text-[10px] text-slate-400 block">Budget Saved (₹)</span>
                  <span className="text-sm font-medium text-[#4cc38a] font-mono tabular-nums">
                    ₹ {simResults.metrics.totalInrSaved.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Individual Park Decisions */}
              <div className="space-y-1.5 pt-1">
                {simResults.parks.map((p) => (
                  <div key={p.id} className="p-2 rounded-lg bg-[#0b0d14] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-white">{p.name}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.reasoning}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ml-2 ${
                      p.simulatedDecision === 'OVERRIDDEN'
                        ? 'bg-[#e5484d]/10 text-[#ff8585] border border-[#e5484d]/25'
                        : 'bg-[#4cc38a]/10 text-[#4cc38a] border border-[#4cc38a]/25'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${p.simulatedDecision === 'OVERRIDDEN' ? 'bg-[#e5484d]' : 'bg-[#4cc38a]'}`}></span>
                      {p.simulatedDecision === 'OVERRIDDEN' ? 'OVERRIDE OFF' : 'SCHEDULED'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
