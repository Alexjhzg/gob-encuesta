import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function HeaderActions({ onRefresh = () => {}, loading = false }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      {/* Refresh Sync Button */}
      <button
        onClick={onRefresh}
        disabled={loading}
        title="Sincronizar datos desde KoboToolbox"
        className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 rounded-lg transition-all disabled:opacity-50 cursor-pointer shadow-sm"
      >
        <RefreshCw size={14} className={`shrink-0 ${loading ? 'animate-spin text-blue-400' : ''}`} />
        <span className="hidden sm:inline">Sincronizar</span>
      </button>
    </div>
  );
}
