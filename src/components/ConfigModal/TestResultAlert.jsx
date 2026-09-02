import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TestResultAlert({ testResult }) {
  if (!testResult) return null;

  return (
    <div className={`p-3 rounded-lg flex items-start gap-2 text-xs border ${
      testResult.success
        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
        : 'bg-rose-50 text-rose-800 border-rose-200'
    }`}>
      {testResult.success ? (
        <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
      ) : (
        <AlertTriangle size={16} className="text-rose-600 mt-0.5 shrink-0" />
      )}
      <div>
        <strong className="block font-bold">
          {testResult.success ? 'Conexión Exitosa' : 'Error de Conexión'}
        </strong>
        <span>{testResult.success ? `Formulario verificado: ${testResult.name}` : testResult.error}</span>
      </div>
    </div>
  );
}
