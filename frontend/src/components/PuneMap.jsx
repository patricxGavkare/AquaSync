import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Layers, Power } from 'lucide-react';

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

// Custom SVG pin creators without emojis
const createCustomIcon = (status) => {
  let color = '#4cc38a'; // Scheduled (Green)
  let innerDot = '#4cc38a';

  if (status === 'OVERRIDDEN') {
    color = '#e5484d'; // Override Halted (Crimson)
    innerDot = '#e5484d';
  } else if (status === 'ALERT') {
    color = '#3b82f6'; // Alert
    innerDot = '#3b82f6';
  }

  const svgHtml = `
    <div style="
      position: relative;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #11141c;
      border: 2px solid ${color};
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      cursor: pointer;
    ">
      <div style="
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${innerDot};
      "></div>
      <div style="
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid ${color};
      "></div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-pune-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
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
    <div className={`rounded-2xl p-5 bg-[#11141c] border border-white/[0.08] flex flex-col justify-between shadow-sm relative overflow-hidden ${
      isFullView ? 'h-[620px]' : 'h-full min-h-[300px]'
    }`}>
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3 z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-white tracking-tight">
            {isFullView ? 'Pune Municipal Corporation (PMC) Regional Irrigation Relays' : 'Pune Regional Park Relays'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Tile Switcher */}
          <button
            onClick={() => setTileStyle(tileStyle === 'dark' ? 'standard' : 'dark')}
            className="text-[11px] font-medium text-slate-300 px-2.5 py-1 rounded-md bg-[#1a2030] border border-white/[0.08] hover:border-white/[0.18] transition-colors cursor-pointer flex items-center gap-1.5"
            title="Toggle map style"
          >
            <Layers className="w-3 h-3 text-slate-400" />
            <span>{tileStyle === 'dark' ? 'Dark View' : 'Standard View'}</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400 px-2.5 py-1 rounded-md bg-[#1a2030] border border-white/[0.08]">
            Pune (18.52° N, 73.85° E)
          </span>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="w-full flex-1 rounded-xl overflow-hidden border border-white/[0.08] relative z-0 min-h-[220px]">
        <MapContainer
          center={activeCenter}
          zoom={activeZoom}
          scrollWheelZoom={true}
          attributionControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <MapController center={activeCenter} zoom={activeZoom} />

          <TileLayer
            className={tileStyle === 'dark' ? 'invert-[1] hue-rotate-[180deg] brightness-[0.88] contrast-[0.95]' : ''}
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={18}
          />

          {parks && parks.map((park) => {
            const isOverridden = park.status === 'OVERRIDDEN';
            const circleColor = isOverridden ? '#e5484d' : (park.status === 'ALERT' ? '#3b82f6' : '#4cc38a');

            return (
              <React.Fragment key={park.id}>
                <Circle
                  center={[park.latitude, park.longitude]}
                  radius={isOverridden ? 500 : 400}
                  pathOptions={{
                    color: circleColor,
                    fillColor: circleColor,
                    fillOpacity: 0.15,
                    weight: 1.5,
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
                      <div className="font-semibold text-sm text-white border-b border-white/[0.1] pb-1 mb-1.5 flex items-center justify-between">
                        <span>{park.name}</span>
                      </div>
                      
                      <div className="text-[11px] space-y-1 text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Zone:</span>
                          <span className="font-medium text-slate-200">{park.zone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status:</span>
                          <span className={`font-medium ${isOverridden ? 'text-[#ff8585]' : 'text-[#4cc38a]'}`}>
                            {isOverridden ? 'Pumps Halted' : 'Scheduled'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Rain Expected:</span>
                          <span className="text-white font-medium tabular-nums">{park.rain_expected_mm} mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Water Saved:</span>
                          <span className="text-[#4cc38a] font-medium tabular-nums">
                            {park.liters_saved_today.toLocaleString()} L
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Irrigated Turf:</span>
                          <span className="text-slate-200 tabular-nums font-mono">{(park.irrigated_area_sqm / 1000).toFixed(0)}k m²</span>
                        </div>
                        <div className="flex justify-between border-t border-white/[0.06] pt-1 mt-1 text-[10px]">
                          <span className="text-slate-400">Assigned Staff:</span>
                          <span className="text-slate-300">{park.watchman_name}</span>
                        </div>
                      </div>

                      {onTogglePark && (
                        <button
                          onClick={() => onTogglePark(park.id)}
                          className={`w-full mt-2 py-1 px-2 rounded text-xs font-medium cursor-pointer transition-colors ${
                            isOverridden
                              ? 'bg-[#e5484d]/20 hover:bg-[#e5484d]/30 text-[#ff8585] border border-[#e5484d]/30'
                              : 'bg-white hover:bg-slate-200 text-[#0b0d14]'
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

        {/* Floating Map Legend */}
        <div className="absolute bottom-3 left-3 bg-[#11141c]/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/[0.08] text-[11px] text-white flex items-center gap-3 z-[400] shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#e5484d]"></span>
            <span className="text-slate-300">Override Halted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4cc38a]"></span>
            <span className="text-slate-300">Scheduled</span>
          </div>
        </div>

        {/* Floating Quick Status Pill */}
        <div className="absolute top-3 right-3 bg-[#11141c]/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/[0.08] z-[400] shadow-md flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4cc38a]"></span>
          <span className="text-xs font-mono font-medium text-white tabular-nums">24° Pune</span>
          <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-[#1a2030] border border-white/[0.06]">Mesh Active</span>
        </div>
      </div>
    </div>
  );
}
