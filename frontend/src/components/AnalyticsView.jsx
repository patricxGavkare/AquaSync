import React from 'react';
import { BarChart3, TrendingUp, FileSpreadsheet } from 'lucide-react';
import OverviewChart from './OverviewChart';
import KpiMetrics from './KpiMetrics';

export default function AnalyticsView({ summary, hourlyData, parks }) {
  const tableData = [
    {
      park: 'Sarasbaug Municipal Garden',
      zone: 'Swargate (South Pune)',
      area: '50,000 m²',
      waterSaved: '175,000 L',
      waterCostSaved: '₹ 5,600',
      powerSaved: '78.8 kWh',
      powerCostSaved: '₹ 512',
      co2Saved: '64.6 kg',
      status: 'PUMP HALTED'
    },
    {
      park: 'Chhatrapati Sambhaji Garden',
      zone: 'JM Road (Central Pune)',
      area: '25,000 m²',
      waterSaved: '0 L',
      waterCostSaved: '₹ 0',
      powerSaved: '0.0 kWh',
      powerCostSaved: '₹ 0',
      co2Saved: '0.0 kg',
      status: 'SCHEDULED'
    },
    {
      park: 'Pu La Deshpande Japanese Garden',
      zone: 'Sinhagad Road (West Pune)',
      area: '22,000 m²',
      waterSaved: '71,500 L',
      waterCostSaved: '₹ 2,288',
      powerSaved: '32.1 kWh',
      powerCostSaved: '₹ 209',
      co2Saved: '26.3 kg',
      status: 'PUMP HALTED'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#11141c] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1a2030] border border-white/[0.08] flex items-center justify-center text-slate-300">
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">
              Municipal Water, Energy & Carbon Abatement Audit
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Official Pune Municipal Corporation (₹32/kL) and MSEDCL Commercial LT-III (₹6.50/kWh) tariff accounting model.
            </p>
          </div>
        </div>

        <button 
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a2030] hover:bg-[#232b40] text-slate-200 border border-white/[0.08] text-xs font-medium transition-colors cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
          <span>Export audit report</span>
        </button>
      </div>

      {/* KPI Metrics Row */}
      <KpiMetrics summary={summary} />

      {/* Interactive Spline Chart */}
      <OverviewChart hourlyData={hourlyData} />

      {/* Detailed Landmark Municipal Ledger Table */}
      <div className="p-6 rounded-2xl bg-[#11141c] border border-white/[0.08] overflow-hidden">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-white">Landmark Park Savings Ledger (Official PMC Breakdown)</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Audited daily cycle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-[#0b0d14] border-b border-white/[0.08]">
              <tr>
                <th className="py-2.5 px-3.5 font-medium">Municipal park</th>
                <th className="py-2.5 px-3.5 font-medium">Turf area</th>
                <th className="py-2.5 px-3.5 font-medium">Water conserved</th>
                <th className="py-2.5 px-3.5 font-medium">PMC water saved</th>
                <th className="py-2.5 px-3.5 font-medium">MSEDCL power saved</th>
                <th className="py-2.5 px-3.5 font-medium">CO₂ offset</th>
                <th className="py-2.5 px-3.5 font-medium">Valve status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#1a2030]/40 transition-colors">
                  <td className="py-3 px-3.5">
                    <div className="font-medium text-white">{row.park}</div>
                    <div className="text-[10px] text-slate-400">{row.zone}</div>
                  </td>
                  <td className="py-3 px-3.5 font-mono tabular-nums">{row.area}</td>
                  <td className="py-3 px-3.5 font-mono tabular-nums text-white font-medium">{row.waterSaved}</td>
                  <td className="py-3 px-3.5 font-mono tabular-nums text-[#4cc38a] font-medium">{row.waterCostSaved}</td>
                  <td className="py-3 px-3.5 font-mono tabular-nums text-amber-300">{row.powerSaved} ({row.powerCostSaved})</td>
                  <td className="py-3 px-3.5 font-mono tabular-nums text-slate-300">{row.co2Saved}</td>
                  <td className="py-3 px-3.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded ${
                      row.status === 'PUMP HALTED'
                        ? 'bg-[#e5484d]/10 text-[#ff8585] border border-[#e5484d]/25'
                        : 'bg-[#4cc38a]/10 text-[#4cc38a] border border-[#4cc38a]/25'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${row.status === 'PUMP HALTED' ? 'bg-[#e5484d]' : 'bg-[#4cc38a]'}`}></span>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
