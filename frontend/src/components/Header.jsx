import React, { useState } from 'react';
import { Search, Bell, Sparkles, X, MapPin, CheckCircle, ShieldAlert } from 'lucide-react';

export default function Header({ 
  weather, 
  onOpenSimulate, 
  searchQuery, 
  setSearchQuery, 
  parks = [], 
  onSelectPark, 
  notificationCount = 2 
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter parks based on search query
  const filteredParks = searchQuery.trim() === '' 
    ? [] 
    : parks.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.zone.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <header className="h-18 px-6 border-b border-[#262c3d] bg-[#161a23] flex items-center justify-between gap-4 sticky top-0 z-40">
      {/* Left: Functional Interactive Search Bar */}
      <div className="flex-1 max-w-md relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search Pune Parks, Swargate, JM Road, Sinhagad..."
            className="w-full bg-[#1c2230] text-slate-200 placeholder-slate-400 text-sm rounded-xl pl-10 pr-9 py-2.5 border border-[#2d354a] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {isSearchFocused && filteredParks.length > 0 && (
          <div 
            className="absolute left-0 right-0 mt-2 bg-[#1c2230] border border-[#2d354a] rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
            onMouseDown={(e) => e.preventDefault()} // Keep focus while clicking
          >
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-700/50 flex items-center justify-between">
              <span>Matching Pune Parks ({filteredParks.length})</span>
              <span className="text-cyan-400 text-[10px]">Click to inspect</span>
            </div>

            <div className="flex flex-col gap-1 mt-1 max-h-60 overflow-y-auto">
              {filteredParks.map((park) => {
                const isHalted = park.status === 'OVERRIDDEN';
                return (
                  <button
                    key={park.id}
                    onClick={() => {
                      if (onSelectPark) onSelectPark(park);
                      setIsSearchFocused(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-[#252c3d] text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#151923] border border-[#2b3346] flex items-center justify-center text-xs">
                        📍
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                          {park.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {park.zone} • {(park.irrigated_area_sqm / 1000).toFixed(0)}k m²
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isHalted 
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' 
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {isHalted ? 'Pump Halted' : 'Scheduled'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live Weather Ticker */}
        {weather && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1c2230] border border-[#2d354a] text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-400">Pune:</span>
            <span className="text-white font-semibold">{weather.temperature}°C</span>
            <span className="text-slate-400">|</span>
            <span className="text-cyan-400 font-medium">{weather.weatherCondition}</span>
          </div>
        )}

        {/* Hackathon Judge Simulation Action Button */}
        <button
          onClick={onOpenSimulate}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>Judges' Simulation Lab</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl bg-[#1c2230] hover:bg-[#22293b] border border-[#2d354a] flex items-center justify-center text-slate-300 hover:text-white transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-[#161a23]"></span>
            )}
          </button>

          {/* Dropdown Menu */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1c2230] border border-[#2d354a] rounded-2xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 mb-2">
                <span className="text-xs font-semibold text-white">Live AI Override Telemetry</span>
                <span className="text-[10px] text-emerald-400 font-medium">System Active</span>
              </div>
              <div className="flex flex-col gap-2 text-xs">
                <div className="p-2 rounded-xl bg-blue-950/40 border border-blue-800/40">
                  <p className="font-semibold text-blue-300">🛑 Sarasbaug Pump Halted</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Heavy monsoon rain (14.2mm) predicted. 175,000 Liters saved today.</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/40">
                  <p className="font-semibold text-emerald-300">✓ Weather Ingestion Synced</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Open-Meteo Pune radar feed updated at 18.5204° N, 73.8567° E.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-700/60">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-500/30">
            PG
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-white leading-tight">Pratik Gavkare</span>
            <span className="text-[10px] text-slate-400">PMC Water Division</span>
          </div>
        </div>
      </div>
    </header>
  );
}
