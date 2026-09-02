import React from 'react';
import { X, MapPin, HelpCircle } from 'lucide-react';
import { extractSurveyFields } from '../utils/recordDetailHelpers.js';
import RecordStatusBanner from './RecordDetail/RecordStatusBanner.jsx';
import RecordMetadataGrid from './RecordDetail/RecordMetadataGrid.jsx';
import SurveyResponseList from './RecordDetail/SurveyResponseList.jsx';
import GeoLocationDetails from './RecordDetail/GeoLocationDetails.jsx';

export default function RecordDetail({
  feature = null,
  onClose = () => {}
}) {
  if (!feature) return null;

  const p = feature.properties || {};
  const [lon, lat] = feature.geometry?.coordinates || [p.longitude, p.latitude];

  const surveyFields = extractSurveyFields(p);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full sm:max-w-lg bg-white h-[92vh] sm:h-full mt-auto sm:mt-0 rounded-t-2xl sm:rounded-t-none shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-bottom sm:slide-in-from-right duration-200 font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-md">
              <MapPin size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Ficha de Encuesta #{p.id}</h3>
              <p className="text-xs text-slate-400">Detalles y Respuestas del Levantamiento en Campo</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* Key Status Banner */}
          <RecordStatusBanner estadoAtencion={p.estado_atencion} status={p.status} />

          {/* Core Metadata Grid */}
          <RecordMetadataGrid properties={p} />

          {/* Form Responses Section */}
          <SurveyResponseList surveyFields={surveyFields} />

          {/* Geospatial Location details */}
          <GeoLocationDetails lat={lat} lon={lon} altitude={p.altitude} precision={p.precision} />

          {/* Raw JSON Data Drawer Toggle */}
          <details className="text-[11px] text-slate-500 cursor-pointer pt-2">
            <summary className="font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1">
              <HelpCircle size={12} />
              <span>Ver Parámetros Raw Kobo JSON (Desarrollador)</span>
            </summary>
            <pre className="mt-2 bg-slate-900 text-slate-200 p-3 rounded-lg text-[10px] font-mono overflow-x-auto max-h-52">
              {JSON.stringify(p, null, 2)}
            </pre>
          </details>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl shadow transition-colors text-xs"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
}
