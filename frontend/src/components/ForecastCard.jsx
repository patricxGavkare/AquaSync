import React from 'react';
import { Cloud, CloudRain, Sun, Wind, CloudDrizzle, CloudSun, AlertTriangle } from 'lucide-react';

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
        return <CloudRain className="w-4 h-4 text-cyan-400" />;
      case 'CloudDrizzle':
        return <CloudDrizzle className="w-4 h-4 text-blue-300" />;
      case 'Sun':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'CloudSun':
        return <CloudSun className="w-4 h-4 text-amber-200" />;
      default:
        return <Cloud className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-[#1c2230] border border-[#262c3d] flex flex-col justify-between shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Next 24 Hours Microclimate
        </h3>
        <span className="text-xs text-blue-400 font-medium">Pune Open-Meteo</span>
      </div>

      {/* Forecast Row Items */}
      <div className="flex flex-col gap-2.5">
        {timeline.slice(0, 4).map((item, idx) => (
          <div 
            key={idx}
            className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-[#151923] border border-[#232838] text-xs"
          >
            <div className="w-16 font-medium text-slate-300">
              {item.timeLabel}
            </div>

            <div className="flex items-center gap-2 w-28">
              {getIcon(item.icon)}
              <span className="text-slate-400 text-[11px] truncate">{item.condition}</span>
            </div>

            <div className="flex items-center gap-2 text-right">
              <span className={`text-[11px] font-medium ${item.precipitationProb > 60 ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}>
                💧 {item.precipitationProb}%
              </span>
              <span className="font-bold text-white w-8">{item.temperature}°</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Highlighted Pill Card (Direct match to reference image's blue glowing pill!) */}
      <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-lg shadow-blue-600/20 border border-blue-400/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <CloudRain className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold leading-tight">Next Irrigation: 06:00 AM</div>
            <div className="text-[10px] text-blue-100 mt-0.5">Predicted Rain: 14.2 mm (78% Prob)</div>
          </div>
        </div>

        <div className="text-right">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-blue-700 shadow-sm uppercase tracking-wide">
            Override OFF
          </span>
          <div className="text-[10px] text-blue-100 mt-0.5">Pumps Paused</div>
        </div>
      </div>
    </div>
  );
}
