import React from 'react';
import { MapPin } from 'lucide-react';

export default function BrandHeader() {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
        <MapPin size={20} className="sm:w-[22px] sm:h-[22px] stroke-[2.2]" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-xs sm:text-base font-bold text-slate-100 tracking-tight truncate">
          GeoEncuestas
        </h1>
      </div>
    </div>
  );
}
