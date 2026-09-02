import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function RecordStatusBanner({ estadoAtencion, status }) {
  const isResolved = estadoAtencion === 'Resuelto' || status === 'approved';

  return (
    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-emerald-600" />
        <span className="font-semibold text-slate-800 text-xs">Estado de Registro</span>
      </div>
      <span className={`px-3 py-1 rounded-md font-bold text-xs ${
        isResolved
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          : 'bg-amber-100 text-amber-800 border border-amber-300'
      }`}>
        {estadoAtencion || 'Registrado'}
      </span>
    </div>
  );
}
