import React from 'react';
import { Calendar, Sun, CloudRain, Wind, Droplets, Activity, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import ForecastCard from './ForecastCard';
import HeroCard from './HeroCard';

export default function ForecastView({ weather, parks }) {
  const daysForecast = [
    { day: 'Friday', condition: 'Monsoon Rain', rain: '14.2 mm', prob: '85%', high: 27, low: 21, action: 'HALTED' },
    { day: 'Saturday', condition: 'Moderate Showers', rain: '8.5 mm', prob: '70%', high: 28, low: 22, action: 'HALTED' },
    { day: 'Sunday', condition: 'Passing Clouds', rain: '1.2 mm', prob: '30%', high: 29, low: 23, action: 'SCHEDULED' },
    { day: 'Monday', condition: 'Sunny / Dry', rain: '0.0 mm', prob: '10%', high: 31, low: 23, action: 'SCHEDULED' },
    { day: 'Tuesday', condition: 'Clear Sky', rain: '0.0 mm', prob: '5%', high: 32, low: 24, action: 'SCHEDULED' },
    { day: 'Wednesday', condition: 'Partly Cloudy', rain: '0.5 mm', prob: '20%', high: 30, low: 23, action: 'SCHEDULED' },
    { day: 'Thursday', condition: 'Humid Evening', rain: '2.0 mm', prob: '40%', high: 30, low: 22, action: 'SCHEDULED' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-cyan-950/30 to-[#1c2230] border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Pune Municipal Microclimate & Irrigation Dispatch Forecast
            </h2>
            <p className="text-sm text-slate-300 mt-0.5">
              Continuous 24-Hour and 7-Day high-resolution weather ingestion via Open-Meteo API (18.5204° N, 73.8567° E).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/40">
            Live Radar Synced
          </span>
        </div>
      </div>

      {/* Grid: Live Weather + 24-Hour Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <HeroCard weather={weather} />
        </div>
        <div className="lg:col-span-7">
          <ForecastCard weather={weather} />
        </div>
      </div>

      {/* Next 7 Days Predictive Irrigation Outlook */}
      <div className="p-6 rounded-3xl bg-[#1c2230] border border-[#262c3d]">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">7-Day Climate & Automated Valve Outlook</h3>
          </div>
          <span className="text-xs text-slate-400">Soil Moisture Optimization</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {daysForecast.map((df, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                df.action === 'HALTED'
                  ? 'bg-rose-950/20 border-rose-800/40 hover:border-rose-600'
                  : 'bg-[#151923] border-[#283144] hover:border-slate-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                  <span>{df.day}</span>
                  <span className={df.action === 'HALTED' ? 'text-rose-400' : 'text-emerald-400'}>
                    {df.high}° / {df.low}°
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mb-1 flex items-center gap-1">
                  <span>{df.action === 'HALTED' ? '🌧️' : '☀️'}</span>
                  <span>{df.condition}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Precip: <span className="text-white font-medium">{df.rain}</span> ({df.prob})
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-700/30 text-center">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  df.action === 'HALTED'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {df.action === 'HALTED' ? 'PUMP HALTED' : 'IRRIGATE'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}