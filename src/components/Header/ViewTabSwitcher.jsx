import React from 'react';
import { Map, BarChart3 } from 'lucide-react';

export default function ViewTabSwitcher({ activeTab = 'map', onSelectTab = () => {} }) {
  return (
    <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto justify-center sm:justify-start shadow-inner">
      <button
        onClick={() => onSelectTab('map')}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          activeTab === 'map'
            ? 'bg-blue-600 text-white shadow'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <Map size={15} />
        <span>Mapa y Registros</span>
      </button>
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          activeTab === 'dashboard'
            ? 'bg-blue-600 text-white shadow'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <BarChart3 size={15} />
        <span>Dashboard Analítico</span>
      </button>
    </div>
  );
}
