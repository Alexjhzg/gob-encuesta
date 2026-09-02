import React from 'react';
import { Download, FileSpreadsheet, FileCode } from 'lucide-react';

export default function ExportActions({ onExportGeoJSON = () => {}, onExportCSV = () => {} }) {
  return (
    <div className="space-y-2">
      <div className="font-semibold text-slate-300 flex items-center gap-1.5">
        <Download size={13} className="text-blue-400" />
        <span>Exportar Selección</span>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={onExportGeoJSON}
          className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-md font-medium border border-slate-700 transition-all cursor-pointer"
        >
          <FileCode size={14} className="text-emerald-400" />
          <span>Descargar GeoJSON</span>
        </button>
        <button
          onClick={onExportCSV}
          className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-md font-medium border border-slate-700 transition-all cursor-pointer"
        >
          <FileSpreadsheet size={14} className="text-blue-400" />
          <span>Descargar CSV</span>
        </button>
      </div>
    </div>
  );
}
