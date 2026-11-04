import React from 'react';
import { 
  Droplets, 
  LayoutGrid, 
  MapPin, 
  Calendar, 
  Sliders, 
  BarChart3, 
  Smartphone, 
  Settings, 
  LogOut 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenSimulate, onOpenWatchman }) {
  const navItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'parks', icon: MapPin, label: 'Pune Parks' },
    { id: 'schedule', icon: Calendar, label: 'Irrigation Schedules' },
    { id: 'simulate', icon: Sliders, label: 'AI Simulation Lab', action: onOpenSimulate },
    { id: 'analytics', icon: BarChart3, label: 'Water Analytics' },
    { id: 'watchman', icon: Smartphone, label: 'Ground Staff Mobile', action: onOpenWatchman },
  ];

  return (
    <aside className="w-16 md:w-20 bg-[#161a23] border-r border-[#262c3d] flex flex-col items-center py-6 justify-between shrink-0 min-h-screen">
      {/* Top Logo */}
      <div className="flex flex-col items-center gap-6">
        <div 
          className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 cursor-pointer hover:scale-105 transition-transform"
          title="AquaSync - Pune Municipal Irrigation Control"
        >
          <Droplets className="w-6 h-6 text-white" />
        </div>

        {/* Navigation Icon List */}
        <nav className="flex flex-col gap-3 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                title={item.label}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all group relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-[#202636]'
                }`}
              >
                <Icon className="w-5 h-5" />
                {/* Floating tooltip */}
                <span className="absolute left-16 px-2.5 py-1 bg-slate-900 text-slate-200 text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-700 shadow-xl">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Utility Icons */}
      <div className="flex flex-col gap-3">
        <button 
          title="Settings"
          className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#202636] transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button 
          title="Exit Session"
          className="w-11 h-11 rounded-xl flex items-center justify-center text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
