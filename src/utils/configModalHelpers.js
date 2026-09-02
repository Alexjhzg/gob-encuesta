export const SERVER_OPTIONS = [
  { value: 'https://kf.kobotoolbox.org', label: 'Global (kf.kobotoolbox.org)' },
  { value: 'https://eu.kobotoolbox.org', label: 'Unión Europea (eu.kobotoolbox.org)' },
  { value: 'https://kobo.humanitarianresponse.info', label: 'Humanitarian Response (Legacy)' }
];

export function buildConfigPayload({ serverUrl = '', assetUid = '', token = '' } = {}) {
  return {
    serverUrl: String(serverUrl).trim(),
    assetUid: String(assetUid).trim(),
    token: String(token).trim()
  };
}
