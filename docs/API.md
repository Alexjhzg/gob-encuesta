# Documentación de la API — GeoEncuestas

El proyecto expone una API REST interna que actúa como proxy hacia **KoboToolbox KPI API v2** y motor de transformación a GeoJSON.

- **Backend Principal (Python / FastAPI)**: [`backend/main.py`](../backend/main.py) — Puerto por defecto `8005`.
  - Swagger UI en runtime: `http://localhost:8005/docs`
  - Esquema OpenAPI en runtime: `http://localhost:8005/openapi.json`
- **Backend Alternativo (Node.js / Express)**: [`server/index.js`](../server/index.js) — Puerto por defecto `3001` (`process.env.PORT`).
- **Cliente Frontend**: [`src/services/api.js`](../src/services/api.js) (consume `/api/kobo/*` o `VITE_API_BASE_URL + /api/kobo/*`).

---

## 1. Resumen de Endpoints

| Método | Ruta | FastAPI | Express | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/kobo/health` | Sí | Sí | Verifica estado operativo del servicio proxy. |
| `GET` | `/api/kobo/data` | Sí | Sí | Consulta envíos en KoboToolbox v2 y devuelve un GeoJSON `FeatureCollection`. |
| `POST` | `/api/kobo/test-connection` | Sí | Sí | Valida credenciales y existencia de un `assetUid` en KoboToolbox. |
| `GET` | `/api/kobo/options` | Sí | Sí | Devuelve listas estáticas de `enumerators` y `categories` mock. |
| `GET` | `/api/kobo/download/{filename}` | Sí | No | Descarga un archivo JSON/GeoJSON permitido desde `data/`. |
| `GET` | `/` y `/{full_path:path}` | Sí | Sí | Sirve `dist/index.html` (SPA fallback) o JSON informativo si `dist/` no existe. |

---

## 2. Detalle de Contratos

### 2.1 `GET /api/kobo/health`

Comprueba la disponibilidad del servidor proxy.

- **Respuesta `200 OK` (FastAPI)**:
```json
{
  "status": "ok",
  "service": "KoboToolbox FastAPI Proxy API & GeoJSON Engine",
  "timestamp": "2026-08-31T17:30:00.000000+00:00"
}
```

---

### 2.2 `GET /api/kobo/data`

Obtiene los envíos del formulario KoboToolbox especificado y los transforma en GeoJSON.

#### Parámetros Query

| Parámetro | Tipo | Default (FastAPI) | Default (Express) | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `serverUrl` | `string` | `KOBO_SERVER_URL` o `https://kf.kobotoolbox.org` | Igual | URL base del servidor KoboToolbox. |
| `assetUid` | `string` | `KOBO_ASSET_UID` | Igual | Identificador único del formulario Kobo. |
| `token` | `string` | `KOBO_API_TOKEN` | Igual | Token de autenticación KoboToolbox. |
| `limit` | `integer` | `1000` (`1..5000`) | `60` | Cantidad máxima de envíos a solicitar. |
| `offset` | `integer` | `0` (`>= 0`) | `0` | Desplazamiento para paginación. |
| `demo` | `boolean` | `false` *(nota: no activa mock en FastAPI actual)* | `'false'` *(activa mock si `'true'` o sin credenciales)* | Solicitud de datos de demostración. |

> **Diferencia importante entre backends**:
> - En **FastAPI** (`backend/main.py`), si faltan `token` o `assetUid`, responde `400 Bad Request` (`detail`: `"Credenciales faltantes: Se requiere Token de API y Asset UID de KoboToolbox."`).
> - En **Express** (`server/index.js`), si `demo === 'true'` o faltan `token`/`assetUid`, responde `200 OK` con datos simulados (`generateMockGeoJSON`).

