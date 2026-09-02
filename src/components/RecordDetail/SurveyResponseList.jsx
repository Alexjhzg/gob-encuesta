import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { QUESTION_LABELS, formatValueLabel } from '../../utils/recordDetailHelpers.js';

export default function SurveyResponseList({ surveyFields = [] }) {
  return (
    <div className="space-y-3">
      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
        <CheckCircle2 size={14} className="text-blue-600" />
        <span>Respuestas del Formulario ({surveyFields.length})</span>
      </h4>

      <div className="space-y-2">
        {surveyFields.map(([key, val]) => {
          const title = QUESTION_LABELS[key] || key.split('/').pop().replace(/_/g, ' ');
          const formattedVal = formatValueLabel(val);

          return (
            <div key={key} className="bg-slate-50 hover:bg-blue-50/50 p-3 rounded-lg border border-slate-200 transition-colors">
              <div className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center justify-between">
                <span>{title}</span>
                <span className="text-[9px] font-mono text-slate-400 font-normal">{key}</span>
              </div>
              <div className="text-xs font-bold text-slate-900">
                {formattedVal}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
