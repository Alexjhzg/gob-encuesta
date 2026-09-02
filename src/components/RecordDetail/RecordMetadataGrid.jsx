import React from 'react';
import { User, Calendar, Tag, Navigation } from 'lucide-react';
import { formatDate, formatParroquiaName, formatSectorName } from '../../utils/formattersAndFilters.js';
import { formatValueLabel } from '../../utils/recordDetailHelpers.js';

export default function RecordMetadataGrid({ properties = {} }) {
  const p = properties;

  return (
    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
          <User size={12} className="text-blue-600" /> Encuestador
        </span>
        <p className="font-semibold text-slate-900">{p.submitted_by || 'N/A'}</p>
        {p['S0/cedula_encuestador'] && (
          <p className="text-[10px] text-slate-500 font-mono">C.I.: {p['S0/cedula_encuestador']}</p>
        )}
      </div>

      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
          <Calendar size={12} className="text-blue-600" /> Fecha y Hora
        </span>
        <p className="font-semibold text-slate-900">{formatDate(p.submission_time)}</p>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
          <Tag size={12} className="text-blue-600" /> Parroquia / Sector
        </span>
        <p className="font-semibold text-slate-900">
          {formatParroquiaName(p['S1/par'])} - {formatSectorName(p['S1/sec'])}
        </p>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
          <Navigation size={12} className="text-blue-600" /> Datos Encuestado
        </span>
        <p className="font-semibold text-slate-900">
          {formatValueLabel(p['S2/sexo'])}, {p['S2/edad'] ? `${p['S2/edad']} años` : ''}
        </p>
      </div>
    </div>
  );
}
