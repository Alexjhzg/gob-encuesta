/**
 * Utility functions for date formatting, coordinate formatting, spatial bounding box filtering,
 * search filtering, and KPI metric calculations.
 */

/**
 * Formats ISO date string into readable Spanish format
 * @param {string|Date} dateInput 
 * @returns {string}
 */
export function formatDate(dateInput) {
  if (!dateInput) return 'N/A';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'Fecha inválida';
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (err) {
    return String(dateInput);
  }
}

/**
 * Formats latitude and longitude coordinates into cardinal display
 * @param {number} lat 
 * @param {number} lon 
 * @returns {string}
 */
export function formatCoordinates(lat, lon) {
  if (lat === undefined || lon === undefined || lat === null || lon === null) return 'Sin Coordenadas';
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  if (isNaN(latNum) || isNaN(lonNum)) return 'Coordenadas inválidas';

  const latDir = latNum >= 0 ? 'N' : 'S';
  const lonDir = lonNum >= 0 ? 'E' : 'W';

  return `${Math.abs(latNum).toFixed(4)}° ${latDir}, ${Math.abs(lonNum).toFixed(4)}° ${lonDir}`;
}

/**
 * Filters GeoJSON features by Leaflet/MapLibre bounding box { south, west, north, east }
 * @param {Array<object>} features 
 * @param {{ south: number, west: number, north: number, east: number } | null} bounds 
 * @returns {Array<object>}
 */
export function filterFeaturesByBounds(features = [], bounds) {
  if (!bounds || typeof bounds !== 'object') return features;
  const { south, west, north, east } = bounds;
  if ([south, west, north, east].some(v => v === undefined || v === null || isNaN(v))) {
    return features;
  }

  // Prevent zero-area bounds (e.g. 0x0 container size) from filtering out all features
  if (Math.abs(north - south) < 0.00001 || Math.abs(east - west) < 0.00001) {
    return features;
  }

  return features.filter(feature => {
    if (!feature.geometry || feature.geometry.type !== 'Point' || !Array.isArray(feature.geometry.coordinates)) {
      return false;
    }
    const [lon, lat] = feature.geometry.coordinates;
    return lat >= south && lat <= north && lon >= west && lon <= east;
  });
}

/**
 * Filters GeoJSON features by date range [startDate, endDate]
 * @param {Array<object>} features 
 * @param {string} startDate YYYY-MM-DD
 * @param {string} endDate YYYY-MM-DD
 * @returns {Array<object>}
 */
export function filterFeaturesByDateRange(features = [], startDate, endDate) {
  if (!startDate && !endDate) return features;

  const startMs = startDate ? new Date(`${startDate}T00:00:00Z`).getTime() : 0;
  const endMs = endDate ? new Date(`${endDate}T23:59:59Z`).getTime() : Infinity;

  return features.filter(f => {
    const subTime = f.properties?.submission_time || f.properties?._submission_time;
    if (!subTime) return false;
    const timeMs = new Date(subTime).getTime();
    return timeMs >= startMs && timeMs <= endMs;
  });
}

/**
 * Filters GeoJSON features by submitted_by / encuestador
 * @param {Array<object>} features 
 * @param {string} enumerator 
 * @returns {Array<object>}
 */
export function filterFeaturesByEnumerator(features = [], enumerator) {
  if (!enumerator || enumerator === 'ALL') return features;
  const target = enumerator.toLowerCase().trim();
  return features.filter(f => {
    const name = (f.properties?.submitted_by || f.properties?._submitted_by || '').toLowerCase();
    return name.includes(target);
  });
}

/**
 * Normalizes surveyor names, cleaning typos, accents, case, and removing numeric IDs
 * @param {string} name 
 * @returns {string|null}
 */
export function normalizeSurveyorName(name) {
  if (!name || typeof name !== 'string') return null;
  const str = name.trim();
  if (/^\d+$/.test(str)) return null; // Ignore pure Cédula numbers

  const normalized = str
    .toLowerCase()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const aliasMap = {
    'A Ana Narváez': 'Ana Narváez',
    'Ama Narváez': 'Ana Narváez',
    'Rossy Moya': 'Rossy Moya',
    'Gladie José T': 'Gladie José Urbina',
    'Gladie José Urbina Urbina': 'Gladie José Urbina',
    'Maria Jose Salazar': 'María Salazar',
    'Maria Salazar': 'María Salazar',
    'Mairelys Mato': 'Mairelys Mota',
    'Mairelys Mota': 'Mairelys Mota',
    'Yamileth Mogollon': 'Yamileth Mogollón',
    'Yamileth Mogollón': 'Yamileth Mogollón',
    'Ahilyn Zambrano': 'Ahilyn Zambrano',
    'Johana Larez': 'Johana Lárez',
    'Natacha Parejo': 'Natacha Parejo'
  };

  return aliasMap[normalized] || normalized;
}

/**
 * Filters GeoJSON features by category / sector
 * @param {Array<object>} features 
 * @param {string} category 
 * @returns {Array<object>}
 */
export function filterFeaturesByCategory(features = [], category) {
  if (!category || category === 'ALL') return features;
  return features.filter(f => f.properties?.categoria === category);
}

/**
  Official Parroquia Name Dictionary for Maturín, Monagas
 */
