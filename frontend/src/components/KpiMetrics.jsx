import React from 'react';
import { Droplet, Zap, IndianRupee, Leaf } from 'lucide-react';

export default function KpiMetrics({ summary }) {
  const metrics = [
    {
      title: 'Water Saved Today',
      value: summary ? `${summary.totalLitersSaved.toLocaleString()} L` : '246,500 L',
      subtext: `${summary ? summary.activeOverridesCount : 2} of 3 Parks Overridden`,
      icon: Droplet,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10 border-cyan-500/20',
      trend: '+100% vs Timer Sched'
    },
    {
      title: 'Grid Energy Conserved',
      value: summary ? `${summary.totalKwhSaved} kWh` : '110.9 kWh',
      subtext: '0.45 kWh per 1,000L Pumped',
      icon: Zap,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      trend: 'MSEDCL LT-III Tariff'
    },
    {
      title: 'Municipal Budget Saved',
      value: summary ? `₹ ${summary.totalInrSaved.toLocaleString()}` : '₹ 8,609',
      subtext: '₹32/kL Water + ₹6.5/kWh Power',
      icon: IndianRupee,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      trend: 'Zero Chemical Waste'
    },
    {
      title: 'CO₂ Emissions Abated',
      value: summary ? `${summary.co2KgSaved} kg` : '90.9 kg',
      subtext: 'Maharashtra Grid Factor: 0.82',
      icon: Leaf,
      iconColor: 'text-emerald-300',
      iconBg: 'bg-emerald-600/10 border-emerald-600/20',
      trend: 'Urban Sustainability'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div 
            key={idx}
            className="p-4 rounded-2xl bg-[#1c2230] border border-[#262c3d] flex flex-col justify-between hover:border-slate-600/60 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{m.title}</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${m.iconBg}`}>
                <Icon className={`w-4 h-4 ${m.iconColor}`} />
              </div>
            </div>

            <div>
              <div className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                {m.value}
              </div>
              <div className="flex items-center justify-between mt-1 text-[11px]">
                <span className="text-slate-400">{m.subtext}</span>
                <span className="text-emerald-400 font-medium">{m.trend}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
