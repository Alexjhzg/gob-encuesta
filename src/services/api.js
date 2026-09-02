/**
 * Frontend API client to query the internal KoboToolbox Proxy Server.
 */

const API_HOST = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE = `${API_HOST}/api/kobo`;


/**
 * Fetches GeoJSON survey dataset from proxy
 */
export async function getGeoJSONData({
  serverUrl,
  assetUid,
  token,
  limit = 100,
  offset = 0,
  demo = false
} = {}) {
  const params = new URLSearchParams();
  if (serverUrl) params.append('serverUrl', serverUrl);
  if (assetUid) params.append('assetUid', assetUid);
  if (token) params.append('token', token);
  params.append('limit', String(limit));
  params.append('offset', String(offset));
  if (demo) params.append('demo', 'true');

  const res = await fetch(`${API_BASE}/data?${params.toString()}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}: Error al consultar servidor proxy`);
  }
  return await res.json();
}

/**
 * Tests connection with Kobo API credentials
 */
export async function testKoboConnection({ serverUrl, assetUid, token }) {
  const res = await fetch(`${API_BASE}/test-connection`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serverUrl, assetUid, token })
  });
  return await res.json();
}

/**
 * Fetches available enumerators and categories options
 */
export async function getOptions() {
  const res = await fetch(`${API_BASE}/options`);
  if (!res.ok) return { enumerators: [], categories: [] };
  return await res.json();
}