export const PARROQUIA_NAMES = {
  '01': 'Maturín Rural',
  '02': 'Alto de los Godos',
  '03': 'Boquerón',
  '04': 'Las Cocuizas',
  '05': 'San Simón',
  '06': 'Santa Cruz',
  '07': 'Corozo',
  '08': 'Furrial',
  '09': 'Jusepín',
  '10': 'La Pica',
  '11': 'San Vicente',
  '1': 'Maturín Rural',
  '2': 'Alto de los Godos',
  '3': 'Boquerón',
  '4': 'Las Cocuizas',
  '5': 'San Simón',
  '6': 'Santa Cruz',
  '7': 'Corozo',
  '8': 'Furrial',
  '9': 'Jusepín'
};

/**
 * Returns human-readable official Parroquia name from code
 * @param {string|number} code 
 * @returns {string}
 */
export function formatParroquiaName(code) {
  if (!code) return 'No especificada';
  const padded = String(code).trim().padStart(2, '0');
  const name = PARROQUIA_NAMES[padded] || PARROQUIA_NAMES[code];
  return name ? `${name} (${padded})` : `Parroquia ${code}`;
}

/**
  Official Sector Name Dictionary for Maturín, Monagas
 */
export const SECTOR_NAMES = {
  '01': 'Adyacencias Mercado',
  '02': 'Adyacencias Alumbrado',
  '03': 'Los Guaritos',
  '04': 'Los Guaritos I y II',
  '05': 'Los Guaritos III y IV',
  '06': 'Los Guaritos V',
  '07': 'La Muralia',
  '08': 'Av. Principal Tipuro',
  '09': 'Tipuro',
  '10': 'Av. Principal Las Cocuizas',
  '11': 'Valle Verde',
  '12': 'San Jacinto',
  '13': 'Los Cortijos',
  '14': 'La Manga',
  '15': 'Adyacencias Plaza Bolívar',
  '16': 'Av. Bicentenario',
  '17': 'Av. Juncal',
  '18': 'Maco I',
  '19': 'El Corozo',
  '20': 'El Furrial',
  '21': 'Jusepín',
  '22': 'Sector La Pica',
  '23': 'San Vicente',
  '1': 'Adyacencias Mercado',
  '2': 'Adyacencias Alumbrado',
  '3': 'Los Guaritos',
  '4': 'Los Guaritos I y II',
  '5': 'Los Guaritos III y IV',
  '6': 'Los Guaritos V',
  '7': 'La Muralia',
  '8': 'Av. Principal Tipuro',
  '9': 'Tipuro'
};

/**
 * Returns human-readable official Sector name from code
 * @param {string|number} code 
 * @returns {string}
 */
export function formatSectorName(code) {
  if (!code) return 'No especificado';
  const padded = String(code).trim().padStart(2, '0');
  const name = SECTOR_NAMES[padded] || SECTOR_NAMES[code];
  return name ? `${name} (${padded})` : `Sector ${code}`;
}

/**
 * Filters GeoJSON features by Parroquia code
 * @param {Array<object>} features 
 * @param {string} parroquia 
 * @returns {Array<object>}
 */
export function filterFeaturesByParroquia(features = [], parroquia) {
  if (!parroquia || parroquia === 'ALL') return features;
  return features.filter(f => String(f.properties?.['S1/par']) === String(parroquia));
}

/**
 * Filters GeoJSON features by Sector code
 * @param {Array<object>} features 
 * @param {string} sector 
 * @returns {Array<object>}
 */
export function filterFeaturesBySector(features = [], sector) {
  if (!sector || sector === 'ALL') return features;
  return features.filter(f => String(f.properties?.['S1/sec']) === String(sector));
}

/**
 * Filters GeoJSON features by text query
 * @param {Array<object>} features 
 * @param {string} searchText 
 * @returns {Array<object>}
 */
export function filterFeaturesBySearchText(features = [], searchText) {
  if (!searchText || !searchText.trim()) return features;
  const query = searchText.toLowerCase().trim();

  return features.filter(f => {
    const p = f.properties || {};
    const textCorpus = [
      p.id,
      p.uuid,
      p.submitted_by,
      p.categoria,
      p.estado_atencion,
      p.municipio,
      p.parroquia,
      p.observaciones
    ].filter(Boolean).join(' ').toLowerCase();

    return textCorpus.includes(query);
  });
}

/**
 * Calculates quick dashboard KPIs
 * @param {Array<object>} features 
 * @param {number} totalInDataset 
 * @returns {object}
 */
export function calculateKPIs(features = [], totalInDataset = 0) {
  const geocodedCount = features.length;
  const total = Math.max(geocodedCount, totalInDataset);
  const percentGeocoded = total > 0 ? Math.round((geocodedCount / total) * 100) : 0;

  const categoryCounts = {};
  const statusCounts = {};

  let latestDate = null;

  for (const f of features) {
    const cat = f.properties?.categoria || 'Sin Categoría';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    const st = f.properties?.estado_atencion || 'Pendiente';
    statusCounts[st] = (statusCounts[st] || 0) + 1;

    const subTime = f.properties?.submission_time;
    if (subTime) {
      const d = new Date(subTime);
      if (!latestDate || d > latestDate) {
        latestDate = d;
      }
    }
  }

  return {
    total,
    geocodedCount,
    percentGeocoded,
    categoryCounts,
    statusCounts,
    lastSync: latestDate ? formatDate(latestDate) : 'Reciente'
  };
}