#### Respuesta `200 OK`

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-63.1833, 9.7457]
      },
      "properties": {
        "id": 123456,
        "submitted_by": "Ana Narváez",
        "submission_time": "2026-08-29T14:22:10+00:00",
        "uuid": "550e8400-e29b-41d4-a716-446655440000",
        "status": "submitted_via_web",
        "latitude": 9.7457,
        "longitude": -63.1833,
        "altitude": 67.0,
        "precision": 4.2,
        "categoria": "Intención de Voto",
        "estado_atencion": "Registrado",
        "observaciones": ""
      }
    }
  ],
  "meta": {
    "total": 594,
    "geocoded_count": 505,
    "non_geocoded_count": 89,
    "limit": 1000,
    "offset": 0,
    "timestamp": "2026-08-31T17:29:54.213681+00:00"
  }
}
```

#### Errores

| Código | Cuándo Ocurre | Formato FastAPI | Formato Express |
| :--- | :--- | :--- | :--- |
| `400` | Faltan credenciales o error HTTP de Kobo (`401`/`404` encapsulado como `RuntimeError` en FastAPI). | `{"detail": "..."}` | `{"error": "...", "details": "..."}` |
| `422` | Parámetros `limit`/`offset` fuera de rango (solo FastAPI). | Esquema estándar `HTTPValidationError` | N/A |
| `500` | Error inesperado del servidor o fallo de red. | `{"detail": "Error inesperado backend: ..."}` | `{"error": "...", "details": null}` |

---

### 2.3 `POST /api/kobo/test-connection`

Valida que el token y `assetUid` puedan consultar `/api/v2/assets/{assetUid}/` en el servidor KoboToolbox.

#### Cuerpo de Petición (`application/json`)

```json
{
  "serverUrl": "https://kf.kobotoolbox.org",
  "assetUid": "aJwBHzgWAqMozzcGLbZjgE",
  "token": "<KOBO_API_TOKEN>"
}
```

#### Respuesta `200 OK`

```json
{
  "success": true,
  "name": "Intención de Voto y Clima Electoral",
  "uid": "aJwBHzgWAqMozzcGLbZjgE"
}
```

#### Respuesta `400 Bad Request`

```json
{
  "success": false,
  "error": "Tanto el Token de API como el Asset UID del formulario son requeridos."
}
```

---

### 2.4 `GET /api/kobo/options`

Devuelve listas base de encuestadores y categorías de prueba (`MOCK_ENUMERATORS` y `MOCK_CATEGORIES`).

- **Respuesta `200 OK`**:
```json
{
  "enumerators": ["Ing. María Rodríguez", "Lic. Carlos Mendoza"],
  "categories": ["Infraestructura", "Salud", "Educación"]
}
```

---

### 2.5 `GET /api/kobo/download/{filename}` (Solo FastAPI)

Descarga uno de los 4 archivos en lista blanca ubicados en `data/`:
- `intencion_de_voto.geojson`
- `intencion_de_voto_raw.json`
- `aspectos_politicos_y_sociales.geojson`
- `aspectos_politicos_y_sociales_raw.json`

- **Respuesta `200 OK`**: `FileResponse` con `Content-Type: application/json`.
- **Respuesta `404 Not Found`**: Si `filename` no está en `allowed_files` o el archivo físico aún no existe.

---

## 3. Notas de Integración

- **Autenticación de Proxy**: `src/services/api.js` envía el token opcional mediante la cabecera HTTP `X-Kobo-Token` (no en query string). Ambos backends (`backend/main.py` y `server/index.js`) priorizan `X-Kobo-Token` y, si está ausente, usan `KOBO_API_TOKEN` del entorno.
- **Protección SSRF**: `serverUrl` se valida contra HTTPS obligatorio, sin IPs directas y contra la lista blanca `ALLOWED_KOBO_HOSTS` (`kf.kobotoolbox.org`, `eu.kobotoolbox.org`, `kobo.humanitarianresponse.info` por defecto).
- **Manejo de Errores**: `src/services/api.js` lee `errorData.error || errorData.detail` para mantener compatibilidad total entre Express (`error`) y FastAPI (`detail`).

