---
name: qa-engineer
description: Estrategia de pruebas unitarias e integración con Vitest y Pytest, validación de regresión, calidad de build y verificación en runtime para GeoEncuestas.
---

# Skill: QA Engineer — GeoEncuestas

## Cuándo activar
Activa esta skill al escribir o ampliar pruebas en `tests/` o `tests_python/`, validar correcciones de bugs, auditar cobertura o certificar releases.

## Suites Existentes
- **Frontend y Express (Vitest)**: `tests/*.test.js` y `tests/server/server.test.js` (Supertest).
- **Backend Python (Pytest)**: `tests_python/test_main.py`, `tests_python/test_kobo_service.py`, `tests_python/test_geojson_transformer.py`, `tests_python/test_mock_data.py`.

## Reglas de Verificación
1. **Aislamiento de Red**: Las pruebas automatizadas nunca deben depender de llamadas reales a `kf.kobotoolbox.org`; usa mocks (`vi.fn`, `unittest.mock` / `pytest`).
2. **Casos Borde Obligatorios**:
   - Geopoints nulos, malformados, en string `"lat lon alt prec"`, lista `[lat, lon]` y objeto `{latitude, longitude}`.
   - Bounding boxes degenerados (`0x0`) en `filterFeaturesByBounds`.
   - Nombres de encuestadores con cédulas numéricas o variantes ortográficas en `normalizeSurveyorName`.
   - Exportación CSV con comillas, saltos de línea y campos vacíos (`exporters.js`).
   - Respuestas `400`, `401`, `404` y `500` en proxy FastAPI y Express.
3. **Gate de Calidad Completo**:
   ```bash
   npm run lint
   npm run lint:python
   npm run build
   npm test
   npm run test:python
   ```

