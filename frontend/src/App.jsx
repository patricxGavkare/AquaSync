import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KpiMetrics from './components/KpiMetrics';
import HeroCard from './components/HeroCard';
import ParkCards from './components/ParkCards';
import ForecastCard from './components/ForecastCard';
import PuneMap from './components/PuneMap';
import OverviewChart from './components/OverviewChart';
import SimulationModal from './components/SimulationModal';
import WatchmanModal from './components/WatchmanModal';
import AddParkModal from './components/AddParkModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weather, setWeather] = useState(null);
  const [parks, setParks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);

  // Modals state
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [isWatchmanOpen, setIsWatchmanOpen] = useState(false);
  const [isAddParkOpen, setIsAddParkOpen] = useState(false);
  const [selectedParkForWatchman, setSelectedParkForWatchman] = useState(null);

  // Fetch all initial data
  const loadData = async () => {
    try {
      // 1. Live Weather
      const weatherRes = await fetch('/api/weather/live');
      if (weatherRes.ok) {
        const wData = await weatherRes.json();
        setWeather(wData);
      }

      // 2. Parks
      const parksRes = await fetch('/api/parks');
      if (parksRes.ok) {
        const pData = await parksRes.json();
        setParks(pData);
      }

      // 3. Metrics Summary
      const summaryRes = await fetch('/api/metrics/summary');
      if (summaryRes.ok) {
        const sData = await summaryRes.json();
        setSummary(sData);
      }

      // 4. Hourly Analytics
      const hourlyRes = await fetch('/api/analytics/hourly');
      if (hourlyRes.ok) {
        const hData = await hourlyRes.json();
        setHourlyData(hData.timeline);
      }
    } catch (err) {
      console.error('Failed to load AquaSync dashboard data:', err);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle manual or automatic pump toggle
  const handleTogglePark = async (parkId) => {
    try {
      const res = await fetch(`/api/parks/${parkId}/toggle`, { method: 'POST' });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  // Open watchman modal for specific park
  const handleOpenWatchman = (park) => {
    setSelectedParkForWatchman(park || (parks && parks[0]));
    setIsWatchmanOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0e121a] text-slate-100 flex flex-row font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Slim Left Navigation Rail (Matching reference mockup!) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSimulate={() => setIsSimulateOpen(true)}
        onOpenWatchman={() => handleOpenWatchman()}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <Header
          weather={weather}
          onOpenSimulate={() => setIsSimulateOpen(true)}
          onOpenWatchman={() => handleOpenWatchman()}
        />

        {/* Dashboard Grid Container */}
        <main className="p-4 md:p-6 space-y-5 max-w-[1700px] w-full mx-auto">
          {/* Top Executive KPI Metric Cards */}
          <KpiMetrics summary={summary} />

          {/* Main Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column (Span 4 of 12) -> Hero Card + 3 Landmark Parks */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Vibrant Blue Hero Card (Direct match to reference image!) */}
              <HeroCard weather={weather} />

              {/* Landmark Park Cards */}
              <ParkCards
                parks={parks}
                onTogglePark={handleTogglePark}
                onOpenAddPark={() => setIsAddParkOpen(true)}
                onOpenWatchman={handleOpenWatchman}
              />
            </div>

            {/* Right Column (Span 8 of 12) -> Forecast + Map + Spline Chart */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              {/* Top Row: Forecast (Left) + Pune Map (Right) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 24-Hour Forecast Card (Matching reference mockup!) */}
                <ForecastCard weather={weather} />

                {/* Interactive Pune Leaflet Map (Strictly Pune bounded!) */}
                <PuneMap
                  parks={parks}
                  onSelectPark={(p) => handleOpenWatchman(p)}
                />
              </div>

              {/* Bottom Row: Smooth Glowing Spline Chart (Direct match to reference mockup!) */}
              <OverviewChart hourlyData={hourlyData} />
            </div>
          </div>
        </main>
      </div>

      {/* 3. Interactive Modals for Demo & Presentation */}
      <SimulationModal
        isOpen={isSimulateOpen}
        onClose={() => setIsSimulateOpen(false)}
        onRunSimulation={loadData}
      />

      <WatchmanModal
        isOpen={isWatchmanOpen}
        onClose={() => setIsWatchmanOpen(false)}
        selectedPark={selectedParkForWatchman}
        onAcknowledgeSuccess={loadData}
      />

      <AddParkModal
        isOpen={isAddParkOpen}
        onClose={() => setIsAddParkOpen(false)}
        onParkAdded={loadData}
      />
    </div>
  );
}
