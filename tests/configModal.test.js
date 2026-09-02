import { describe, it, expect } from 'vitest';
import { SERVER_OPTIONS, buildConfigPayload } from '../src/utils/configModalHelpers.js';

describe('ConfigModal Helpers', () => {
  it('provides default server URL options', () => {
    expect(SERVER_OPTIONS.length).toBeGreaterThanOrEqual(3);
    expect(SERVER_OPTIONS[0].value).toBe('https://kf.kobotoolbox.org');
  });

  it('builds cleaned configuration payload', () => {
    const payload = buildConfigPayload({
      serverUrl: 'https://kf.kobotoolbox.org ',
      assetUid: '  aJwBHzgWAqMozzcGLbZjgE ',
      token: '  my-token-123 '
    });

    expect(payload).toEqual({
      serverUrl: 'https://kf.kobotoolbox.org',
      assetUid: 'aJwBHzgWAqMozzcGLbZjgE',
      token: 'my-token-123'
    });
  });
});
