import React from 'react';
import { Wind, Droplets, Sun, Eye, Activity } from 'lucide-react';

export default function HeroCard({ weather }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'short'
  });

  const temp = weather ? weather.temperature : 30;
  const condition = weather ? weather.weatherCondition : 'Partly Cloudy';
  const wind = weather ? weather.windSpeed : 14;
  const humidity = weather ? weather.humidity : 48;
  const et0 = weather ? (weather.et0_fao56 || 5.65) : 5.65;
  const rainProb = weather ? weather.next12HoursRainProb : 75;

  return (
    <div className="rounded-3xl p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-xl shadow-blue-900/30 relative overflow-hidden flex flex-col justify-between min-h-[260px] border border-blue-400/20">
      {/* Background Soft Glow Circles */}
      <div className="absolute -right-8 -top-8 w-44 h-44 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top Header Row */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="text-blue-100 text-xs font-medium tracking-wide">
            {currentDate}
          </div>
          <div className="text-white text-sm font-semibold flex items-center gap-1.5 mt-0.5">
            <span>📍 Pune Municipal Area</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/40 text-blue-100 border border-blue-300/30">
              Live Feed
            </span>
          </div>
        </div>

        {/* AI Status Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/25 backdrop-blur-md border border-white/20 text-xs font-medium shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-emerald-200">AI Override Active</span>
        </div>
      </div>

      {/* Main Temperature & Visual Row */}
      <div className="my-4 flex items-center justify-between relative z-10">
        <div>
          <div className="text-6xl md:text-7xl font-extrabold tracking-tighter flex items-start">
            <span>{temp}</span>
            <span className="text-3xl text-blue-200 font-light ml-1">°C</span>
          </div>
          <div className="text-blue-100 font-medium text-sm mt-1 flex items-center gap-2">
            <span>{condition}</span>
            <span>•</span>
            <span className="text-cyan-200 font-normal">Rain Chance (12h): {rainProb}%</span>
          </div>
        </div>

        {/* Stylized Sun/Cloud Graphic */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center shadow-lg shadow-amber-500/40 animate-pulse">
            <Sun className="w-12 h-12 text-amber-900/80" />
          </div>
          <div className="absolute -bottom-2 -left-3 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-medium border border-white/30 text-white">
            Monsoon
          </div>
        </div>
      </div>

      {/* Bottom Micro-Metrics Bar */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/15 relative z-10 text-xs">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-blue-200" />
          <div>
            <div className="text-blue-200 text-[10px]">Wind</div>
            <div className="font-semibold text-white">{wind} km/h</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-cyan-200" />
          <div>
            <div className="text-cyan-200 text-[10px]">Humidity</div>
            <div className="font-semibold text-white">{humidity}%</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-200" />
          <div>
            <div className="text-emerald-200 text-[10px]">ET₀ Rate</div>
            <div className="font-semibold text-white">{et0} mm/d</div>
          </div>
        </div>
      </div>
    </div>
  );
}
