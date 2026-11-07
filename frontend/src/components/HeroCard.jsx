import React from 'react';
import { Wind, Droplets, Activity, Sun, CloudRain } from 'lucide-react';

export default function HeroCard({ weather }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  const temp = weather ? weather.temperature : 24;
  const condition = weather ? weather.weatherCondition : 'Partly Cloudy';
  const wind = weather ? weather.windSpeed : 14;
  const humidity = weather ? weather.humidity : 48;
  const et0 = weather ? (weather.et0_fao56 || 4.15) : 4.15;
  const rainProb = weather ? weather.next12HoursRainProb : 0;

  return (
    <div className="rounded-2xl p-5 bg-[#11141c] border border-white/[0.08] flex flex-col justify-between min-h-[220px]">
      {/* Top Meta Row */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">{currentDate}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 font-medium">Pune District</span>
        </div>

        {/* Quiet Live Status Dot */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4cc38a]"></span>
          <span>Radar active</span>
        </div>
      </div>

      {/* Primary Metric Reading */}
      <div className="my-3 flex items-baseline justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl lg:text-5xl font-medium tracking-tight text-white tabular-nums">
              {temp}
            </span>
            <span className="text-xl text-slate-400 font-normal">°C</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span className="text-slate-200">{condition}</span>
            <span className="text-slate-600">•</span>
            <span>Rain chance {rainProb}%</span>
          </div>
        </div>

        {/* Subtle Meteorological Indicator */}
        <div className="p-3 rounded-xl bg-[#181d2a] border border-white/[0.06] flex items-center justify-center text-slate-300">
          {rainProb > 40 ? (
            <CloudRain className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
          ) : (
            <Sun className="w-6 h-6 text-amber-400" strokeWidth={1.5} />
          )}
        </div>
      </div>

      {/* Micro-Metrics Bar */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.06] text-xs">
        <div>
          <div className="text-[11px] text-slate-500">Wind</div>
          <div className="font-medium text-slate-200 tabular-nums">{wind} km/h</div>
        </div>

        <div>
          <div className="text-[11px] text-slate-500">Humidity</div>
          <div className="font-medium text-slate-200 tabular-nums">{humidity}%</div>
        </div>

        <div>
          <div className="text-[11px] text-slate-500">ET₀ Rate</div>
          <div className="font-medium text-slate-200 tabular-nums">{et0} mm/d</div>
        </div>
      </div>
    </div>
  );
}
