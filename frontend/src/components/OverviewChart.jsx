import React, { useState } from 'react';

export default function OverviewChart({ hourlyData }) {
  const [activeTab, setActiveTab] = useState('water'); // 'et0', 'rainfall', 'water', 'inr'

  const points = hourlyData || [
    { time: '6 AM', et0: 1.8, rainfall: 4.5, waterSaved: 120000, inrSaved: 4200 },
    { time: '9 AM', et0: 2.4, rainfall: 8.2, waterSaved: 175000, inrSaved: 6112 },
    { time: '12 PM', et0: 4.1, rainfall: 14.2, waterSaved: 246500, inrSaved: 8609 }, // Peak
    { time: '3 PM', et0: 3.8, rainfall: 6.0, waterSaved: 190000, inrSaved: 6640 },
    { time: '6 PM', et0: 2.2, rainfall: 2.1, waterSaved: 140000, inrSaved: 4890 },
    { time: '9 PM', et0: 1.2, rainfall: 0.5, waterSaved: 75000, inrSaved: 2620 },
    { time: '12 AM', et0: 0.8, rainfall: 0.0, waterSaved: 0, inrSaved: 0 }
  ];

  // Configure metrics based on active tab
  let metricKey = 'waterSaved';
  let unit = 'L';
  let maxY = 300000;
  let peakIndex = 2; // 12 PM is peak
  let peakLabel = '246,500 L';
  let title = 'Liters Conserved';

  if (activeTab === 'et0') {
    metricKey = 'et0';
    unit = 'mm/d';
    maxY = 6.0;
    peakIndex = 2;
    peakLabel = '4.1 mm/d';
    title = 'Evapotranspiration (ET₀)';
  } else if (activeTab === 'rainfall') {
    metricKey = 'rainfall';
    unit = 'mm';
    maxY = 16.0;
    peakIndex = 2;
    peakLabel = '14.2 mm';
    title = 'Precipitation Depth';
  } else if (activeTab === 'inr') {
    metricKey = 'inrSaved';
    unit = '₹';
    maxY = 10000;
    peakIndex = 2;
    peakLabel = '₹ 8,609';
    title = 'Budget Saved';
  }

  // Calculate coordinates for SVG Spline
  const width = 640;
  const height = 180;
  const paddingX = 40;
  const paddingY = 30;

  const getX = (idx) => paddingX + (idx / (points.length - 1)) * (width - paddingX * 2);
  const getY = (val) => height - paddingY - (val / maxY) * (height - paddingY * 2);

  // Generate SVG Path using Catmull-Rom or cubic Bezier for smooth spline
  const coords = points.map((p, idx) => ({
    x: getX(idx),
    y: getY(p[metricKey])
  }));

  let pathD = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i === 0 ? 0 : i - 1];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`;
  const peakCoord = coords[peakIndex];

  return (
    <div className="p-6 rounded-2xl bg-[#11141c] border border-white/[0.08] flex flex-col justify-between shadow-sm">
      {/* Top Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">Overview Analytics</h3>
          <p className="text-xs text-slate-400 mt-0.5">Continuous 24-hour predictive curve (Pune Climate Engine)</p>
        </div>

        {/* Filter Tabs / Pills */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0b0d14] border border-white/[0.08]">
          {[
            { id: 'water', label: 'Water saved' },
            { id: 'et0', label: 'ET₀ moisture' },
            { id: 'rainfall', label: 'Rainfall' },
            { id: 'inr', label: 'Tariff cost' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1a2030] text-white border border-white/[0.08]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Spline Chart */}
      <div className="relative w-full h-[190px] overflow-visible">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          {[0.25, 0.5, 0.75].map((pct, i) => {
            const y = height - paddingY - pct * (height - paddingY * 2);
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Bottom baseline */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />

          {/* Area Fill */}
          <path d={areaD} fill="url(#curveGradient)" />

          {/* Crisp Stroke Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {coords.map((c, i) => (
            <circle
              key={i}
              cx={c.x}
              cy={c.y}
              r={i === peakIndex ? 5 : 3}
              fill={i === peakIndex ? '#FFFFFF' : '#60a5fa'}
              stroke="#0b0d14"
              strokeWidth="2"
            />
          ))}

          {/* X Axis Time Labels */}
          {points.map((p, idx) => (
            <text
              key={idx}
              x={getX(idx)}
              y={height - 8}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="400"
            >
              {p.time}
            </text>
          ))}
        </svg>

        {/* Quiet Peak Tooltip */}
        {peakCoord && (
          <div
            className="absolute pointer-events-none transform -translate-x-1/2 flex flex-col items-center z-20"
            style={{
              left: `${(peakCoord.x / width) * 100}%`,
              top: `${(peakCoord.y / height) * 100 - 32}px`
            }}
          >
            <div className="px-2.5 py-0.5 rounded bg-[#1a2030] text-white font-mono text-[11px] border border-white/[0.12] shadow-md whitespace-nowrap tabular-nums">
              {peakLabel}
            </div>
            <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-t-[4px] border-l-transparent border-r-transparent border-t-[#1a2030]"></div>
          </div>
        )}
      </div>

      {/* Bottom Pune Regional Climate Insights Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 mt-1 border-t border-white/[0.06] text-xs">
        <div className="p-2.5 rounded-lg bg-[#1a2030]/60 border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 block">Peak ET₀ window</span>
          <span className="font-medium text-white tabular-nums">12:00 PM – 2:30 PM (Solar Noon)</span>
        </div>
        <div className="p-2.5 rounded-lg bg-[#1a2030]/60 border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 block">Municipal avoidance</span>
          <span className="font-medium text-[#4cc38a] tabular-nums font-mono">₹8,609 (PMC Water Tariff)</span>
        </div>
        <div className="p-2.5 rounded-lg bg-[#1a2030]/60 border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 block">Runoff prevention</span>
          <span className="font-medium text-slate-200 tabular-nums">94.2% Municipal efficiency</span>
        </div>
      </div>
    </div>
  );
}
