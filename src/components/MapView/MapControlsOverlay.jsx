import React from 'react';
import { Maximize2, Layers } from 'lucide-react';

export default function MapControlsOverlay({ count = 0, onFitBounds = () => {} }) {
  return (
    <>
      {/* Floating Action Buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={onFitBounds}
          title="Centrar mapa en todos los datos (Fit Bounds)"
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-lg border border-slate-700 backdrop-blur-sm transition-all cursor-pointer"
        >
          <Maximize2 size={14} className="text-blue-400" />
          <span>Fit Bounds</span>
        </button>
      </div>

      {/* Feature Count Badge overlay */}
      <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold rounded-md shadow border border-slate-200 flex items-center gap-2">
        <Layers size={14} className="text-blue-600" />
        <span>{count} marcadores individuales en mapa</span>
      </div>
    </>
  );
}
