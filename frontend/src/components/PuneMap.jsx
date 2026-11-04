import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

// Fix default Leaflet icon paths in React/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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
    label = '📱';
  }

  const svgHtml = `
    <div style="
      position: relative;
      width: 34px;
      height: 34px;
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
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34]
  });
};

export default function PuneMap({ parks, onSelectPark }) {
  // Center of Pune Municipal Corporation (PMC)
  const puneCenter = [18.5150, 73.8450];
  const zoomLevel = 13;

  return (
    <div className="rounded-3xl p-5 bg-[#1c2230] border border-[#262c3d] flex flex-col justify-between shadow-sm relative overflow-hidden h-full min-h-[300px]">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3 z-10">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Pune Regional Park Relays
          </h3>
        </div>
        <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded-full bg-[#151923] border border-[#2d354a]">
          Strict Pune Bounds (18.52° N, 73.85° E)
        </span>
      </div>

      {/* Leaflet Map Container */}
      <div className="w-full flex-1 rounded-2xl overflow-hidden border border-[#283042] min-h-[220px] relative z-0">
        <MapContainer
          center={puneCenter}
          zoom={zoomLevel}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', minHeight: '220px' }}
        >
          {/* Dark Matter Tiles from CartoDB */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
                    fillOpacity: 0.15,
                    weight: 1.5,
                    dashArray: isOverridden ? '4, 4' : null
                  }}
                />

                <Marker
                  position={[park.latitude, park.longitude]}
                  icon={createCustomIcon(park.status)}
                >
                  <Popup>
                    <div className="text-slate-100 p-1 min-w-[190px]">
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
                            {park.status === 'OVERRIDDEN' ? 'PUMP HALTED' : park.status}
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
                        <div className="flex justify-between border-t border-slate-700/40 pt-1 mt-1 text-[10px]">
                          <span className="text-slate-400">Watchman:</span>
                          <span className="text-slate-300">{park.watchman_name}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Floating Pune Map Legend / Status Pill (Matching reference mockup!) */}
        <div className="absolute bottom-3 left-3 bg-[#11141d]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#2d354a] text-[11px] text-white flex items-center gap-3 z-[400] shadow-xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-slate-300">Override (Halted)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Scheduled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
