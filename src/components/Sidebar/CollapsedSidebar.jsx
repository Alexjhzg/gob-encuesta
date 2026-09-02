import React from 'react';
import { Filter, Search, Download } from 'lucide-react';

export default function CollapsedSidebar({ onToggleOpen = () => {} }) {
  return (
    <div className="p-3 flex-1 flex flex-col items-center gap-5">
      <button onClick={onToggleOpen} className="p-2 text-slate-400 hover:text-white cursor-pointer" title="Filtros">
        <Filter size={18} />
      </button>
      <button onClick={onToggleOpen} className="p-2 text-slate-400 hover:text-white cursor-pointer" title="Búsqueda">
        <Search size={18} />
      </button>
      <button onClick={onToggleOpen} className="p-2 text-slate-400 hover:text-white cursor-pointer" title="Exportar">
        <Download size={18} />
      </button>
    </div>
  );
}
