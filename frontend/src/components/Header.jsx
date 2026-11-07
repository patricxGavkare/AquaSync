import React, { useState } from 'react';
import { Search, Bell, Sliders, X, MapPin } from 'lucide-react';

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
    <header className="h-16 px-6 border-b border-white/[0.08] bg-[#07080d] flex items-center justify-between gap-4 sticky top-0 z-40 select-none">
      {/* Left: Functional Search Bar */}
      <div className="flex-1 max-w-sm relative">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search Pune parks and corridors"
            className="w-full bg-[#11141c] text-slate-200 placeholder-slate-500 text-xs rounded-xl pl-9 pr-8 py-2 border border-white/[0.08] focus:outline-none focus:border-blue-500/60 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {isSearchFocused && filteredParks.length > 0 && (
          <div 
            className="absolute left-0 right-0 mt-2 bg-[#11141c] border border-white/[0.1] rounded-xl shadow-xl p-2 z-50 overflow-hidden"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="px-2.5 py-1 text-[11px] font-medium text-slate-400 border-b border-white/[0.06] flex items-center justify-between">
              <span>Matching parks ({filteredParks.length})</span>
              <span className="text-slate-500 text-[10px]">Select to inspect</span>
            </div>

            <div className="flex flex-col gap-1 mt-1 max-h-56 overflow-y-auto">
              {filteredParks.map((park) => {
                const isHalted = park.status === 'OVERRIDDEN';
                return (
                  <button
                    key={park.id}
                    onClick={() => {
                      if (onSelectPark) onSelectPark(park);
                      setIsSearchFocused(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#1a2030] text-left transition-colors cursor-pointer group"
                  >
                    <div>
                      <div className="text-xs font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                        {park.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {park.zone} • {(park.irrigated_area_sqm / 1000).toFixed(0)}k m²
                      </div>
                    </div>

                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      isHalted 
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    }`}>
                      {isHalted ? 'Halted' : 'Scheduled'}
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
        {/* Live Weather Indicator */}
        {weather && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#11141c] border border-white/[0.08] text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cc38a]"></span>
            <span className="text-slate-400">Pune</span>
            <span className="font-medium text-slate-200 tabular-nums">{weather.temperature}°C</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">{weather.weatherCondition}</span>
          </div>
        )}

        {/* Simulation Lab Action Button */}
        <button
          onClick={onOpenSimulate}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1a2030] hover:bg-[#222a3f] text-slate-200 border border-white/[0.08] text-xs font-medium transition-colors cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-400" strokeWidth={1.5} />
          <span>Simulation Lab</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 rounded-lg bg-[#11141c] hover:bg-[#1a2030] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors relative cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" strokeWidth={1.5} />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
            )}
          </button>

          {/* Dropdown Menu */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#11141c] border border-white/[0.1] rounded-xl shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] mb-2">
                <span className="text-xs font-medium text-white">Override telemetry</span>
                <span className="text-[10px] text-emerald-400">Active</span>
              </div>
              <div className="flex flex-col gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#181d2a] border border-white/[0.06]">
                  <p className="font-medium text-slate-200">Sarasbaug pump halted</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Forecast rain 14.2 mm. 175,000 L water conserved.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-[#181d2a] border border-white/[0.06]">
                  <p className="font-medium text-slate-200">Weather feed synced</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Open-Meteo Pune radar feed updated at 18.5204° N, 73.8567° E.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
          <div className="w-8 h-8 rounded-lg bg-[#1a2030] border border-white/[0.08] flex items-center justify-center text-slate-200 font-medium text-xs">
            PG
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-medium text-slate-200 leading-tight">Pratik Gavkare</span>
            <span className="text-[10px] text-slate-400">PMC Water Division</span>
          </div>
        </div>
      </div>
    </header>
  );
}
