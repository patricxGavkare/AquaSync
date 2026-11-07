import React from 'react';
import { 
  Droplets, 
  MapPin, 
  BarChart3, 
  ArrowRight, 
  Zap, 
  Sliders
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
      {/* 1. AquaSync Hero Banner */}
      <div className="rounded-2xl p-6 lg:p-7 bg-[#11141c] border border-white/[0.08] relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Left Brand Content (Span 7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#1a2030] border border-white/[0.08] text-xs font-mono text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4cc38a]"></span>
              <span>PCCOE Grand Challenge 2026 • AI for Urban Sustainability</span>
            </div>

            {/* Clean AquaSync Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-white flex items-center gap-3">
                <span>AquaSync</span>
                <span className="text-sm font-normal text-slate-400 border-l border-white/[0.12] pl-3 hidden sm:inline">
                  Pune Smart Water Mesh
                </span>
              </h1>
              <p className="text-xs lg:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                Autonomous climate-adaptive irrigation system transforming rigid mechanical sprinkler timers across 
                Pune Municipal Corporation (PMC) and PCMC into an intelligent, weather-predictive moisture grid.
              </p>
            </div>

            {/* Quick Micro-Stats Chips */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-300 pt-1">
              <span className="px-2.5 py-1 rounded-md bg-[#1a2030]/60 border border-white/[0.06] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="tabular-nums font-mono text-[11px]">Pune PMC (18.52° N, 73.85° E)</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#1a2030]/60 border border-white/[0.06] flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                <span className="tabular-nums font-mono text-[11px]">₹32/kL water tariff</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#1a2030]/60 border border-white/[0.06] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="tabular-nums font-mono text-[11px]">MSEDCL LT-III power shield</span>
              </span>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex items-center gap-2.5 pt-2 flex-wrap">
              {/* Exactly 1 Primary Button */}
              <button
                onClick={() => setActiveTab('parks')}
                className="px-3.5 py-2 rounded-lg bg-white text-[#0b0d14] hover:bg-slate-200 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Explore Pune map</span>
                <ArrowRight className="w-3 h-3 text-slate-700" />
              </button>

              {/* Quiet Secondary Actions */}
              <button
                onClick={() => setActiveTab('simulate')}
                className="px-3.5 py-2 rounded-lg bg-[#1a2030] hover:bg-[#222a3d] text-slate-200 border border-white/[0.08] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>Simulation lab</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className="px-3.5 py-2 rounded-lg bg-[#1a2030] hover:bg-[#222a3d] text-slate-200 border border-white/[0.08] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                <span>Audit analytics</span>
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
            <h2 className="text-base font-semibold text-white tracking-tight">
              Pune Landmark Municipal Parks (Live Relays)
            </h2>
            <p className="text-xs text-slate-400">
              Photographic telemetry and automated valve status for key municipal green spaces.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('parks')}
            className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View full map</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
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
        <div className="lg:col-span-5 rounded-2xl p-5 bg-[#11141c] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Geospatial Mesh Quick Access</span>
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-[#4cc38a] bg-[#4cc38a]/10 border border-[#4cc38a]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cc38a]"></span>
                Mesh online
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sarasbaug, Sambhaji Garden, and Pu La Deshpande Japanese Garden are mapped with real GPS coordinates and automated valve relays.
            </p>
          </div>

          <div className="my-4 p-3 rounded-xl bg-[#1a2030]/60 border border-white/[0.06] space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Active Pune relays:</span>
              <span className="font-medium text-white tabular-nums">3 Parks (97,000 m² turf)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Automated overrides today:</span>
              <span className="font-medium text-[#f76808] dark:text-[#ff8585] tabular-nums">2 Valves halted</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>PMC water tariff avoidance:</span>
              <span className="font-medium text-[#4cc38a] tabular-nums font-mono">₹ 8,609 saved</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('parks')}
            className="w-full py-2 rounded-lg bg-[#1a2030] hover:bg-[#222a3d] text-white text-xs font-medium border border-white/[0.08] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Open geospatial map</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
