import React from 'react';
import { ShieldAlert, CheckCircle, Smartphone, Plus, Power, Droplets } from 'lucide-react';

export default function ParkCards({ parks, onTogglePark, onOpenAddPark, onOpenWatchman }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'OVERRIDDEN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            PUMP OFF (SAVED)
          </span>
        );
      case 'ALERT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            WATCHMAN ALERT
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            SCHEDULED
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {parks && parks.map((park) => {
        const isOverridden = park.status === 'OVERRIDDEN' || park.status === 'ALERT';

        return (
          <div
            key={park.id}
            className="p-3.5 rounded-2xl bg-[#1c2230] border border-[#262c3d] hover:border-slate-600 transition-all shadow-sm flex flex-col justify-between"
          >
            {/* Top row: Name, Zone & Status */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#151923] border border-[#252b3d] flex items-center justify-center text-sm shadow-inner">
                  {isOverridden ? '🌧️' : '☀️'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight leading-none">{park.name}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                    <span>📍 {park.zone}</span>
                    <span>•</span>
                    <span>{(park.irrigated_area_sqm / 1000).toFixed(0)}k m² turf</span>
                  </p>
                </div>
              </div>

              {getStatusBadge(park.status)}
            </div>

            {/* Middle metrics row */}
            <div className="grid grid-cols-3 gap-2 my-2.5 p-2 rounded-xl bg-[#151923] border border-[#252b3d] text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Rain Expected</span>
                <span className="font-semibold text-white">{park.rain_expected_mm} mm</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Water Need</span>
                <span className="font-semibold text-white">{(park.water_need_liters / 1000).toFixed(0)} kL</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Liters Saved</span>
                <span className={`font-semibold ${isOverridden ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
                  {park.liters_saved_today > 0 ? `${(park.liters_saved_today / 1000).toFixed(0)} kL` : '0 L'}
                </span>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-700/40 text-xs">
              <span className="text-[11px] text-slate-400">
                Staff: <span className="text-slate-200">{park.watchman_name}</span>
                {park.watchman_acknowledged ? (
                  <span className="text-emerald-400 ml-1 font-medium">✓ Ack</span>
                ) : (
                  <span className="text-amber-400 ml-1 font-medium">• Pending</span>
                )}
              </span>

              <div className="flex items-center gap-2">
                {park.status === 'ALERT' && (
                  <button
                    onClick={() => onOpenWatchman(park)}
                    className="px-2 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 text-[11px] font-medium transition-colors"
                  >
                    Mobile View
                  </button>
                )}

                <button
                  onClick={() => onTogglePark(park.id)}
                  title={isOverridden ? 'Resume Normal Timer' : 'Emergency Override (Halt Pump)'}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer ${
                    isOverridden
                      ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60'
                      : 'bg-[#252c3d] hover:bg-[#2f384d] text-slate-300 hover:text-white'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{isOverridden ? 'Resume' : 'Override'}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Dashed Future Scope Card (Matching Reference Mockup!) */}
      <button
        onClick={onOpenAddPark}
        className="p-4 rounded-2xl border-2 border-dashed border-[#2d354a] hover:border-blue-500/60 bg-[#161a23]/60 hover:bg-[#1c2230] transition-all text-slate-400 hover:text-white flex items-center justify-center gap-2 cursor-pointer group"
      >
        <div className="w-7 h-7 rounded-lg bg-[#22293b] group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
          <Plus className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold">
          Add Park or Roadside Divider (Future Scope)
        </span>
      </button>
    </div>
  );
}
