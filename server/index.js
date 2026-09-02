import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchKoboSubmissions, validateKoboConnection } from './koboService.js';
import { transformKoboToGeoJSON } from './geojsonTransformer.js';
import { generateMockGeoJSON, MOCK_ENUMERATORS, MOCK_CATEGORIES } from './mockData.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static frontend assets if built
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Healthcheck route
app.get('/api/kobo/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KoboToolbox Proxy API & GeoJSON Engine',
    timestamp: new Date().toISOString()
  });
});

// Primary data proxy endpoint
app.get('/api/kobo/data', async (req, res) => {
  try {
    const {
      serverUrl = process.env.KOBO_SERVER_URL || 'https://kf.kobotoolbox.org',
      assetUid = process.env.KOBO_ASSET_UID,
      token = process.env.KOBO_API_TOKEN,
      limit = '60',
      offset = '0',
      demo = 'false'
    } = req.query;

    const parsedLimit = parseInt(limit, 10) || 60;
    const parsedOffset = parseInt(offset, 10) || 0;

    // Use Mock / Demo mode if explicitly requested or if credentials are missing
    if (demo === 'true' || !token || !assetUid) {
      const mockGeoJSON = generateMockGeoJSON(parsedLimit);
      return res.json(mockGeoJSON);
    }

    // Fetch from live Kobo API v2
    const rawData = await fetchKoboSubmissions({
      serverUrl,
      assetUid,
      token,
      limit: parsedLimit,
      offset: parsedOffset
    });

    const results = rawData.results || (Array.isArray(rawData) ? rawData : []);
    const geojson = transformKoboToGeoJSON(results, {
      limit: parsedLimit,
      offset: parsedOffset
    });

    res.json(geojson);
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
      details: error.details || null
    });
  }
});

// Test connection endpoint
app.post('/api/kobo/test-connection', async (req, res) => {
  try {
    const { serverUrl, assetUid, token } = req.body || {};

    if (!token || !assetUid) {
      return res.status(400).json({
        success: false,
        error: 'Tanto el Token de API como el Asset UID del formulario son requeridos.'
      });
    }

    const result = await validateKoboConnection({ serverUrl, assetUid, token });

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Get filter options (enumerators and categories)
app.get('/api/kobo/options', (req, res) => {
  res.json({
    enumerators: MOCK_ENUMERATORS,
    categories: MOCK_CATEGORIES
  });
});

// SPA Fallback to index.html for non-API GET requests
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.status(404).json({ error: 'Endpoint API no encontrado' });
  }
});

export { app };

// Start server if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`🚀 Proxy Server KoboToolbox API corriendo en http://localhost:${PORT}`);
  });
}
