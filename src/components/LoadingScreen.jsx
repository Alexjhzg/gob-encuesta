import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';

export default function LoadingScreen({ message = 'Cargando datos...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md text-slate-100 p-6 select-none transition-all duration-300">
      {/* Soft Background Glow */}
      <div className="absolute w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      {/* Minimal Animated Logo & Spinner Container */}
      <div className="relative flex flex-col items-center justify-center gap-4">
        {/* Logo Container with Orbiting Spinner */}
        <div className="relative flex items-center justify-center">
          {/* External Spinning Ring */}
          <div className="w-20 h-20 rounded-2xl border-2 border-blue-500/20 border-t-blue-500 animate-spin"></div>

          {/* Central Logo Box */}
          <div className="absolute w-14 h-14 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 animate-pulse">
            <MapPin size={28} className="stroke-[2.2] animate-bounce" />
          </div>
        </div>

        {/* Minimal Title & Status Message */}
        <div className="flex flex-col items-center gap-1 mt-2">
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">
            GeoEncuestas
          </h2>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Loader2 size={14} className="animate-spin text-blue-400" />
            <span>{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
