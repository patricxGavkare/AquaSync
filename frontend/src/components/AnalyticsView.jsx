import React from 'react';
import { BarChart3, TrendingUp, IndianRupee, Zap, Droplets, Leaf, FileSpreadsheet, ShieldCheck } from 'lucide-react';
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-blue-950/30 to-[#1c2230] border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Municipal Water, Energy & Carbon Abatement Audit
            </h2>
            <p className="text-sm text-slate-300 mt-0.5">
              Official Pune Municipal Corporation (₹32/kL) and MSEDCL Commercial LT-III (₹6.50/kWh) tariff accounting model.
            </p>
          </div>
        </div>

        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#202738] hover:bg-[#283145] text-slate-200 border border-[#2d354a] text-xs font-semibold transition-colors cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export Audit Report</span>
        </button>
      </div>

      {/* KPI Metrics Row */}
      <KpiMetrics summary={summary} />

      {/* Interactive Spline Chart */}
      <OverviewChart hourlyData={hourlyData} />

      {/* Detailed Landmark Municipal Ledger Table */}
      <div className="p-6 rounded-3xl bg-[#1c2230] border border-[#262c3d] overflow-hidden">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Landmark Park Savings Ledger (Official PMC Breakdown)</h3>
          </div>
          <span className="text-xs text-slate-400">Audited Daily Cycle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-[#151923] border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Municipal Park</th>
                <th className="py-3 px-4">Turf Area</th>
                <th className="py-3 px-4">Water Conserved</th>
                <th className="py-3 px-4">PMC Water Saved</th>
                <th className="py-3 px-4">MSEDCL Power Saved</th>
                <th className="py-3 px-4">CO₂ Offset</th>
                <th className="py-3 px-4">Valve Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#202636] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{row.park}</div>
                    <div className="text-[10px] text-slate-400">{row.zone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium">{row.area}</td>
                  <td className="py-3.5 px-4 font-bold text-cyan-400">{row.waterSaved}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">{row.waterCostSaved}</td>
                  <td className="py-3.5 px-4 font-medium text-amber-300">{row.powerSaved} ({row.powerCostSaved})</td>
                  <td className="py-3.5 px-4 text-emerald-300 font-medium">{row.co2Saved}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      row.status === 'PUMP HALTED'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
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