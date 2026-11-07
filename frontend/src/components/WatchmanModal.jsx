import React, { useState, useEffect } from 'react';
import { X, Smartphone, CloudRain, CheckCircle, Languages, MapPin } from 'lucide-react';

export default function WatchmanModal({ isOpen, onClose, selectedPark, onAcknowledgeSuccess }) {
  const [lang, setLang] = useState('mr'); // 'mr' (Marathi) or 'en' (English)
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);

  const park = selectedPark || {
    id: 'sarasbaug',
    name: 'Sarasbaug Municipal Garden',
    zone: 'Swargate (South Pune)',
    watchman_name: 'Pandurang More',
    water_need_liters: 175000,
    rain_expected_mm: 14.2,
    scheduled_time: '06:00 AM'
  };

  useEffect(() => {
    setAcknowledged(false);
  }, [park.id, isOpen]);

  if (!isOpen) return null;

  const handleAcknowledge = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/parks/${park.id}/acknowledge`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setAcknowledged(true);
        if (onAcknowledgeSuccess) onAcknowledgeSuccess(park.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#11141c] border border-white/[0.12] rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative p-4">
        {/* Smartphone Speaker notch */}
        <div className="w-20 h-3 bg-[#1a2030] rounded-full mx-auto mb-3 flex items-center justify-center">
          <div className="w-8 h-1 bg-slate-600 rounded-full"></div>
        </div>

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3 px-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span>AquaSync Ground Guard</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle Button */}
            <button
              onClick={() => setLang(lang === 'mr' ? 'en' : 'mr')}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1a2030] hover:bg-[#232b40] text-slate-200 text-[11px] font-medium border border-white/[0.08] transition-colors cursor-pointer"
            >
              <Languages className="w-3 h-3 text-slate-400" />
              <span>{lang === 'mr' ? 'मराठी' : 'English'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-6 h-6 rounded-md bg-[#1a2030] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Smartphone Screen Content */}
        <div className="space-y-3 px-1 py-1">
          {/* Watchman Greeting Card */}
          <div className="p-3 rounded-xl bg-[#1a2030]/60 border border-white/[0.06]">
            <span className="text-[11px] text-slate-400 block">
              {lang === 'mr' ? 'उद्यान सुरक्षारक्षक / माळी:' : 'Park Security / Gardener:'}
            </span>
            <span className="font-semibold text-white text-sm">{park.watchman_name}</span>
            <div className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{park.name} ({park.zone})</span>
            </div>
          </div>

          {/* Urgent Irrigation Override Alert Card */}
          <div className="p-3.5 rounded-xl bg-[#e5484d]/10 border border-[#e5484d]/25 space-y-2.5">
            <div className="flex items-center gap-2 text-[#ff8585] font-medium text-xs">
              <CloudRain className="w-4 h-4 text-[#e5484d]" />
              <span>
                {lang === 'mr' ? 'पाऊस येणार आहे - पंप बंद ठेवा' : 'Rain Alert: Keep Pump OFF'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'mr'
                ? `हवामान अंदाजानुसार पुढील काही तासांत सुमारे ${park.rain_expected_mm} मिमी पाऊस पडण्याची शक्यता आहे. सकाळी ${park.scheduled_time} चे पाणी देणे रद्द केले आहे.`
                : `Forecast indicates ~${park.rain_expected_mm} mm rainfall incoming. Scheduled watering for ${park.scheduled_time} has been halted by AI.`
              }
            </p>

            <div className="p-2.5 rounded-lg bg-[#0b0d14]/70 border border-white/[0.06] text-[11px] space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>{lang === 'mr' ? 'अपेक्षित पाऊस:' : 'Expected rain:'}</span>
                <span className="font-medium text-white tabular-nums font-mono">{park.rain_expected_mm} mm</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{lang === 'mr' ? 'बचत होणारे पाणी:' : 'Water saved:'}</span>
                <span className="font-medium text-[#4cc38a] tabular-nums font-mono">
                  {(park.water_need_liters || 175000).toLocaleString()} Liters
                </span>
              </div>
            </div>
          </div>

          {/* 1-Tap Acknowledge Button */}
          {acknowledged ? (
            <div className="p-3 rounded-xl bg-[#4cc38a]/10 border border-[#4cc38a]/25 text-center space-y-1">
              <CheckCircle className="w-5 h-5 text-[#4cc38a] mx-auto" />
              <div className="text-xs font-medium text-[#4cc38a]">
                {lang === 'mr' ? 'समजले! नोंद पूर्ण झाली.' : 'Acknowledged! Confirmation logged.'}
              </div>
              <p className="text-[10px] text-slate-400">
                {lang === 'mr' ? 'पंप बंद ठेवल्याबद्दल धन्यवाद.' : 'Thank you for keeping pump powered down.'}
              </p>
            </div>
          ) : (
            <button
              onClick={handleAcknowledge}
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-white text-[#0b0d14] hover:bg-slate-200 font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>
                {loading
                  ? (lang === 'mr' ? 'नोंद होत आहे...' : 'Logging...')
                  : (lang === 'mr' ? 'समजले / पंप बंद ठेवला' : 'Acknowledge: Pump kept OFF')}
              </span>
            </button>
          )}

          <div className="text-center text-[10px] text-slate-500 font-mono">
            {lang === 'mr' ? 'पुणे महानगरपालिका - स्मार्ट वॉटर मिशन' : 'PMC Smart City Irrigation Bridge'}
          </div>
        </div>
      </div>
    </div>
  );
}
