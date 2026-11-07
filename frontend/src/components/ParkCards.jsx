import React from 'react';
import { Power, Plus, MapPin, Navigation } from 'lucide-react';

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
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#e5484d]/10 text-[#f76808] dark:text-[#ff8585] border border-[#e5484d]/25 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e5484d]"></span>
            Pumps Halted
          </span>
        );
      case 'ALERT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/25 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span>
            AI Override
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#4cc38a]/10 text-[#4cc38a] border border-[#4cc38a]/25 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cc38a]"></span>
            Scheduled
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
            className="rounded-2xl bg-[#11141c] border border-white/[0.08] hover:border-white/[0.16] transition-colors overflow-hidden flex flex-col justify-between group"
          >
            {/* Real Park Photographic Header */}
            <div className="relative h-28 w-full overflow-hidden bg-[#1a2030]">
              <img
                src={imgUrl}
                alt={park.name}
                className="w-full h-full object-cover transition-opacity duration-300 opacity-90 group-hover:opacity-100"
              />
              {/* Subtle Dark Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#11141c] via-[#11141c]/40 to-black/30"></div>

              {/* Status Badge Over Image */}
              <div className="absolute top-2.5 right-2.5 z-10">
                {getStatusBadge(park.status)}
              </div>

              {/* Park Name Over Image Base */}
              <div className="absolute bottom-2 left-3 right-3 z-10">
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  {park.name}
                </h4>
                <p className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{park.zone}</span>
                  <span className="text-slate-500">•</span>
                  <span className="tabular-nums font-mono text-slate-400">{(park.irrigated_area_sqm / 1000).toFixed(0)}k m² turf</span>
                </p>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="p-3">
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#1a2030]/60 border border-white/[0.06] text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-normal">Rain Expected</span>
                  <span className="font-medium text-white tabular-nums">{park.rain_expected_mm} mm</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-normal">Water Need</span>
                  <span className="font-medium text-white tabular-nums">{(park.water_need_liters / 1000).toFixed(0)} kL</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-normal">Saved Today</span>
                  <span className={`font-medium tabular-nums ${isOverridden ? 'text-[#4cc38a]' : 'text-slate-400'}`}>
                    {park.liters_saved_today > 0 ? `${(park.liters_saved_today / 1000).toFixed(0)} kL` : '0 L'}
                  </span>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/[0.06] text-xs">
                {onSelectParkOnMap ? (
                  <button
                    onClick={() => onSelectParkOnMap(park)}
                    className="text-[11px] text-slate-300 hover:text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3 h-3 text-blue-400" />
                    <span>View on map</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Soil: <span className="text-slate-300">{park.soil_type || 'Sandy Loam'}</span>
                  </span>
                )}

                <button
                  onClick={() => onTogglePark(park.id)}
                  title={isOverridden ? 'Resume Normal Timer' : 'Emergency Override (Halt Pump)'}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium text-[11px] transition-colors cursor-pointer ${
                    isOverridden
                      ? 'bg-[#e5484d]/15 hover:bg-[#e5484d]/25 text-[#ff8585] border border-[#e5484d]/30'
                      : 'bg-[#1a2030] hover:bg-[#232b40] text-slate-300 hover:text-white border border-white/[0.08]'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{isOverridden ? 'Resume timer' : 'Halt pump'}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Dashed Future Scope Card */}
      <button
        onClick={onOpenAddPark}
        className={`p-4 rounded-2xl border border-dashed border-white/[0.12] hover:border-white/[0.24] bg-transparent hover:bg-[#11141c] transition-colors text-slate-400 hover:text-slate-200 flex items-center justify-center gap-2 cursor-pointer group ${
          isGrid ? 'min-h-[180px]' : ''
        }`}
      >
        <div className="w-7 h-7 rounded-md bg-[#1a2030] text-slate-300 group-hover:text-white flex items-center justify-center transition-colors">
          <Plus className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-medium">
          Add green space (Future Scope)
        </span>
      </button>
    </div>
  );
}
