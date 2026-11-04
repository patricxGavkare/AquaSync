import React, { useState } from 'react';
import { X, Sparkles, Sliders, Droplet, Zap, IndianRupee, RotateCcw } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#181d28] border border-[#2d364a] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#283144] flex items-center justify-between bg-[#151923]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Hackathon Judges' Live Simulation Lab
              </h3>
              <p className="text-xs text-slate-400">
                Adjust microclimate variables to test dynamic FAO-56 AI overrides in real time
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#202738] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Quick Presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Quick Test Scenarios (Pune Microclimates)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => applyPreset(26, 92, 18, 25.0, 95)}
                className="p-2.5 rounded-xl bg-[#202738] hover:bg-[#283247] border border-[#2d364a] text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-white block">🌧️ Heavy Monsoon</span>
                <span className="text-[10px] text-slate-400">25mm rain, 92% humidity</span>
              </button>

              <button
                onClick={() => applyPreset(39, 22, 12, 0.0, 5)}
                className="p-2.5 rounded-xl bg-[#202738] hover:bg-[#283247] border border-[#2d364a] text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-white block">☀️ Peak Summer</span>
                <span className="text-[10px] text-slate-400">39°C dry, high evaporation</span>
              </button>

              <button
                onClick={() => applyPreset(27, 72, 8, 1.2, 50)}
                className="p-2.5 rounded-xl bg-[#202738] hover:bg-[#283247] border border-[#2d364a] text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-white block">🌦️ Light Drizzle</span>
                <span className="text-[10px] text-slate-400">1.2mm rain (non-effective)</span>
              </button>
            </div>
          </div>

          {/* Interactive Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#141822] border border-[#242b3d]">
            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Temperature</span>
                <span className="font-bold text-white">{temp}°C</span>
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
                <span className="font-bold text-white">{humidity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rain Volume Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Forecast Rain Volume</span>
                <span className="font-bold text-cyan-400">{rainMm} mm</span>
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
                <span className="font-bold text-cyan-400">{rainProb}%</span>
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
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{loading ? 'Evaluating Environmental Physics...' : 'Run Real-Time AI Simulation'}</span>
          </button>

          {/* Simulation Output Card */}
          {simResults && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1b2233] to-[#161c29] border border-blue-500/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <span className="font-bold text-white text-sm">
                  ⚡ Simulation Results (Dynamic Engine)
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-400/30">
                  ET₀: {simResults.et0_calculated} mm/day
                </span>
              </div>

              {/* 3 Metrics Cards */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-[#111520] border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Water Conserved</span>
                  <span className="text-sm font-extrabold text-cyan-400">
                    {simResults.metrics.totalLitersSaved.toLocaleString()} L
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#111520] border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Energy Conserved</span>
                  <span className="text-sm font-extrabold text-amber-400">
                    {simResults.metrics.totalKwhSaved} kWh
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#111520] border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Budget Saved (₹)</span>
                  <span className="text-sm font-extrabold text-emerald-400">
                    ₹ {simResults.metrics.totalInrSaved.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Individual Park Decisions */}
              <div className="space-y-1.5 pt-1">
                {simResults.parks.map((p) => (
                  <div key={p.id} className="p-2 rounded-xl bg-[#131722] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{p.name}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.reasoning}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ml-2 ${
                      p.simulatedDecision === 'OVERRIDDEN'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {p.simulatedDecision === 'OVERRIDDEN' ? '🛑 OVERRIDE OFF' : '✅ SCHEDULED'}
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
