import React from 'react';
import { 
  Droplets, 
  LayoutGrid, 
  MapPin, 
  Calendar, 
  Sliders, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Overview' },
    { id: 'parks', icon: MapPin, label: 'Pune Map' },
    { id: 'schedule', icon: Calendar, label: 'Forecast' },
    { id: 'simulate', icon: Sliders, label: 'Simulation Lab' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <aside className="w-16 md:w-18 bg-[#07080d] border-r border-white/[0.08] flex flex-col items-center py-5 justify-between shrink-0 min-h-screen z-30 select-none">
      {/* Top Logo */}
      <div className="flex flex-col items-center gap-6">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white cursor-pointer hover:bg-blue-500 transition-colors"
          title="AquaSync - Return to Overview"
        >
          <Droplets className="w-5 h-5" strokeWidth={1.75} />
        </button>

        {/* Navigation Icon List */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer group relative ${
                  isActive
                    ? 'bg-[#1a2030] text-blue-400 border border-white/[0.1]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#121622]'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {/* Quiet Floating tooltip */}
                <span className="absolute left-14 px-2 py-1 bg-[#141824] text-slate-200 text-xs font-normal rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-white/[0.1] shadow-lg">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Utility Icons */}
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => setActiveTab('dashboard')}
          title="Settings"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-[#121622] transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')}
          title="System Online"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-[#121622] transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
}
