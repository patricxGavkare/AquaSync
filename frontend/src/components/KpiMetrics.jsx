import React from 'react';

export default function KpiMetrics({ summary }) {
  const metrics = [
    {
      title: 'Water conserved today',
      value: summary ? `${summary.totalLitersSaved.toLocaleString()} L` : '175,000 L',
      subtext: `${summary ? summary.activeOverridesCount : 2} of 3 relays halted`,
      comparison: '100% saved vs timer'
    },
    {
      title: 'Grid energy conserved',
      value: summary ? `${summary.totalKwhSaved} kWh` : '78.75 kWh',
      subtext: '0.45 kWh per 1,000 L',
      comparison: 'MSEDCL LT-III'
    },
    {
      title: 'Municipal budget saved',
      value: summary ? `₹ ${summary.totalInrSaved.toLocaleString()}` : '₹ 6,111',
      subtext: '₹32/kL water + ₹6.50/kWh',
      comparison: 'Audited tariff'
    },
    {
      title: 'CO₂ emissions abated',
      value: summary ? `${summary.co2KgSaved} kg` : '64.58 kg',
      subtext: 'Maharashtra grid factor: 0.82',
      comparison: 'Carbon offset'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {metrics.map((m, idx) => (
        <div 
          key={idx}
          className="p-4 rounded-2xl bg-[#11141c] border border-white/[0.08] flex flex-col justify-between"
        >
          <div className="text-xs text-slate-400 font-normal mb-2">
            {m.title}
          </div>

          <div>
            <div className="text-2xl font-medium text-white tracking-tight tabular-nums">
              {m.value}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06] text-[11px]">
              <span className="text-slate-500">{m.subtext}</span>
              <span className="text-[#4cc38a] font-medium">{m.comparison}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
