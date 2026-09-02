import React from 'react';
import { Bar } from 'react-chartjs-2';
import { formatBarChartData } from '../../utils/dashboardAnalytics.js';

export default function BarChartCard({
  data = [],
  title,
  datasetLabel = 'Total Registros',
  color = '#3b82f6',
  customColors = {},
  horizontal = false,
  subtitle
}) {
  if (!data || data.length === 0) return null;

  const chartData = formatBarChartData(data, datasetLabel, color, customColors);

  const options = {
    indexAxis: horizontal ? 'y' : 'x',
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
            const rawVal = context.raw || 0;
            const item = data[context.dataIndex];
            const pct = item?.percent ? ` (${item.percent}%)` : '';
            return ` ${context.dataset.label}: ${rawVal}${pct}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-bold text-slate-100 text-sm">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-xs text-slate-400 font-mono">{data.length} ítems</span>
      </div>

      <div className="h-56 w-full pt-1">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
