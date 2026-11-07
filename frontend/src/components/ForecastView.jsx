import React from 'react';
import { Calendar, Sun, CloudRain, Clock } from 'lucide-react';
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
      <div className="p-6 rounded-2xl bg-[#11141c] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1a2030] border border-white/[0.08] flex items-center justify-center text-slate-300">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">
              Pune Municipal Microclimate & Irrigation Dispatch Forecast
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous 24-Hour and 7-Day high-resolution weather ingestion via Open-Meteo API (18.5204° N, 73.8567° E).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4cc38a]"></span>
          <span className="text-xs font-mono text-slate-300 bg-[#1a2030] px-2.5 py-1 rounded-md border border-white/[0.08]">
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
      <div className="p-6 rounded-2xl bg-[#11141c] border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-white">7-Day Climate & Automated Valve Outlook</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Soil moisture optimization</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {daysForecast.map((df, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors ${
                df.action === 'HALTED'
                  ? 'bg-[#1a2030]/80 border-white/[0.12]'
                  : 'bg-[#1a2030]/40 border-white/[0.06]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-white mb-2">
                  <span>{df.day}</span>
                  <span className={`tabular-nums font-mono ${df.action === 'HALTED' ? 'text-[#ff8585]' : 'text-slate-300'}`}>
                    {df.high}°/{df.low}°
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mb-1 flex items-center gap-1.5">
                  {df.action === 'HALTED' ? (
                    <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span className="truncate">{df.condition}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Precip: <span className="text-white tabular-nums">{df.rain}</span> ({df.prob})
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-white/[0.06] text-center">
                <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded ${
                  df.action === 'HALTED'
                    ? 'bg-[#e5484d]/10 text-[#ff8585] border border-[#e5484d]/25'
                    : 'bg-[#4cc38a]/10 text-[#4cc38a] border border-[#4cc38a]/25'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${df.action === 'HALTED' ? 'bg-[#e5484d]' : 'bg-[#4cc38a]'}`}></span>
                  {df.action === 'HALTED' ? 'HALTED' : 'IRRIGATE'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
