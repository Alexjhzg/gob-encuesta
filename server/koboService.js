/**
 * KoboToolbox KPI API v2 Service Module.
 * Connects securely to KoboToolbox servers with Token authentication.
 */

/**
 * Normalizes server URL ensuring protocol and clean slashes.
 * @param {string} url 
 * @returns {string}
 */
export function normalizeServerUrl(url = 'https://kf.kobotoolbox.org') {
  let cleaned = url.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned.replace(/\/+$/, '');
}

/**
 * Fetches raw submission data from KoboToolbox API v2 endpoint.
 * @param {object} params 
 * @returns {Promise<object>}
 */
export async function fetchKoboSubmissions({
  serverUrl = 'https://kf.kobotoolbox.org',
  assetUid,
  token,
  limit = 100,
  offset = 0
}) {
  if (!assetUid) {
    throw new Error('El identificador del formulario (Asset UID) es requerido.');
  }

  if (!token) {
    throw new Error('El token de API de KoboToolbox (KOBO_API_TOKEN) es requerido.');
  }

  const baseUrl = normalizeServerUrl(serverUrl);
  const endpoint = `${baseUrl}/api/v2/assets/${assetUid}/data/?limit=${limit}&offset=${offset}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      let message = `Kobo API HTTP Error ${response.status}: ${response.statusText}`;

      if (response.status === 401) {
        message = 'Error de Autenticación 401: Token de KoboToolbox no válido o expirado.';
      } else if (response.status === 404) {
        message = `Formulario 404: No se encontró el Asset UID '${assetUid}' en el servidor '${baseUrl}'.`;
      }

      const err = new Error(message);
      err.status = response.status;
      err.details = errorText;
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.status) throw error;
    throw new Error(`Error de conexión con KoboToolbox (${baseUrl}): ${error.message}`);
  }
}

/**
 * Validates connection and asset existence with Kobo API v2.
 * @param {object} params 
 * @returns {Promise<{ success: boolean, name?: string, uid?: string, error?: string }>}
 */
export async function validateKoboConnection({ serverUrl, assetUid, token }) {
  if (!token || !assetUid) {
    return { success: false, error: 'Token y Asset UID son obligatorios' };
  }

  const baseUrl = normalizeServerUrl(serverUrl);
  const endpoint = `${baseUrl}/api/v2/assets/${assetUid}/`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const asset = await response.json();
      return {
        success: true,
        name: asset.name || 'Formulario KoboToolbox',
        uid: asset.uid || assetUid
      };
    } else {
      return {
        success: false,
        error: `Error HTTP ${response.status}: Autenticación fallida o formulario no existe.`
      };
    }
  } catch (err) {
    return {
      success: false,
      error: `No se pudo conectar con el servidor Kobo (${baseUrl}): ${err.message}`
    };
  }
}
