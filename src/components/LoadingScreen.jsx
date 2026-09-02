import React from 'react';
import { MapPin, Loader2, Database, ShieldCheck } from 'lucide-react';

export default function LoadingScreen({ message = 'Cargando datos de KoboToolbox...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md text-slate-100 p-6 select-none animate-fadeIn">
      {/* Background glowing aura */}
      <div className="absolute w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      {/* Main Container Card */}
      <div className="relative flex flex-col items-center max-w-sm w-full bg-slate-900/90 border border-slate-800/80 rounded-2xl p-8 shadow-2xl shadow-blue-950/50 text-center">
        {/* Animated Brand Icon */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <MapPin size={32} className="animate-bounce stroke-[2.2]" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-1 border border-slate-700 text-blue-400">
            <Loader2 size={16} className="animate-spin" />
          </div>
        </div>

        {/* Title & App Name */}
        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight mb-1">
          GeoEncuestas
        </h2>
        <p className="text-xs text-slate-400 font-medium mb-6 flex items-center gap-1.5 justify-center">
          <Database size={13} className="text-blue-400" />
          <span>KoboToolbox API v2 Integration</span>
        </p>

        {/* Loading Spinner & Status */}
        <div className="w-full bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2.5 text-blue-400">
            <Loader2 size={20} className="animate-spin shrink-0" />
            <span className="text-xs font-semibold text-slate-200 tracking-wide">
              {message}
            </span>
          </div>

          {/* Animated Loader Bar */}
          <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 rounded-full animate-pulse w-3/4"></div>
          </div>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed mt-1">
            Procesando geolocalizaciones y transformando a GeoJSON...
          </p>
        </div>

        {/* Footer Security Badge */}
        <div className="mt-6 flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
          <span>Conexión segura de datos</span>
        </div>
      </div>
    </div>
  );
}
