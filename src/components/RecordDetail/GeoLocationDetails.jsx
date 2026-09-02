import React from 'react';
import { formatCoordinates } from '../../utils/formattersAndFilters.js';

export default function GeoLocationDetails({ lat, lon, altitude, precision }) {
  return (
    <div className="space-y-2">
      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
        Ubicación Geoespacial
      </h4>
      <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200/80 space-y-1 font-mono text-[11px] text-slate-800">
        <div><strong>Coordenadas:</strong> {formatCoordinates(lat, lon)}</div>
        <div><strong>Altitud:</strong> {altitude ? `${altitude} m s.n.m.` : 'Estándar'}</div>
        <div><strong>Precisión GPS:</strong> {precision ? `± ${precision} metros` : 'Estándar'}</div>
      </div>
    </div>
  );
}
