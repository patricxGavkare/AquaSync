import React from 'react';
import { 
  Droplets, 
  MapPin, 
  Sparkles, 
  BarChart3, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Clock 
} from 'lucide-react';
import KpiMetrics from './KpiMetrics';
import HeroCard from './HeroCard';
import ForecastCard from './ForecastCard';
import ParkCards from './ParkCards';

export default function DashboardHome({ 
  weather, 
  parks, 
  summary, 
  onTogglePark, 
  onOpenAddPark, 
  setActiveTab 
}) {
  return (
    <div className="space-y-6">
      {/* 1. Modern AquaSync Hero Banner */}
      <div className="rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-[#172033] via-[#1a2336] to-[#141b29] border border-blue-500/25 relative overflow-hidden shadow-2xl">
        {/* Soft Background Radial Glows */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Left Brand Content (Span 7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-xs font-semibold text-blue-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>PCCOE Grand Challenge 2026 • AI for Urban Sustainability</span>
            </div>

            {/* Prominent AquaSync Title */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  AquaSync
                </span>
                <span className="text-lg font-medium text-slate-400 border-l border-slate-700 pl-3 hidden sm:inline">
                  Pune Smart Water Mesh
                </span>
              </h1>
              <p className="text-sm lg:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Autonomous climate-adaptive irrigation system transforming rigid mechanical sprinkler timers across 
                Pune Municipal Corporation (PMC) and PCMC into an intelligent, weather-predictive moisture grid.
              </p>
            </div>

            {/* Quick Micro-Stats Chips */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-300 pt-1">
              <span className="px-3 py-1 rounded-xl bg-[#131722] border border-[#262c3d] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Pune PMC (18.52° N, 73.85° E)</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-[#131722] border border-[#262c3d] flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>₹32 / kL Water Savings</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-[#131722] border border-[#262c3d] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>MSEDCL LT-III Tariff Shield</span>
              </span>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <button
                onClick={() => setActiveTab('parks')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 cursor-pointer flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Explore Pune Regional Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('simulate')}
                className="px-4 py-2.5 rounded-xl bg-[#202738] hover:bg-[#283247] text-slate-200 border border-[#2f394d] text-xs font-semibold transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Launch AI Simulator</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className="px-4 py-2.5 rounded-xl bg-[#202738] hover:bg-[#283247] text-slate-200 border border-[#2f394d] text-xs font-semibold transition-all cursor-pointer flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Audit Analytics</span>
              </button>
            </div>
          </div>

          {/* Right Hero Weather Widget (Span 5) */}
          <div className="lg:col-span-5">
            <HeroCard weather={weather} />
          </div>
        </div>
      </div>

      {/* 2. Top Executive KPI Metric Cards */}
      <KpiMetrics summary={summary} />

      {/* 3. Featured Pune Landmark Parks with Real Images */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Pune Landmark Municipal Parks (Live Relays)
            </h2>
            <p className="text-xs text-slate-400">
              Photographic telemetry and automated valve status for key municipal green spaces.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('parks')}
            className="text-xs text-blue-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View Full Map View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3-Column Park Grid with Real Images */}
        <ParkCards
          parks={parks}
          onTogglePark={onTogglePark}
          onOpenAddPark={onOpenAddPark}
          onSelectParkOnMap={(park) => setActiveTab('parks')}
          layout="grid"
        />
      </div>

      {/* 4. Next 24 Hours Climate Forecast Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ForecastCard weather={weather} />
        </div>

        {/* Quick Map Preview Card */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-[#1c2230] border border-[#262c3d] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Geospatial Mesh Quick Access</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/40">
                Mesh Online
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sarasbaug, Sambhaji Garden, and Pu La Deshpande Japanese Garden are mapped with real GPS coordinates and automated valve relays.
            </p>
          </div>

          <div className="my-4 p-3 rounded-2xl bg-[#151923] border border-[#252b3d] space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Active Pune Relays:</span>
              <span className="font-bold text-white">3 Parks (97,000 m² Turf)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Automated Overrides Today:</span>
              <span className="font-bold text-rose-400">2 Valves Halted</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>PMC Water Tariff Avoidance:</span>
              <span className="font-bold text-cyan-400">₹ 8,609 Saved</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('parks')}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Launch Full Geospatial Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}