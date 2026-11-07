import React, { useState } from 'react';
import { Navigation, Power } from 'lucide-react';
import PuneMap from './PuneMap';

const parkImages = {
  'sarasbaug': '/parks/sarasbaug.jpg',
  'sambhaji': '/parks/sambhaji.jpg',
  'puladeshpande': '/parks/puladeshpande.jpg'
};

export default function MapView({ parks, onTogglePark, selectedParkId, onSelectPark }) {
  const [activeParkId, setActiveParkId] = useState(selectedParkId || (parks[0] && parks[0].id));

  const handleFocusPark = (park) => {
    setActiveParkId(park.id);
    if (onSelectPark) onSelectPark(park);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#11141c] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1a2030] border border-white/[0.08] flex items-center justify-center text-slate-300">
            <Navigation className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">
              Pune Regional Park Irrigation Relays (Geospatial Grid)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live spatial telemetry for municipal valve actuators across Swargate, JM Road, and Sinhagad Road corridors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4cc38a]"></span>
          <span className="text-xs font-mono text-slate-300 bg-[#1a2030] border border-white/[0.08] px-2.5 py-1 rounded-md">
            Strict Pune Bounds (18.52° N, 73.85° E)
          </span>
        </div>
      </div>

      {/* Grid: Left Parks Selector + Right Expansive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Park Relay Selector Cards (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="px-1 text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Landmark Relays ({parks.length})</span>
            <span className="text-slate-400 font-normal">Click to center map</span>
          </div>

          {parks && parks.map((park) => {
            const isSelected = activeParkId === park.id;
            const isHalted = park.status === 'OVERRIDDEN';
            const imgUrl = parkImages[park.id] || '/parks/aquasync_hero.jpg';

            return (
              <div
                key={park.id}
                onClick={() => handleFocusPark(park)}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1a2030] border-white/[0.2] shadow-sm'
                    : 'bg-[#11141c] border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={imgUrl}
                    alt={park.name}
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border border-white/[0.08]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-sm font-semibold text-white truncate">{park.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{park.zone}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isHalted
                          ? 'bg-[#e5484d]/10 text-[#ff8585] border border-[#e5484d]/25'
                          : 'bg-[#4cc38a]/10 text-[#4cc38a] border border-[#4cc38a]/25'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${isHalted ? 'bg-[#e5484d]' : 'bg-[#4cc38a]'}`}></span>
                        {isHalted ? 'HALTED' : 'SCHEDULED'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Rain: <span className="text-slate-200 tabular-nums">{park.rain_expected_mm} mm</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Toggle Button */}
                <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 tabular-nums font-mono">
                    Saved: <span className="text-[#4cc38a]">{park.liters_saved_today.toLocaleString()} L</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePark(park.id);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                      isHalted
                        ? 'bg-[#e5484d]/20 hover:bg-[#e5484d]/30 text-[#ff8585] border border-[#e5484d]/30'
                        : 'bg-[#1a2030] hover:bg-[#232b40] text-slate-300 hover:text-white border border-white/[0.08]'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{isHalted ? 'Resume' : 'Override'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Full-Height Interactive Map (Span 8) */}
        <div className="lg:col-span-8">
          <PuneMap
            parks={parks}
            isFullView={true}
            selectedParkId={activeParkId}
            onSelectPark={handleFocusPark}
            onTogglePark={onTogglePark}
          />
        </div>
      </div>
    </div>
  );
}
