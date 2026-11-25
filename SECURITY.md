# Política de Seguridad y Plan de Endurecimiento — GeoEncuestas

Este documento describe los controles de seguridad actuales identificados durante la auditoría del repositorio, los hallazgos de riesgo detectados en el código real y el plan de endurecimiento requerido antes de desplegar la plataforma en producción.

---

## 1. Controles de Seguridad Actuales

| Área | Estado Actual | Implementación Real |
| :--- | :--- | :--- |
| **Autenticación hacia KoboToolbox** | Implementado | Cabecera `Authorization: Token <token>` en `backend/kobo_service.py` y `server/koboService.js`. |
| **Protección contra Path Traversal** | Implementado | Lista blanca estricta (`allowed_files`) en `GET /api/kobo/download/{filename}` (`backend/main.py`). |
| **Protección SSRF en `serverUrl`** | Implementado | Validación de esquema `HTTPS`, bloqueo de IPs directas y lista blanca `ALLOWED_KOBO_HOSTS` en `backend/kobo_service.py` y `server/koboService.js`. |
| **Mitigación XSS en Popups de Mapa** | Implementado | Construcción segura de nodos DOM con `document.createElement` + `textContent` en `buildSafePopupContent` (`src/components/MapView.jsx`), sin uso de `innerHTML`. |
| **Transmisión de Token por Cabecera** | Implementado | El cliente (`src/services/api.js`) envía `X-Kobo-Token` en cabecera HTTP en lugar de query string; ambos backends priorizan la cabecera y mantienen fallback a `KOBO_API_TOKEN` del entorno. |
| **CORS Restringido por Entorno** | Implementado | Lista explícita de orígenes mediante `CORS_ORIGINS` (default `http://localhost:5173,http://127.0.0.1:5173`) en FastAPI y Express. |
| **Timeouts de Red Externos** | Implementado | `httpx.AsyncClient(timeout=15.0/10.0)` en FastAPI y `AbortSignal.timeout(15000/10000)` en Express. |
| **Gestión de Secretos** | Remediado en código | Eliminados los tokens hardcodeados en `src/App.jsx` y `download_kobo_data.py` (ahora leen variables de entorno). **Acción operativa pendiente**: rotar en KoboToolbox el token previamente expuesto en historial Git. |
| **Autenticación de Usuarios / RBAC** | **Faltante** | La aplicación aún no implementa login de usuarios finales ni control de roles. |
| **Rate Limiting / Cabeceras HTTP** | **Faltante** | No hay limitación de tasa ni cabeceras de seguridad (`CSP`, `HSTS`, `X-Content-Type-Options`, `X-Frame-Options`) en un reverse proxy. |

---

## 2. Estado de Hallazgos de Seguridad Detectados en Auditoría

| Severidad | ID | Estado | Ubicación Real | Descripción / Remediación |
| :---: | :--- | :---: | :--- | :--- |
| **CRÍTICA** | `SEC-01` | **Remediado en código** *(rotar token)* | `src/App.jsx`, `download_kobo_data.py` | Eliminado el token literal del código fuente y del bundle cliente; `download_kobo_data.py` exige `KOBO_API_TOKEN` en entorno. Rotar token en KoboToolbox y purgar historial Git si el repo es público. |
| **ALTA** | `SEC-02` | **Remediado** | `src/services/api.js`, `backend/main.py`, `server/index.js` | Migrado el envío de token desde `?token=...` hacia la cabecera HTTP `X-Kobo-Token`. |
| **ALTA** | `SEC-03` | **Remediado** | `backend/kobo_service.py`, `server/koboService.js` | Implementada `validate_server_url` / `validateServerUrl` con HTTPS obligatorio, bloqueo de IPs directas y lista blanca `ALLOWED_KOBO_HOSTS`. |
| **ALTA** | `SEC-04` | **Remediado** | `src/components/MapView.jsx` | Reemplazado `popupContent.innerHTML` por construcción DOM segura con `textContent` (`buildSafePopupContent`). |
| **MEDIA** | `SEC-05` | **Remediado** | `backend/main.py`, `server/index.js` | Reemplazado CORS abierto (`*`) por orígenes configurables mediante `CORS_ORIGINS`. |
| **MEDIA** | `SEC-06` | **Parcial** | `src/App.jsx` | Añadido `try/catch` en lectura de `localStorage`; para producción se recomienda mantener credenciales exclusivamente en el backend sin persistir tokens en el navegador. |
| **MEDIA** | `SEC-07` | **Pendiente (P2)** | `backend/main.py`, `data/` | Requiere autenticación/RBAC antes de exponer datos de encuestas o `/api/kobo/download/{filename}` en internet público. |

