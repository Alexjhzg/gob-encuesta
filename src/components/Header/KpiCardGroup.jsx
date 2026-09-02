import React from 'react';
import { Database, MapPin, Clock } from 'lucide-react';
import { DEFAULT_KPIS } from '../../utils/headerHelpers.js';

export default function KpiCardGroup({ kpis = DEFAULT_KPIS }) {
  const kpiData = { ...DEFAULT_KPIS, ...kpis };

  return (
    <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto overflow-x-auto py-0.5 no-scrollbar">
      {/* KPI 1: Total Submissions */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 sm:px-3.5 py-1 sm:py-1.5 flex items-center gap-2 sm:gap-3 shrink-0 flex-1 sm:flex-initial">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-slate-700/60 flex items-center justify-center text-slate-300 shrink-0">
          <Database size={14} className="sm:w-4 sm:h-4" />
        </div>
        <div>
          <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total</div>
          <div className="text-xs sm:text-sm font-bold text-white">{kpiData.total}</div>
        </div>
      </div>

      {/* KPI 2: Geolocated % */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 sm:px-3.5 py-1 sm:py-1.5 flex items-center gap-2 sm:gap-3 shrink-0 flex-1 sm:flex-initial">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
          <MapPin size={14} className="sm:w-4 sm:h-4" />
        </div>
        <div>
          <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium uppercase tracking-wider">Geolocalizados</div>
          <div className="text-xs sm:text-sm font-bold text-blue-400 flex items-center gap-1">
            <span>{kpiData.geocodedCount}</span>
            <span className="text-[10px] sm:text-[11px] font-normal text-slate-300">({kpiData.percentGeocoded}%)</span>
          </div>
        </div>
      </div>

      {/* KPI 3: Last Sync (Visible on Desktop) */}
      <div className="hidden lg:flex bg-slate-800/80 border border-slate-700/60 rounded-lg px-3.5 py-1.5 items-center gap-3 shrink-0">
        <div className="w-7 h-7 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <Clock size={16} />
        </div>
        <div>
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Última Sync</div>
          <div className="text-xs font-semibold text-slate-200">{kpiData.lastSync}</div>
        </div>
      </div>
    </div>
  );
}
