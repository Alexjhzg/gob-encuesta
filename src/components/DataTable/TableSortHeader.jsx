import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export default function TableSortHeader({ sortField, sortAsc, onSort }) {
  return (
    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0 z-10 select-none shadow-sm">
      <tr>
        <th onClick={() => onSort('id')} className="py-2.5 px-3.5 cursor-pointer hover:bg-slate-200 transition-colors">
          <div className="flex items-center gap-1">
            <span>ID</span>
            <ArrowUpDown size={12} className="text-slate-400" />
          </div>
        </th>
        <th onClick={() => onSort('submitted_by')} className="py-2.5 px-3.5 cursor-pointer hover:bg-slate-200 transition-colors">
          <div className="flex items-center gap-1">
            <span>Encuestador</span>
            <ArrowUpDown size={12} className="text-slate-400" />
          </div>
        </th>
        <th className="py-2.5 px-3.5">Parroquia / Sector</th>
        <th className="py-2.5 px-3.5">Respuesta / Tendencia</th>
        <th onClick={() => onSort('submission_time')} className="py-2.5 px-3.5 cursor-pointer hover:bg-slate-200 transition-colors">
          <div className="flex items-center gap-1">
            <span>Fecha</span>
            <ArrowUpDown size={12} className="text-slate-400" />
          </div>
        </th>
        <th className="py-2.5 px-3.5">Coordenadas</th>
        <th className="py-2.5 px-3.5 text-center">Acción</th>
      </tr>
    </thead>
  );
}
