export const COLOR_PALETTES = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#6366f1', // Indigo
  '#f97316', // Orange
  '#14b8a6', // Teal
  '#a855f7', // Violet
  '#64748b'  // Slate
];

/**
 * Helper to compute frequency distribution percentages from features
 */
export function computeDistribution(features = [], keyExtractor) {
  if (typeof keyExtractor !== 'function') return [];
  const counts = {};
  let total = 0;

  features.forEach(f => {
    const val = keyExtractor(f.properties || {});
    if (val !== undefined && val !== null && val !== '') {
      counts[val] = (counts[val] || 0) + 1;
      total++;
    }
  });

  return Object.entries(counts)
    .map(([label, count]) => ({
      label,
      count,
      percent: total > 0 ? ((count / total) * 100).toFixed(1) : 0
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Helper to group age values into demographic brackets
 */
export function computeAgeDistribution(features = []) {
  const brackets = {
    '18-29 años': 0,
    '30-44 años': 0,
    '45-59 años': 0,
    '60+ años': 0
  };
  let total = 0;

  features.forEach(f => {
    const rawAge = f.properties?.['S2/edad'];
    if (rawAge !== undefined && rawAge !== null && rawAge !== '') {
      const age = parseInt(rawAge, 10);
      if (!isNaN(age)) {
        total++;
        if (age < 30) brackets['18-29 años']++;
        else if (age < 45) brackets['30-44 años']++;
        else if (age < 60) brackets['45-59 años']++;
        else brackets['60+ años']++;
      }
    }
  });

  return Object.entries(brackets)
    .filter(([_, count]) => count > 0)
    .map(([label, count]) => ({
      label,
      count,
      percent: total > 0 ? ((count / total) * 100).toFixed(1) : '0.0'
    }));
}

/**
 * Format distribution data into Chart.js Bar dataset format
 */
export function formatBarChartData(distribution = [], datasetLabel = 'Registros', color = '#3b82f6', customColors = {}) {
  const labels = distribution.map(d => d.label);
  const data = distribution.map(d => d.count);
  const backgroundColors = distribution.map((d, idx) => {
    if (customColors && customColors[d.label]) return customColors[d.label];
    if (Array.isArray(color)) return color[idx % color.length];
    return color;
  });

  return {
    labels,
    datasets: [
      {
        label: datasetLabel,
        data,
        backgroundColor: backgroundColors,
        borderRadius: 6,
        borderWidth: 0
      }
    ]
  };
}
