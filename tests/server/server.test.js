import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../server/index.js';

describe('TDD 1.4: Express Proxy Server Endpoints', () => {
  it('GET /api/kobo/health should return status ok', async () => {
    const res = await request(app).get('/api/kobo/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toContain('KoboToolbox Proxy');
  });

  it('GET /api/kobo/data in demo mode should return GeoJSON FeatureCollection', async () => {
    const res = await request(app).get('/api/kobo/data?demo=true&limit=25');
    expect(res.status).toBe(200);
    expect(res.body.type).toBe('FeatureCollection');
    expect(res.body.features.length).toBeGreaterThan(0);
    expect(res.body.meta.is_mock).toBe(true);
  });

  it('POST /api/kobo/test-connection without token should return 400 with message', async () => {
    const res = await request(app)
      .post('/api/kobo/test-connection')
      .send({ serverUrl: 'https://kf.kobotoolbox.org', assetUid: '123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
