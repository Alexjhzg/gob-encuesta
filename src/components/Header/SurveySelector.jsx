import React from 'react';
import { SURVEY_ASSET_OPTIONS } from '../../utils/headerHelpers.js';

export default function SurveySelector({ activeAssetUid, onSelectAssetUid }) {
  return (
    <div className="flex items-center gap-1.5 w-full sm:w-auto mt-0.5 sm:mt-0">
      <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 shrink-0">Encuesta:</span>
      <select
        value={activeAssetUid}
        onChange={(e) => onSelectAssetUid(e.target.value)}
        className="w-full sm:w-auto max-w-full bg-slate-800 text-blue-300 text-xs font-semibold px-2 py-1 sm:py-0.5 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer truncate shadow-sm"
      >
        {SURVEY_ASSET_OPTIONS.map(opt => (
          <option key={opt.uid} value={opt.uid}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
