import React from 'react';
import { Power, Plus, MapPin, Droplets, Navigation, ExternalLink } from 'lucide-react';

const parkImages = {
  'sarasbaug': '/parks/sarasbaug.jpg',
  'sambhaji': '/parks/sambhaji.jpg',
  'puladeshpande': '/parks/puladeshpande.jpg'
};

export default function ParkCards({ 
  parks = [], 
  onTogglePark, 
  onOpenAddPark, 
  onSelectParkOnMap,
  layout = 'vertical' // 'vertical' (for bento sidebar) | 'grid' (for full section)
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'OVERRIDDEN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
            PUMP OFF (SAVED)
          </span>
        );
      case 'ALERT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            AI OVERRIDE
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            SCHEDULED
          </span>
        );
    }
  };

  const isGrid = layout === 'grid';

  return (
    <div className={isGrid ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col gap-3.5'}>
      {parks && parks.map((park) => {
        const isOverridden = park.status === 'OVERRIDDEN' || park.status === 'ALERT';
        const imgUrl = parkImages[park.id] || '/parks/aquasync_hero.jpg';

        return (
          <div
            key={park.id}
            className="rounded-2xl bg-[#1c2230] border border-[#262c3d] hover:border-slate-500/70 transition-all shadow-md overflow-hidden flex flex-col justify-between group"
          >
            {/* Real Park Image Header */}
            <div className="relative h-28 w-full overflow-hidden">
              <img
                src={imgUrl}
                alt={park.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c2230] via-[#1c2230]/40 to-black/30"></div>

              {/* Status Badge Over Image */}
              <div className="absolute top-2.5 right-2.5 z-10">
                {getStatusBadge(park.status)}
              </div>

              {/* Park Name Over Image Base */}
              <div className="absolute bottom-2 left-3 right-3 z-10">
                <h4 className="text-sm font-bold text-white tracking-tight drop-shadow-md">
                  {park.name}
                </h4>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <span>📍 {park.zone}</span>
                  <span>•</span>
                  <span>{(park.irrigated_area_sqm / 1000).toFixed(0)}k m² turf</span>
                </p>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="p-3">
              <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-[#151923] border border-[#252b3d] text-xs">
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
              <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-slate-700/40 text-xs">
                {onSelectParkOnMap ? (
                  <button
                    onClick={() => onSelectParkOnMap(park)}
                    className="text-[11px] text-blue-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>View on Map</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Soil: <span className="text-slate-200">{park.soil_type || 'Sandy Loam'}</span>
                  </span>
                )}

                <button
                  onClick={() => onTogglePark(park.id)}
                  title={isOverridden ? 'Resume Normal Timer' : 'Emergency Override (Halt Pump)'}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold text-[11px] transition-all cursor-pointer ${
                    isOverridden
                      ? 'bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/60'
                      : 'bg-[#252c3d] hover:bg-blue-600 text-slate-300 hover:text-white'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{isOverridden ? 'Resume Timer' : 'Halt Pump'}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Dashed Future Scope Card (Matching Reference Mockup!) */}
      <button
        onClick={onOpenAddPark}
        className={`p-4 rounded-2xl border-2 border-dashed border-[#2d354a] hover:border-blue-500/60 bg-[#161a23]/60 hover:bg-[#1c2230] transition-all text-slate-400 hover:text-white flex items-center justify-center gap-2 cursor-pointer group ${
          isGrid ? 'min-h-[180px]' : ''
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-[#22293b] group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
          <Plus className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold">
          Add Park or Roadside Divider (Future Scope)
        </span>
      </button>
    </div>
  );
}
