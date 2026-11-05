import React, { useState } from 'react';
import { MapPin, Navigation, Power, Layers, ExternalLink, Droplets, CheckCircle, ShieldAlert } from 'lucide-react';
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-950/30 to-[#1c2230] border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Pune Regional Park Irrigation Relays (Geospatial Grid)
            </h2>
            <p className="text-sm text-slate-300 mt-0.5">
              Live spatial telemetry for municipal valve actuators across Swargate, JM Road, and Sinhagad Road corridors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-semibold text-white bg-[#151923] border border-[#2d354a] px-3 py-1.5 rounded-xl">
            Strict Pune Bounds (18.52° N, 73.85° E)
          </span>
        </div>
      </div>

      {/* Grid: Left Parks Selector + Right Expansive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Park Relay Selector Cards (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="px-1 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Landmark Relays ({parks.length})</span>
            <span className="text-blue-400">Click to Center Map</span>
          </div>

          {parks && parks.map((park) => {
            const isSelected = activeParkId === park.id;
            const isHalted = park.status === 'OVERRIDDEN';
            const imgUrl = parkImages[park.id] || '/parks/aquasync_hero.jpg';

            return (
              <div
                key={park.id}
                onClick={() => handleFocusPark(park)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#202738] border-blue-500 shadow-lg shadow-blue-500/10'
                    : 'bg-[#1c2230] border-[#262c3d] hover:border-slate-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={imgUrl}
                    alt={park.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#2b3346]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-sm font-bold text-white truncate">{park.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">📍 {park.zone}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isHalted
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {isHalted ? 'PUMP HALTED' : 'SCHEDULED'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Rain: <span className="text-white">{park.rain_expected_mm} mm</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Toggle Button */}
                <div className="mt-3 pt-2.5 border-t border-slate-700/40 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-cyan-400 font-semibold">
                    Saved Today: {park.liters_saved_today.toLocaleString()} L
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePark(park.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
                      isHalted
                        ? 'bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-800'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
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