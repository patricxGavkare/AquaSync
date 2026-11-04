import React, { useState } from 'react';
import { X, Smartphone, CloudRain, CheckCircle, AlertTriangle, Languages } from 'lucide-react';

export default function WatchmanModal({ isOpen, onClose, selectedPark, onAcknowledgeSuccess }) {
  const [lang, setLang] = useState('mr'); // 'mr' (Marathi) or 'en' (English)
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const park = selectedPark || {
    id: 'sarasbaug',
    name: 'Sarasbaug Municipal Garden',
    zone: 'Swargate (South Pune)',
    watchman_name: 'Pandurang More',
    rain_expected_mm: 14.2,
    scheduled_time: '06:00 AM'
  };

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-[#141822] border-2 border-[#2b3347] rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl relative p-4">
        {/* Smartphone Speaker notch */}
        <div className="w-24 h-4 bg-[#202738] rounded-full mx-auto mb-4 flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-600 rounded-full"></div>
        </div>

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3 px-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>AquaSync Ground Guard</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle Button */}
            <button
              onClick={() => setLang(lang === 'mr' ? 'en' : 'mr')}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#202738] hover:bg-[#2b344a] text-cyan-300 text-[11px] font-bold border border-cyan-800/60 transition-colors"
            >
              <Languages className="w-3 h-3" />
              <span>{lang === 'mr' ? 'मराठी' : 'English'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#202738] text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Smartphone Screen Content */}
        <div className="space-y-4 px-1 py-1">
          {/* Watchman Greeting Card */}
          <div className="p-3 rounded-2xl bg-[#1c2230] border border-[#2b3347]">
            <span className="text-[11px] text-slate-400 block">
              {lang === 'mr' ? 'उद्यान सुरक्षारक्षक / माळी:' : 'Park Security / Gardener:'}
            </span>
            <span className="font-bold text-white text-sm">{park.watchman_name}</span>
            <div className="text-[11px] text-cyan-400 font-medium mt-0.5">
              📍 {park.name} ({park.zone})
            </div>
          </div>

          {/* Urgent Irrigation Override Alert Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/70 via-red-950/60 to-[#1e1520] border-2 border-rose-500/50 space-y-3">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <CloudRain className="w-5 h-5 text-rose-400 animate-bounce" />
              <span>
                {lang === 'mr' ? '🌧️ पाऊस येणार आहे - पंप बंद ठेवा!' : '🌧️ Rain Alert: Keep Pump OFF!'}
              </span>
            </div>

            <p className="text-xs text-rose-100 leading-relaxed font-medium">
              {lang === 'mr'
                ? `हवामान अंदाजानुसार पुढील काही तासांत सुमारे ${park.rain_expected_mm} मिमी पाऊस पडण्याची शक्यता आहे. सकाळी ${park.scheduled_time} चे पाणी देणे रद्द केले आहे.`
                : `Forecast indicates ~${park.rain_expected_mm} mm rainfall incoming. Scheduled watering for ${park.scheduled_time} has been halted by AI.`
              }
            </p>

            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[11px] space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>{lang === 'mr' ? 'अपेक्षित पाऊस:' : 'Expected Rain:'}</span>
                <span className="font-bold text-white">{park.rain_expected_mm} mm</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{lang === 'mr' ? 'बचत होणारे पाणी:' : 'Water Saved:'}</span>
                <span className="font-bold text-cyan-400">175,000 Liters</span>
              </div>
            </div>
          </div>

          {/* 1-Tap Acknowledge Button */}
          {acknowledged ? (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-center space-y-1">
              <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="text-xs font-bold text-emerald-200">
                {lang === 'mr' ? 'समजले! नोंद पूर्ण झाली.' : 'Acknowledged! Confirmation Logged.'}
              </div>
              <p className="text-[10px] text-slate-300">
                {lang === 'mr' ? 'पंप बंद ठेवल्याबद्दल धन्यवाद.' : 'Thank you for keeping pump powered down.'}
              </p>
            </div>
          ) : (
            <button
              onClick={handleAcknowledge}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-emerald-200" />
              <span>
                {loading
                  ? (lang === 'mr' ? 'नोंद होत आहे...' : 'Logging...')
                  : (lang === 'mr' ? 'समजले / पंप बंद ठेवला (1-Tap Ack)' : 'Acknowledged / Pump Kept OFF')}
              </span>
            </button>
          )}

          <div className="text-center text-[10px] text-slate-400">
            {lang === 'mr' ? 'पुणे महानगरपालिका - स्मार्ट वॉटर मिशन' : 'PMC Smart City Irrigation Bridge'}
          </div>
        </div>
      </div>
    </div>
  );
}
