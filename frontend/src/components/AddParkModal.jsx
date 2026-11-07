import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function AddParkModal({ isOpen, onClose, onParkAdded }) {
  const [name, setName] = useState('');
  const [zone, setZone] = useState('PCMC BRTS Corridor (Nigdi)');
  const [totalAreaSqm, setTotalAreaSqm] = useState('30000');
  const [irrigatedAreaSqm, setIrrigatedAreaSqm] = useState('18000');
  const [watchmanName, setWatchmanName] = useState('Ramesh Patil');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/parks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          zone,
          latitude: 18.6500, // PCMC Nigdi/Akurdi coordinate
          longitude: 73.8000,
          totalAreaSqm: Number(totalAreaSqm),
          irrigatedAreaSqm: Number(irrigatedAreaSqm),
          watchmanName,
          watchmanPhone: '+91 98221 00000'
        })
      });
      const data = await res.json();
      if (data.success) {
        if (onParkAdded) onParkAdded();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#11141c] border border-white/[0.08] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0b0d14]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a2030] text-slate-300 flex items-center justify-center border border-white/[0.08]">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Add Municipal Green Space</h3>
              <span className="text-[10px] text-slate-400 font-mono">Future scope city expansion</span>
            </div>
          </div>

          <button onClick={onClose} className="w-7 h-7 rounded-md bg-[#1a2030] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-300">
          <div>
            <label className="block text-slate-400 mb-1">Park / Divider Green Belt Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., PCMC BRTS Green Belt - Akurdi"
              className="w-full bg-[#1a2030]/60 border border-white/[0.08] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/[0.24]"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Pune / PCMC Zone</label>
            <input
              type="text"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              placeholder="e.g., Nigdi - Akurdi Zone"
              className="w-full bg-[#1a2030]/60 border border-white/[0.08] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/[0.24]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Total Area (m²)</label>
              <input
                type="number"
                value={totalAreaSqm}
                onChange={(e) => setTotalAreaSqm(e.target.value)}
                className="w-full bg-[#1a2030]/60 border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:outline-none focus:border-white/[0.24]"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Irrigated Turf Area (m²)</label>
              <input
                type="number"
                value={irrigatedAreaSqm}
                onChange={(e) => setIrrigatedAreaSqm(e.target.value)}
                className="w-full bg-[#1a2030]/60 border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:outline-none focus:border-white/[0.24]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Assigned Ground Watchman</label>
            <input
              type="text"
              value={watchmanName}
              onChange={(e) => setWatchmanName(e.target.value)}
              className="w-full bg-[#1a2030]/60 border border-white/[0.08] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/[0.24]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-white text-[#0b0d14] hover:bg-slate-200 font-medium text-xs transition-colors cursor-pointer"
            >
              {loading ? 'Adding to Municipal Registry...' : 'Enroll in AquaSync network'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
