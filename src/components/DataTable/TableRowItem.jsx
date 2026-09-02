import React from 'react';
import { User, Eye } from 'lucide-react';
import { formatDate, formatCoordinates, formatParroquiaName, formatSectorName } from '../../utils/formattersAndFilters.js';
import { extractKeyAnswer } from '../../utils/tableHelpers.js';

export default function TableRowItem({ feature, isSelected, onSelectFeature }) {
  const p = feature.properties || {};
  const [lon, lat] = feature.geometry?.coordinates || [];
  const keyAnswer = extractKeyAnswer(p);

  return (
    <tr
      onClick={() => onSelectFeature(feature)}
      className={`hover:bg-blue-50/80 transition-colors cursor-pointer ${
        isSelected ? 'bg-blue-100/90 font-semibold border-l-4 border-l-blue-600 shadow-sm' : ''
      }`}
    >
      {/* ID */}
      <td className="py-2.5 px-3.5 font-mono font-bold text-blue-900 whitespace-nowrap">
        #{p.id}
      </td>

      {/* Encuestador */}
      <td className="py-2.5 px-3.5">
        <div className="flex items-center gap-1.5">
          <User size={13} className="text-slate-400 shrink-0" />
          <div>
            <span className="font-semibold text-slate-900 block leading-tight">{p.submitted_by}</span>
            {p['S0/cedula_encuestador'] && (
              <span className="text-[10px] text-slate-400 font-mono">C.I.: {p['S0/cedula_encuestador']}</span>
            )}
          </div>
        </div>
      </td>

      {/* Parroquia / Sector */}
      <td className="py-2.5 px-3.5 whitespace-nowrap">
        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 font-semibold text-[11px] border border-blue-200">
          {formatParroquiaName(p['S1/par'])} | {formatSectorName(p['S1/sec'])}
        </span>
      </td>

      {/* Respuesta / Tendencia Clave */}
      <td className="py-2.5 px-3.5 whitespace-nowrap">
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${keyAnswer.color}`}>
          {keyAnswer.label}
        </span>
      </td>

      {/* Fecha */}
      <td className="py-2.5 px-3.5 text-slate-600 whitespace-nowrap">
        {formatDate(p.submission_time)}
      </td>

      {/* Coordenadas */}
      <td className="py-2.5 px-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
        {formatCoordinates(lat, lon)}
      </td>

      {/* Acción / Botón Ver Detalle */}
      <td className="py-2.5 px-3.5 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectFeature(feature);
          }}
          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors shadow-sm"
          title="Ver Ficha Detallada de la Encuesta"
        >
          <Eye size={14} />
        </button>
      </td>
    </tr>
  );
}
