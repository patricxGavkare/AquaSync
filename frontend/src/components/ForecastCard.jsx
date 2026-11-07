import React from 'react';
import { Cloud, CloudRain, Sun, CloudDrizzle, CloudSun, Droplets } from 'lucide-react';

export default function ForecastCard({ weather }) {
  const timeline = weather && weather.forecastTimeline && weather.forecastTimeline.length > 0
    ? weather.forecastTimeline
    : [
        { timeLabel: '6 AM', dayLabel: 'Wed', temperature: 22, precipitationProb: 78, condition: 'Rain', icon: 'CloudRain' },
        { timeLabel: '9 AM', dayLabel: 'Wed', temperature: 25, precipitationProb: 82, condition: 'Rain', icon: 'CloudRain' },
        { timeLabel: '12 PM', dayLabel: 'Wed', temperature: 29, precipitationProb: 65, condition: 'Showers', icon: 'CloudRain' },
        { timeLabel: '3 PM', dayLabel: 'Wed', temperature: 28, precipitationProb: 45, condition: 'Cloudy', icon: 'Cloud' },
        { timeLabel: '6 PM', dayLabel: 'Wed', temperature: 26, precipitationProb: 70, condition: 'Rain', icon: 'CloudRain' },
      ];

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'CloudRain':
      case 'CloudRainWind':
        return <CloudRain className="w-4 h-4 text-blue-400" />;
      case 'CloudDrizzle':
        return <CloudDrizzle className="w-4 h-4 text-blue-300" />;
      case 'Sun':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'CloudSun':
        return <CloudSun className="w-4 h-4 text-amber-200" />;
      default:
        return <Cloud className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#11141c] border border-white/[0.08] flex flex-col justify-between shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white tracking-tight">
          Next 24 Hours Microclimate
        </h3>
        <span className="text-xs text-slate-400 font-mono">Pune Open-Meteo</span>
      </div>

      {/* Forecast Row Items */}
      <div className="flex flex-col gap-2">
        {timeline.slice(0, 4).map((item, idx) => (
          <div 
            key={idx}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#1a2030]/60 border border-white/[0.06] text-xs"
          >
            <div className="w-16 font-mono text-slate-300">
              {item.timeLabel}
            </div>

            <div className="flex items-center gap-2 w-28">
              {getIcon(item.icon)}
              <span className="text-slate-400 text-[11px] truncate">{item.condition}</span>
            </div>

            <div className="flex items-center gap-3 text-right">
              <span className={`text-[11px] font-mono tabular-nums ${item.precipitationProb > 60 ? 'text-blue-400 font-medium' : 'text-slate-400'}`}>
                {item.precipitationProb}% rain
              </span>
              <span className="font-medium text-white w-8 tabular-nums font-mono">{item.temperature}°</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Irrigation Status Card */}
      <div className="mt-4 p-3.5 rounded-xl bg-[#1a2030] text-white flex items-center justify-between border border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#11141c] border border-white/[0.08] flex items-center justify-center text-blue-400">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-medium leading-tight">Next Irrigation: 06:00 AM</div>
            <div className="text-[11px] text-slate-400 mt-0.5 tabular-nums">Predicted rain: 14.2 mm (78% prob)</div>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#e5484d]/10 text-[#ff8585] border border-[#e5484d]/25 uppercase tracking-wide">
            <span className="w-1 h-1 rounded-full bg-[#e5484d]"></span>
            Pumps Paused
          </span>
          <div className="text-[10px] text-slate-400 mt-0.5">Override Active</div>
        </div>
      </div>
    </div>
  );
}
