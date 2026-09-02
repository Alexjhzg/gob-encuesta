/**
 * Mock Data Generator for Regional Geospatial Field Surveys.
 * Generates realistic GeoJSON FeatureCollections for testing and Demo Mode.
 */

export const MOCK_ENUMERATORS = [
  'Ing. María Rodríguez',
  'Lic. Carlos Mendoza',
  'Dra. Elena Silva',
  'Tec. Roberto Gómez',
  'Sra. Ana Gutiérrez',
  'Ldo. Fernando Torres',
  'Ing. José Hernández'
];

export const MOCK_CATEGORIES = [
  'Infraestructura',
  'Salud',
  'Educación',
  'Seguridad',
  'Vialidad',
  'Agua y Sanidad',
  'Alumbrado Público'
];

export const MOCK_MUNICIPALITIES = [
  { municipio: 'Municipio Libertador', parroquias: ['Sucre (Catia)', 'El Recreo', 'La Vega', 'Caricuao', 'Antímano'] },
  { municipio: 'Municipio Sucre', parroquias: ['Petare', 'Leoncio Martínez', 'Caucagüita'] },
  { municipio: 'Municipio Chacao', parroquias: ['Chacao', 'El Rosal'] },
  { municipio: 'Municipio Baruta', parroquias: ['Nuestra Señora del Rosario', 'Las Minas'] },
  { municipio: 'Municipio El Hatillo', parroquias: ['Santa Rosalía de Palermo'] }
];

export const MOCK_STATUSES = [
  'Resuelto',
  'En Proceso',
  'Inspección Requerida',
  'Pendiente'
];

const OBSERVATION_SAMPLES = [
  'Inspección de tubería principal con fuga leve de agua potable.',
  'Revisión de infraestructura en ambulatorio local. Se requiere material eléctrico.',
  'Evaluación de falla de borde en avenida principal. Tramo señalizado.',
  'Verificación de alumbrado público. 4 luminarias LED requieren sustitución.',
  'Levantamiento de necesidades en escuela primaria. Pintura y reacondicionamiento de techo.',
  'Módulo policial con mantenimiento preventivo completado.',
  'Sustitución de válvula de drenaje de aguas servidas efectuada con éxito.'
];

/**
 * Generates pseudo-random float between min and max
 */
function randomFloat(min, max, decimals = 6) {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, decimals);
  return Math.round(rand * power) / power;
}

/**
 * Selects a random item from an array
 */
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates a mock GeoJSON FeatureCollection
 * @param {number} count Number of features to generate (default 50)
 * @returns {object} GeoJSON FeatureCollection
 */
export function generateMockGeoJSON(count = 50) {
  const features = [];
  const now = new Date();

  // Caracas Metropolitan Region bounding coordinates: Lat [10.42, 10.53], Lon [-67.00, -66.78]
  const baseLat = 10.475;
  const baseLon = -66.890;

  for (let i = 1; i <= count; i++) {
    // Generate cluster hubs around specific focal points
    const hubOffsetLat = (i % 5) * 0.02 - 0.04;
    const hubOffsetLon = (i % 5) * 0.03 - 0.06;

    const lat = randomFloat(baseLat + hubOffsetLat - 0.015, baseLat + hubOffsetLat + 0.015, 6);
    const lon = randomFloat(baseLon + hubOffsetLon - 0.02, baseLon + hubOffsetLon + 0.02, 6);

    const munObj = randomItem(MOCK_MUNICIPALITIES);
    const parroquia = randomItem(munObj.parroquias);

    // Random date within past 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const subDate = new Date(now.getTime() - (daysAgo * 86400000 + hoursAgo * 3600000));

    const id = 1000 + i;
    const enumerator = randomItem(MOCK_ENUMERATORS);
    const category = randomItem(MOCK_CATEGORIES);
    const status = randomItem(MOCK_STATUSES);
    const obs = randomItem(OBSERVATION_SAMPLES);
    const precision = randomFloat(1.5, 6.0, 1);
    const altitude = Math.floor(randomFloat(400, 1050));

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lon, lat] // [longitude, latitude]
      },
      properties: {
        id: id,
        _id: id,
        uuid: `mock-uuid-${id}`,
        submitted_by: enumerator,
        _submitted_by: enumerator,
        submission_time: subDate.toISOString(),
        _submission_time: subDate.toISOString(),
        status: status === 'Resuelto' ? 'approved' : 'submitted',
        latitude: lat,
        longitude: lon,
        altitude: altitude,
        precision: precision,
        categoria: category,
        estado_atencion: status,
        municipio: munObj.municipio,
        parroquia: parroquia,
        observaciones: obs,
        prioridad: status === 'Inspección Requerida' ? 'Alta' : 'Media',
        atendidos_estimados: Math.floor(randomFloat(50, 800))
      }
    });
  }

  return {
    type: 'FeatureCollection',
    features,
    meta: {
      total: count,
      geocoded_count: count,
      non_geocoded_count: 0,
      is_mock: true,
      limit: count,
      offset: 0,
      timestamp: new Date().toISOString()
    }
  };
}
