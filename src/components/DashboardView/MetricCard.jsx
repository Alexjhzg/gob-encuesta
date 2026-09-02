import React from 'react';

export default function MetricCard({ title, value, subtext, icon: Icon, colorClass = 'text-blue-400', bgClass = 'bg-blue-500/10' }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex items-center justify-between">
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{title}</span>
        <div className="text-2xl font-black text-white font-mono mt-1">{value}</div>
        {subtext && <span className="text-[11px] text-slate-400 mt-0.5 block">{subtext}</span>}
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
