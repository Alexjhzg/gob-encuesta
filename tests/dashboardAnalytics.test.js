import { describe, it, expect } from 'vitest';
import { computeDistribution, formatBarChartData, computeAgeDistribution, COLOR_PALETTES } from '../src/utils/dashboardAnalytics.js';

describe('Dashboard Analytics Helpers', () => {
  it('computes distribution counts and percentages correctly', () => {
    const mockFeatures = [
      { properties: { candidate: 'Ernesto Luna' } },
      { properties: { candidate: 'Ernesto Luna' } },
      { properties: { candidate: 'Oposición' } },
      { properties: { candidate: null } }
    ];

    const distribution = computeDistribution(mockFeatures, p => p.candidate);
    expect(distribution).toEqual([
      { label: 'Ernesto Luna', count: 2, percent: '66.7' },
      { label: 'Oposición', count: 1, percent: '33.3' }
    ]);
  });

  it('computes age distribution grouped into demographic brackets', () => {
    const mockFeatures = [
      { properties: { 'S2/edad': '20' } },
      { properties: { 'S2/edad': '25' } },
      { properties: { 'S2/edad': '35' } },
      { properties: { 'S2/edad': '50' } },
      { properties: { 'S2/edad': '68' } }
    ];

    const ageDist = computeAgeDistribution(mockFeatures);
    expect(ageDist).toEqual([
      { label: '18-29 años', count: 2, percent: '40.0' },
      { label: '30-44 años', count: 1, percent: '20.0' },
      { label: '45-59 años', count: 1, percent: '20.0' },
      { label: '60+ años', count: 1, percent: '20.0' }
    ]);
  });

  it('formats bar chart dataset structure with custom per-option colors', () => {
    const distribution = [
      { label: 'Excelente', count: 10, percent: '50.0' },
      { label: 'Muy Malo', count: 5, percent: '25.0' }
    ];

    const customColors = {
      'Excelente': '#10b981',
      'Muy Malo': '#ef4444'
    };

    const chartData = formatBarChartData(distribution, 'Evaluación', '#3b82f6', customColors);
    expect(chartData.labels).toEqual(['Excelente', 'Muy Malo']);
    expect(chartData.datasets[0].data).toEqual([10, 5]);
    expect(chartData.datasets[0].backgroundColor).toEqual(['#10b981', '#ef4444']);
  });

  it('returns empty array when no valid values match', () => {
    const distribution = computeDistribution([], p => p.foo);
    expect(distribution).toEqual([]);
  });

  it('provides color palettes array', () => {
    expect(COLOR_PALETTES).toBeInstanceOf(Array);
    expect(COLOR_PALETTES.length).toBeGreaterThan(0);
  });
});
