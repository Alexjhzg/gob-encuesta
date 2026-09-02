import React from 'react';
import { Award, Users } from 'lucide-react';

export default function SurveyorRankingTable({ surveyors = [] }) {
  if (!surveyors || surveyors.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Award className="text-amber-400" size={18} />
          <h3 className="font-bold text-slate-100 text-sm">Producción por Encuestador</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">{surveyors.length} activos</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-2 px-2">#</th>
              <th className="py-2 px-2">Nombre / Código Encuestador</th>
              <th className="py-2 px-2 text-right">Encuestas</th>
              <th className="py-2 px-2 text-right">% Participación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {surveyors.map((s, idx) => (
              <tr key={s.label} className="hover:bg-slate-800/50 transition-colors">
                <td className="py-2 px-2 font-mono font-bold text-slate-500">{idx + 1}</td>
                <td className="py-2 px-2 font-semibold flex items-center gap-2">
                  <Users size={12} className="text-blue-400 shrink-0" />
                  <span className="truncate">{s.label}</span>
                </td>
                <td className="py-2 px-2 text-right font-mono font-bold text-blue-400">{s.count}</td>
                <td className="py-2 px-2 text-right font-mono text-slate-400">{s.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
