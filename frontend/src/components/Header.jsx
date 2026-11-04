import React, { useState } from 'react';
import { Search, Bell, Sun, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Header({ weather, onOpenSimulate, onOpenWatchman, notificationCount = 2 }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-18 px-6 border-b border-[#262c3d] bg-[#161a23] flex items-center justify-between gap-4">
      {/* Left: Search Bar */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Pune Parks, Swargate, JM Road, PCMC..."
          className="w-full bg-[#1c2230] text-slate-200 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-[#2d354a] focus:outline-none focus:border-blue-500 transition-colors"
        />
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

        {/* Watchman Mobile Portal Shortcut */}
        <button
          onClick={onOpenWatchman}
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#202738] hover:bg-[#283145] text-slate-300 hover:text-white text-xs font-medium border border-[#2d354a] transition-colors"
        >
          <span>Ground Staff View</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl bg-[#1c2230] hover:bg-[#22293b] border border-[#2d354a] flex items-center justify-center text-slate-300 hover:text-white transition-colors relative"
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
                  <p className="font-semibold text-emerald-300">✓ Watchman Acknowledged</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Santosh Gaikwad confirmed Pu La Deshpande Garden pump shutoff.</p>
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