---

## 3. Plan de Endurecimiento para Producción

### Prioridad 0 — Inmediata (Antes de cualquier despliegue)
1. **Rotar el token de KoboToolbox expuesto** en la consola de KoboToolbox y revocar el token actual.
2. **Eliminar secretos del código y del historial Git**:
   - Retirar el `token` por defecto de `src/App.jsx` y usar exclusivamente variables de entorno en backend (`KOBO_API_TOKEN`) o ingreso temporal por sesión autenticada.
   - En `download_kobo_data.py`, leer `os.environ["KOBO_API_TOKEN"]` en lugar de una constante literal.
   - Limpiar secretos del historial Git si el repositorio es o será público.
3. **Mitigar XSS en `MapView.jsx`**: construir el contenido del popup usando nodos DOM (`document.createElement` + `textContent`) o una función estricta de escape HTML en lugar de interpolar variables dentro de `innerHTML`.

### Prioridad 1 — Corto Plazo (Pre-Producción)
4. **Bloquear SSRF en `serverUrl`**: restringir `serverUrl` a una lista blanca configurable por entorno (ej. `ALLOWED_KOBO_HOSTS=kf.kobotoolbox.org,eu.kobotoolbox.org`) y rechazar IPs privadas/loopback (`127.0.0.1`, `169.254.169.254`, `10.0.0.0/8`).
5. **Retirar `token` de Query Params**: preferir credenciales administradas solo en el backend; si se permite override por usuario, enviarlo en cabecera HTTP (`X-Kobo-Token`) sobre HTTPS únicamente y nunca en la URL.
6. **Restringir CORS**: reemplazar `allow_origins=["*"]` por una lista explícita desde variable de entorno `CORS_ORIGINS` (ej. `https://geoencuestas.dominio.gob`).
7. **Proteger PII / Coordenadas**: evaluar si `S0/cedula_encuestador` debe omitirse o enmascararse en la transformación GeoJSON antes de enviarse al navegador.

### Prioridad 2 — Producción Institucional (Auth & RBAC)
8. **Autenticación y RBAC**: implementar autenticación basada en OIDC/JWT o sesiones `HttpOnly; Secure; SameSite=Lax` con al menos tres roles:
   - `viewer`: solo lectura de mapa y dashboard (sin PII ni descarga raw).
   - `analyst`: lectura + exportación CSV/GeoJSON.
   - `admin`: gestión de credenciales Kobo y configuración de activos.
9. **Cabeceras de Seguridad y Rate Limiting**: configurar un reverse proxy (Nginx / Caddy / Cloud Load Balancer) con TLS 1.3, `HSTS`, `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` y rate limiting por IP sobre `/api/kobo/*`.
10. **Consolidar un único backend**: retirar o deshabilitar el servidor redundante no usado en producción (`server/` o `backend/`) para reducir superficie de ataque.

---

## 4. Reporte de Vulnerabilidades

Si detectas una vulnerabilidad de seguridad en este proyecto:
1. **No** abras un issue público con detalles explotables ni credenciales.
2. Reporta el hallazgo de forma privada al mantenedor del repositorio indicando ruta del archivo, pasos de reproducción e impacto estimado.

