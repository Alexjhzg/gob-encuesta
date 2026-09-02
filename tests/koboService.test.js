import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchKoboSubmissions, validateKoboConnection } from '../server/koboService.js';

describe('TDD 1.2: Kobo API v2 Service Module', () => {
  const mockServerUrl = 'https://kf.kobotoolbox.org';
  const mockAssetUid = 'aX9kL3mP9qZ';
  const mockToken = 'test-token-12345';

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should construct correct request headers and URL for Kobo API v2', async () => {
    const mockApiResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        { _id: 1, _geolocation: [10.48, -66.90], _submitted_by: 'user1' },
        { _id: 2, _geolocation: [10.49, -66.91], _submitted_by: 'user2' }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockApiResponse
    });

    const data = await fetchKoboSubmissions({
      serverUrl: mockServerUrl,
      assetUid: mockAssetUid,
      token: mockToken,
      limit: 50,
      offset: 0
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [callUrl, callInit] = global.fetch.mock.calls[0];

    expect(callUrl).toContain('https://kf.kobotoolbox.org/api/v2/assets/aX9kL3mP9qZ/data/');
    expect(callUrl).toContain('limit=50');
    expect(callUrl).toContain('offset=0');
    expect(callInit.headers.Authorization).toBe('Token test-token-12345');
    expect(data.results).toHaveLength(2);
    expect(data.count).toBe(2);
  });

  it('should throw an informative error on 401 Unauthorized', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => 'Invalid token'
    });

    await expect(
      fetchKoboSubmissions({
        serverUrl: mockServerUrl,
        assetUid: mockAssetUid,
        token: 'invalid-token'
      })
    ).rejects.toThrow(/401/);
  });

  it('should validate connection successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ uid: mockAssetUid, name: 'Encuesta Gobernación' })
    });

    const isValid = await validateKoboConnection({
      serverUrl: mockServerUrl,
      assetUid: mockAssetUid,
      token: mockToken
    });

    expect(isValid.success).toBe(true);
  });
});
