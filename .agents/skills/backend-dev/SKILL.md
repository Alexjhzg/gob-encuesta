---
name: backend-dev
description: Desarrollo y mantenimiento del backend proxy FastAPI (backend/) y servidor Express alternativo (server/), integración con KoboToolbox KPI API v2 y seguridad HTTP.
---

# Skill: Backend Developer — GeoEncuestas

## Cuándo activar
Activa esta skill al modificar endpoints `/api/kobo/*`, la integración con KoboToolbox API v2 (`backend/kobo_service.py`, `server/koboService.js`), validación de payloads o configuración de CORS/timeouts.

## Stack y Rutas Clave
- **Principal (Python)**: `backend/main.py`, `backend/kobo_service.py`, `backend/geojson_transformer.py`, `backend/mock_data.py`.
- **Alternativo (Node.js)**: `server/index.js`, `server/koboService.js`, `server/geojsonTransformer.js`, `server/mockData.js`.
- **Tests**: `tests_python/test_*.py` y `tests/server/server.test.js`.

## Reglas de Implementación
1. **Tipado y Validación**: Usa modelos `pydantic.BaseModel` y validadores `Query(...)` en FastAPI; tipa todas las funciones Python.
2. **Resiliencia HTTP**: Usa `httpx.AsyncClient` con timeouts explícitos y mapeo claro de errores `401`, `404` y errores de red.
3. **Seguridad**:
   - Nunca hardcodees `KOBO_API_TOKEN`; lee siempre de variables de entorno o cabeceras seguras.
   - Mantén lista blanca estricta de archivos en `/api/kobo/download/{filename}`.
   - Restringe `serverUrl` contra listas blancas de hosts para prevenir SSRF.
4. **Verificación**:
   ```bash
   npm run lint:python
   npm run test:python
   npm test
   ```

