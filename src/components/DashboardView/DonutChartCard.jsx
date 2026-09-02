import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { COLOR_PALETTES } from '../../utils/dashboardAnalytics.js';

export default function DonutChartCard({ data = [], customColors = {}, centerLabel = 'Envíos' }) {
  if (!data || data.length === 0) return null;

  const totalCount = data.reduce((acc, curr) => acc + curr.count, 0);
  const labels = data.map(d => d.label);
  const counts = data.map(d => d.count);
  const backgroundColors = data.map((d, idx) => customColors[d.label] || COLOR_PALETTES[idx % COLOR_PALETTES.length]);

  const chartData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: backgroundColors,
        borderColor: '#0f172a',
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = totalCount > 0 ? ((value / totalCount) * 100).toFixed(1) : 0;
            return ` ${label}: ${value} ${centerLabel.toLowerCase()} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '72%'
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
      {/* Donut Canvas + Absolute Center Total Display */}
      <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
        <Doughnut data={chartData} options={options} />
        
        {/* Center Total Counter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-black text-white font-mono leading-none tracking-tight">{totalCount}</span>
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">{centerLabel}</span>
        </div>
      </div>

      {/* Breakdown Legend with Totals and Percentages */}
      <div className="flex-1 w-full space-y-2.5">
        {data.map((item, idx) => {
          const color = customColors[item.label] || COLOR_PALETTES[idx % COLOR_PALETTES.length];

          return (
            <div key={idx} className="flex items-center justify-between text-xs group">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="font-semibold text-slate-200 truncate group-hover:text-white transition-colors">{item.label}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                <span className="font-bold text-white">{item.count}</span>
                <span className="text-slate-400 w-12 text-right">{item.percent}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
