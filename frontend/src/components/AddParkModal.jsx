import React, { useState } from 'react';
import { X, Plus, MapPin } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#181d28] border border-[#2d364a] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-[#283144] flex items-center justify-between bg-[#151923]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Add Municipal Green Space</h3>
              <span className="text-[10px] text-emerald-400">Future Scope City Expansion</span>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
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
              className="w-full bg-[#121620] border border-[#2b3347] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Pune / PCMC Zone</label>
            <input
              type="text"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              placeholder="e.g., Nigdi - Akurdi Zone"
              className="w-full bg-[#121620] border border-[#2b3347] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Total Area (m²)</label>
              <input
                type="number"
                value={totalAreaSqm}
                onChange={(e) => setTotalAreaSqm(e.target.value)}
                className="w-full bg-[#121620] border border-[#2b3347] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Irrigated Turf Area (m²)</label>
              <input
                type="number"
                value={irrigatedAreaSqm}
                onChange={(e) => setIrrigatedAreaSqm(e.target.value)}
                className="w-full bg-[#121620] border border-[#2b3347] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Assigned Ground Watchman</label>
            <input
              type="text"
              value={watchmanName}
              onChange={(e) => setWatchmanName(e.target.value)}
              className="w-full bg-[#121620] border border-[#2b3347] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/30 cursor-pointer"
            >
              {loading ? 'Adding to Municipal Registry...' : 'Enroll in AquaSync AI Network'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
