/**
 * Utility to parse KoboToolbox geopoint format and convert submissions to standard GeoJSON.
 */

/**
 * Parses a geopoint value from Kobo (string "lat lon alt precision" or array [lat, lon])
 * @param {string|Array<number>|object} value 
 * @returns {{ latitude: number, longitude: number, altitude: number, precision: number, coordinates: [number, number] } | null}
 */
export function parseGeopoint(value) {
  if (!value) return null;

  let lat, lon, alt = 0, precision = 0;

  if (Array.isArray(value) && value.length >= 2) {
    lat = parseFloat(value[0]);
    lon = parseFloat(value[1]);
    if (value.length >= 3) alt = parseFloat(value[2]) || 0;
    if (value.length >= 4) precision = parseFloat(value[3]) || 0;
  } else if (typeof value === 'string') {
    const parts = value.trim().split(/\s+/);
    if (parts.length >= 2) {
      lat = parseFloat(parts[0]);
      lon = parseFloat(parts[1]);
      if (parts.length >= 3) alt = parseFloat(parts[2]) || 0;
      if (parts.length >= 4) precision = parseFloat(parts[3]) || 0;
    }
  } else if (typeof value === 'object' && value !== null) {
    if (value.latitude !== undefined && value.longitude !== undefined) {
      lat = parseFloat(value.latitude);
      lon = parseFloat(value.longitude);
      alt = parseFloat(value.altitude) || 0;
      precision = parseFloat(value.precision) || 0;
    }
  }

  if (isNaN(lat) || isNaN(lon)) return null;

  return {
    latitude: lat,
    longitude: lon,
    altitude: alt,
    precision: precision,
    coordinates: [lon, lat] // GeoJSON format: [longitude, latitude]
  };
}

/**
 * Finds the geopoint field in a raw Kobo submission object.
 * @param {object} submission 
 * @returns {object|null}
 */
function findGeopointInSubmission(submission) {
  if (!submission || typeof submission !== 'object') return null;

  // 1. Check known Kobo keys first
  const knownKeys = ['_geolocation', 'start-geopoint', 'start_geopoint', 'location', 'geopoint', '_geopoint', 'gps', 'coordenadas'];
  for (const key of knownKeys) {
    if (submission[key]) {
      const parsed = parseGeopoint(submission[key]);
      if (parsed) return parsed;
    }
  }

  // 2. Fallback: inspect object values for any geopoint structure
  for (const [key, val] of Object.entries(submission)) {
    if (!key.startsWith('_') && val) {
      const parsed = parseGeopoint(val);
      if (parsed) return parsed;
    }
  }

  return null;
}

/**
 * Transforms an array of raw KoboToolbox submissions into a standard GeoJSON FeatureCollection.
 * @param {Array<object>} rawSubmissions 
 * @param {object} options 
 * @returns {object} GeoJSON FeatureCollection
 */
export function transformKoboToGeoJSON(rawSubmissions = [], options = {}) {
  let geocodedCount = 0;
  let nonGeocodedCount = 0;

  const features = [];

  for (const item of rawSubmissions) {
    const geo = findGeopointInSubmission(item);

    if (geo) {
      geocodedCount++;
      const { latitude, longitude, altitude, precision, coordinates } = geo;

      // Extract surveyor name checking custom form fields
      const surveyorName = item['S0/_xm_s0_nombreapellido'] ||
        item['S0/nombre_apellido'] ||
        item['S0/nombre_encuestador'] ||
        item['encuestador'] ||
        item._submitted_by ||
        item.submitted_by ||
        'Encuestador Anónimo';

      // Extract system fields & clean custom fields
      const properties = {
        ...item,
        id: item._id || item.id || `sub_${geocodedCount}`,
        submitted_by: typeof surveyorName === 'string' ? surveyorName.trim() : surveyorName,
        submission_time: item._submission_time || item.submission_time || new Date().toISOString(),
        uuid: item._uuid || item.uuid,
        status: item._status || item.status || 'submitted',
        latitude,
        longitude,
        altitude,
        precision,
        categoria: item.categoria || item.type || item.sector || (item._xform_id_string === 'ajgQTzZcCG3ccEuB8dvNZc' ? 'Aspectos Políticos' : 'Intención de Voto'),
        estado_atencion: item.estado_atencion || item.estado || 'Registrado',
        observaciones: item.observaciones || item.observacion || item.notes || ''
      };

      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates
        },
        properties
      });
    } else {
      nonGeocodedCount++;
    }
  }

  return {
    type: 'FeatureCollection',
    features,
    meta: {
      total: rawSubmissions.length,
      geocoded_count: geocodedCount,
      non_geocoded_count: nonGeocodedCount,
      limit: options.limit || rawSubmissions.length,
      offset: options.offset || 0,
      timestamp: new Date().toISOString()
    }
  };
}
