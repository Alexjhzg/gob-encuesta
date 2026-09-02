/**
 * Exporter utilities for GeoJSON and CSV formats.
 */

/**
 * Converts features array to stringified GeoJSON FeatureCollection
 * @param {Array<object>} features 
 * @returns {string}
 */
export function exportToGeoJSON(features = []) {
  const collection = {
    type: 'FeatureCollection',
    features,
    meta: {
      total: features.length,
      exported_at: new Date().toISOString()
    }
  };
  return JSON.stringify(collection, null, 2);
}

/**
 * Escapes CSV field value
 * @param {any} val 
 * @returns {string}
 */
function escapeCSV(val) {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Converts features array into clean CSV string with headers
 * @param {Array<object>} features 
 * @returns {string}
 */
export function exportToCSV(features = []) {
  const headers = [
    'ID',
    'Fecha Envío',
    'Encuestador',
    'Categoría',
    'Estado Atención',
    'Municipio',
    'Parroquia',
    'Latitud',
    'Longitud',
    'Precisión (m)',
    'Observaciones'
  ];

  const rows = [headers.map(escapeCSV).join(',')];

  for (const feature of features) {
    const p = feature.properties || {};
    const [lon, lat] = feature.geometry?.coordinates || [p.longitude, p.latitude];

    const row = [
      p.id || '',
      p.submission_time || '',
      p.submitted_by || '',
      p.categoria || '',
      p.estado_atencion || '',
      p.municipio || '',
      p.parroquia || '',
      lat !== undefined ? lat : '',
      lon !== undefined ? lon : '',
      p.precision || '',
      p.observaciones || ''
    ];

    rows.push(row.map(escapeCSV).join(','));
  }

  return rows.join('\n');
}

/**
 * Triggers a browser file download of string content
 * @param {string} content 
 * @param {string} filename 
 * @param {string} mimeType 
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
