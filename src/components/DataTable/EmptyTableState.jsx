import React from 'react';
import { MapPin } from 'lucide-react';

export default function EmptyTableState() {
  return (
    <tr>
      <td colSpan={7} className="py-12 text-center text-slate-500">
        <div className="flex flex-col items-center justify-center gap-2">
          <MapPin size={28} className="text-slate-300" />
          <span className="font-semibold text-slate-700">No se encontraron registros</span>
          <span className="text-xs text-slate-400">Intenta ajustar los filtros de búsqueda o fecha.</span>
        </div>
      </td>
    </tr>
  );
}
