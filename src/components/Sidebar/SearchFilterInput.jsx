import React from 'react';
import { Search } from 'lucide-react';

export default function SearchFilterInput({ value = '', onChange = () => {} }) {
  return (
    <div className="space-y-1.5">
      <label className="font-semibold text-slate-300 flex items-center gap-1.5">
        <Search size={13} className="text-slate-400" />
        <span>Búsqueda Libre</span>
      </label>
      <input
        type="text"
        placeholder="Buscar por ID, encuestador, nota..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
