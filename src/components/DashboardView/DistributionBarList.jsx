import React from 'react';
import { COLOR_PALETTES } from '../../utils/dashboardAnalytics.js';

export default function DistributionBarList({ data = [], customColors = {} }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-3">
      {data.map((item, idx) => {
        const color = customColors[item.label] || COLOR_PALETTES[idx % COLOR_PALETTES.length];

        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-200 truncate pr-2">{item.label}</span>
              <span className="font-mono text-slate-400 shrink-0">
                <strong className="text-white">{item.count}</strong> ({item.percent}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${item.percent}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
