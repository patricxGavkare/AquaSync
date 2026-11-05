import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, MapPin, Layers, Power, RefreshCw, ZoomIn } from 'lucide-react';

// Fix default Leaflet icon paths in React/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Auto-Recenter and Resize Component to eliminate map layout bugs
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (center) {
        map.flyTo(center, zoom, { duration: 1.2 });
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [center, zoom, map]);
  return null;
}

// Custom colored SVG pin creators
const createCustomIcon = (status) => {
  let color = '#10B981'; // Green (Scheduled)
  let glow = 'rgba(16, 185, 129, 0.4)';
  let label = '✓';

  if (status === 'OVERRIDDEN') {
    color = '#F43F5E'; // Red/Rose (Override)
    glow = 'rgba(244, 63, 94, 0.5)';
    label = '🛑';
  } else if (status === 'ALERT') {
    color = '#06B6D4'; // Cyan (Alert)
    glow = 'rgba(6, 182, 212, 0.5)';
    label = '⚡';
  }

  const svgHtml = `
    <div style="
      position: relative;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #11141d;
      border: 2px solid ${color};
      border-radius: 50%;
      box-shadow: 0 0 16px ${glow};
      font-size: 14px;
      cursor: pointer;
    ">
      <span>${label}</span>
      <div style="
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 6px solid ${color};
      "></div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-pune-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

export default function PuneMap({ 
  parks = [], 
  onSelectPark, 
  onTogglePark, 
  isFullView = false, 
  selectedParkId = null 
}) {
  const [activeCenter, setActiveCenter] = useState([18.5150, 73.8450]);
  const [activeZoom, setActiveZoom] = useState(isFullView ? 14 : 13);
  const [tileStyle, setTileStyle] = useState('dark'); // 'dark' | 'standard'

  // Update center when selectedParkId changes
  useEffect(() => {
    if (selectedParkId && parks.length > 0) {
      const match = parks.find(p => p.id === selectedParkId);
      if (match) {
        setActiveCenter([match.latitude, match.longitude]);
        setActiveZoom(15);
      }
    }
  }, [selectedParkId, parks]);

  return (
    <div className={`rounded-3xl p-5 bg-[#1c2230] border border-[#262c3d] flex flex-col justify-between shadow-sm relative overflow-hidden ${
      isFullView ? 'h-[620px]' : 'h-full min-h-[300px]'
    }`}>
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3 z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            {isFullView ? 'Pune Municipal Corporation (PMC) Regional Irrigation Relays' : 'Pune Regional Park Relays'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Tile Switcher */}
          <button
            onClick={() => setTileStyle(tileStyle === 'dark' ? 'standard' : 'dark')}
            className="text-[11px] font-medium text-slate-300 px-2.5 py-1 rounded-xl bg-[#151923] border border-[#2d354a] hover:border-slate-500 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Toggle Map Styling"
          >
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>{tileStyle === 'dark' ? 'Dark Cyber View' : 'Standard Street View'}</span>
          </button>

          <span className="text-[11px] font-medium text-slate-400 px-2.5 py-1 rounded-xl bg-[#151923] border border-[#2d354a]">
            Strict Pune Bounds (18.52° N, 73.85° E)
          </span>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="w-full flex-1 rounded-2xl overflow-hidden border border-[#283042] relative z-0 min-h-[220px]">
        <MapContainer
          center={activeCenter}
          zoom={activeZoom}
          scrollWheelZoom={true}
          attributionControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <MapController center={activeCenter} zoom={activeZoom} />

          {/* Clean High-Resolution OpenStreetMap Tiles with Optional Dark Theme Filter */}
          <TileLayer
            className={tileStyle === 'dark' ? 'invert-[1] hue-rotate-[180deg] brightness-[0.9] contrast-[0.95]' : ''}
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={18}
          />

          {parks && parks.map((park) => {
            const isOverridden = park.status === 'OVERRIDDEN';
            const circleColor = isOverridden ? '#F43F5E' : (park.status === 'ALERT' ? '#06B6D4' : '#10B981');

            return (
              <React.Fragment key={park.id}>
                <Circle
                  center={[park.latitude, park.longitude]}
                  radius={isOverridden ? 550 : 400}
                  pathOptions={{
                    color: circleColor,
                    fillColor: circleColor,
                    fillOpacity: 0.18,
                    weight: 2,
                    dashArray: isOverridden ? '4, 4' : null
                  }}
                />

                <Marker
                  position={[park.latitude, park.longitude]}
                  icon={createCustomIcon(park.status)}
                  eventHandlers={{
                    click: () => {
                      if (onSelectPark) onSelectPark(park);
                    }
                  }}
                >
                  <Popup>
                    <div className="text-slate-100 p-1 min-w-[210px]">
                      <div className="font-bold text-sm text-white border-b border-slate-700/60 pb-1 mb-1.5 flex items-center justify-between">
                        <span>{park.name}</span>
                      </div>
                      
                      <div className="text-[11px] space-y-1 text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Zone:</span>
                          <span className="font-medium text-slate-200">{park.zone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status:</span>
                          <span className={`font-semibold ${isOverridden ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {isOverridden ? 'PUMP HALTED (SAVED)' : 'SCHEDULED'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Rain Expected:</span>
                          <span className="text-white font-medium">{park.rain_expected_mm} mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Water Saved:</span>
                          <span className="text-cyan-400 font-bold">
                            {park.liters_saved_today.toLocaleString()} L
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Irrigated Turf:</span>
                          <span className="text-slate-200">{(park.irrigated_area_sqm / 1000).toFixed(0)}k m²</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-700/40 pt-1 mt-1 text-[10px]">
                          <span className="text-slate-400">Assigned Staff:</span>
                          <span className="text-slate-300">{park.watchman_name}</span>
                        </div>
                      </div>

                      {onTogglePark && (
                        <button
                          onClick={() => onTogglePark(park.id)}
                          className={`w-full mt-2 py-1 px-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                            isOverridden
                              ? 'bg-rose-900/80 hover:bg-rose-800 text-rose-200'
                              : 'bg-blue-600 hover:bg-blue-500 text-white'
                          }`}
                        >
                          {isOverridden ? 'Resume Normal Timer' : 'Emergency Override'}
                        </button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Floating Map Legend (Watermark-Free, Clean) */}
        <div className="absolute bottom-3 left-3 bg-[#11141d]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#2d354a] text-[11px] text-white flex items-center gap-3 z-[400] shadow-xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-300">Override Halted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Scheduled</span>
          </div>
        </div>

        {/* Floating Pune Quick Stats Pill (Matching Reference Mockup!) */}
        <div className="absolute top-3 right-3 bg-[#11141d]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#2d354a] z-[400] shadow-xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-bold text-white">24° Pune</span>
          <span className="text-[10px] text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">AI Mesh Active</span>
        </div>
      </div>
    </div>
  );
}
