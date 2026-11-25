---
name: dba-data-engineer
description: Modelado de datos KoboToolbox, motor de transformación GeoJSON, catálogos territoriales (parroquias/sectores), normalización de encuestadores y snapshots en data/.
---

# Skill: DBA / Data Engineer — GeoEncuestas

## Cuándo activar
Activa esta skill al incorporar nuevos formularios KoboToolbox (`Asset UID`), actualizar diccionarios de preguntas/respuestas, modificar `parse_geopoint`/`transform_kobo_to_geojson`, ajustar catálogos territoriales o gestionar snapshots en `data/`.

## Rutas Clave
- **Transformadores**: `backend/geojson_transformer.py` y `server/geojsonTransformer.js`.
- **Catálogos y Normalización**: `src/utils/formattersAndFilters.js` (`PARROQUIA_NAMES`, `SECTOR_NAMES`, `normalizeSurveyorName`) y `src/utils/recordDetailHelpers.js` (`QUESTION_LABELS`, `VALUE_LABEL_MAP`).
- **Ingesta Offline**: `download_kobo_data.py` y archivos en `data/*.geojson`, `data/*_raw.json`.

## Reglas de Implementación
1. **Integridad GeoJSON (RFC 7946)**: Garantiza siempre el orden de coordenadas `[longitude, latitude]` en `geometry.coordinates`, manteniendo `latitude` y `longitude` explícitos en `properties`.
2. **Trazabilidad de Métricas**: Preserva `meta.total`, `meta.geocoded_count` y `meta.non_geocoded_count` exactos para los KPIs del `Header`.
3. **Consistencia Dual**: Cualquier regla nueva de extracción de encuestador o categoría debe mantenerse sincronizada entre `backend/geojson_transformer.py` y `server/geojsonTransformer.js`.
4. **Privacidad de Datos**: Evalúa la necesidad de anonimizar o excluir PII (`S0/cedula_encuestador`) antes de exponer o versionar snapshots en `data/`.
5. **Verificación**: Ejecuta `tests_python/test_geojson_transformer.py` y `tests/geojsonTransformer.test.js` tras cada cambio.

