import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardHome from './components/DashboardHome';
import MapView from './components/MapView';
import ForecastView from './components/ForecastView';
import SimulationView from './components/SimulationView';
import AnalyticsView from './components/AnalyticsView';
import SimulationModal from './components/SimulationModal';
import AddParkModal from './components/AddParkModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'parks' | 'schedule' | 'simulate' | 'analytics'
  const [weather, setWeather] = useState(null);
  const [parks, setParks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParkForMap, setSelectedParkForMap] = useState(null);

  // Modals state
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [isAddParkOpen, setIsAddParkOpen] = useState(false);

  // Fetch all initial data concurrently
  const loadData = async () => {
    try {
      const [weatherRes, parksRes, summaryRes, hourlyRes] = await Promise.all([
        fetch('/api/weather/live'),
        fetch('/api/parks'),
        fetch('/api/metrics/summary'),
        fetch('/api/analytics/hourly')
      ]);

      if (weatherRes.ok) {
        const wData = await weatherRes.json();
        setWeather(wData);
      }
      if (parksRes.ok) {
        const pData = await parksRes.json();
        setParks(pData);
      }
      if (summaryRes.ok) {
        const sData = await summaryRes.json();
        setSummary(sData);
      }
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

    // Deep-linking / URL query param modal trigger for demos
    const params = new URLSearchParams(window.location.search);
    const modalParam = params.get('modal');
    const tabParam = params.get('tab');
    if (tabParam && ['dashboard', 'parks', 'schedule', 'simulate', 'analytics'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    if (modalParam === 'simulate') setIsSimulateOpen(true);
    if (modalParam === 'addpark') setIsAddParkOpen(true);

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

  // When a park is selected from search or list, focus on it in the map
  const handleSelectParkFromSearch = (park) => {
    setSelectedParkForMap(park.id);
    setActiveTab('parks');
  };

  return (
    <div className="min-h-screen bg-[#0e121a] text-slate-100 flex flex-row font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Functional Left Navigation Rail (Switches between dedicated views!) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header with Functional Interactive Search Bar */}
        <Header
          weather={weather}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          parks={parks}
          onSelectPark={handleSelectParkFromSearch}
          onOpenSimulate={() => setActiveTab('simulate')}
        />

        {/* Dynamic Main Body: Separate dedicated view based on activeTab */}
        <main className="p-4 md:p-6 lg:p-8 max-w-[1700px] w-full mx-auto">
          {/* TAB 1: Modern Frontpage & Overview */}
          {activeTab === 'dashboard' && (
            <DashboardHome
              weather={weather}
              parks={parks}
              summary={summary}
              onTogglePark={handleTogglePark}
              onOpenAddPark={() => setIsAddParkOpen(true)}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 2: Dedicated Full Pune Regional Map View */}
          {activeTab === 'parks' && (
            <MapView
              parks={parks}
              onTogglePark={handleTogglePark}
              selectedParkId={selectedParkForMap}
              onSelectPark={(p) => setSelectedParkForMap(p.id)}
            />
          )}

          {/* TAB 3: Dedicated Microclimate & 24h / 7-Day Forecast View */}
          {activeTab === 'schedule' && (
            <ForecastView
              weather={weather}
              parks={parks}
            />
          )}

          {/* TAB 4: Dedicated Judges' Live Simulation Lab View */}
          {activeTab === 'simulate' && (
            <SimulationView
              onSimulationApplied={loadData}
            />
          )}

          {/* TAB 5: Dedicated Water, Energy & Tariff Audit Analytics View */}
          {activeTab === 'analytics' && (
            <AnalyticsView
              summary={summary}
              hourlyData={hourlyData}
              parks={parks}
            />
          )}
        </main>
      </div>

      {/* 3. Helper Modals */}
      <SimulationModal
        isOpen={isSimulateOpen}
        onClose={() => setIsSimulateOpen(false)}
        onRunSimulation={loadData}
      />

      <AddParkModal
        isOpen={isAddParkOpen}
        onClose={() => setIsAddParkOpen(false)}
        onParkAdded={loadData}
      />
    </div>
  );
}
