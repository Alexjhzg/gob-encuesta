import React from 'react';
import { Calendar } from 'lucide-react';

export default function DateRangeFilter({
  minDate,
  maxDate,
  startDate = '',
  endDate = '',
  onStartDateChange = () => {},
  onEndDateChange = () => {}
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-slate-300 flex items-center gap-1.5">
          <Calendar size={13} className="text-slate-400" />
          <span>Rango de Fechas</span>
        </label>
        {minDate && maxDate && (
          <span className="text-[10px] text-blue-400 font-mono">
            {minDate} al {maxDate}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-[10px] text-slate-400 block mb-0.5">Desde</span>
          <input
            type="date"
            min={minDate}
            max={maxDate}
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          />
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block mb-0.5">Hasta</span>
          <input
            type="date"
            min={minDate}
            max={maxDate}
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
