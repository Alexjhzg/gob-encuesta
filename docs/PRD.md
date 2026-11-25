# PRD — GeoEncuestas (KoboToolbox Spatial Intelligence Platform)

| Campo | Valor |
| :--- | :--- |
| **Nombre del Producto** | GeoEncuestas / `kobo-geo-dashboard` |
| **Versión** | `1.0.0` |
| **Licencia** | MIT |
| **Estado** | Operativo (MVP productivo con 2 instrumentos activos) |
| **Fuente de Verdad** | Código fuente en `src/`, `backend/` y `server/` |

---

## 1. Resumen Ejecutivo

**GeoEncuestas** es una plataforma web de inteligencia territorial y visualización geoespacial diseñada para consultar, transformar, filtrar y analizar en tiempo real encuestas de campo recolectadas mediante **KoboToolbox (KPI API v2)**.

El sistema convierte envíos tabulares con coordenadas GPS provenientes de KoboToolbox en una `FeatureCollection` GeoJSON estandarizada, sincronizando un mapa interactivo (**Leaflet**), una tabla paginada y ordenable (`DataTable`), un panel de ficha completa (`RecordDetail`) y un dashboard analítico (**Chart.js**) con más de 20 indicadores demográficos, electorales y de gestión pública.

---

## 2. Problema y Objetivos de Negocio

### Problema
Los equipos de campo y coordinación territorial recopilan cientos de encuestas en KoboToolbox que contienen respuestas codificadas (`1_ernesto_luna`, `S1/par`, `aspectos_politicos_sociales/...`) y coordenadas GPS heterogéneas. Analizar estas respuestas en hojas de cálculo estáticas impide:
- Cruzar la dimensión territorial (parroquia, sector y área visible en mapa) con resultados de opinión.
- Supervisar en tiempo real la productividad de empadronadores.
- Exportar subconjuntos filtrados para sistemas GIS o reportes ejecutivos.

### Objetivos
1. **Visualización Geoespacial Inmediata**: Representar cada encuesta geolocalizada sobre mapas base OpenStreetMap y Satelital (ESRI World Imagery).
2. **Sincronización Espacial (Bounding Box)**: Filtrar dinámicamente la tabla de registros según el cuadrante visible del mapa.
3. **Analítica Multidimensional**: Traducir códigos crudos de KoboToolbox en etiquetas legibles y gráficos interactivos para dos instrumentos principales:
   - *Intención de Voto y Clima Electoral* (`aJwBHzgWAqMozzcGLbZjgE`, snapshot local: 594 envíos, 505 geolocalizados).
   - *Aspectos Políticos y Sociales* (`ajgQTzZcCG3ccEuB8dvNZc`, snapshot local: 607 envíos, 496 geolocalizados).
4. **Portabilidad de Datos**: Exportación directa del subconjunto filtrado a **GeoJSON** y **CSV**.

---

## 3. Usuarios Objetivo (Personas)

| Rol | Objetivo Principal | Vistas Utilizadas |
| :--- | :--- | :--- |
| **Coordinador Territorial** | Monitorear cobertura por parroquia/sector (Maturín, Monagas) y detectar zonas sin relevamiento. | `MapView`, `Sidebar`, `Header` (KPIs) |
| **Analista de Datos / Estratega** | Evaluar intención de voto, propensión electoral, percepción de gestión y demografía. | `DashboardView`, `ExportActions` (CSV/GeoJSON) |
| **Supervisor de Campo** | Auditar calidad GPS, productividad por encuestador y respuestas individuales. | `DataTable`, `RecordDetail`, filtro de encuestador |
| **Administrador Técnico** | Configurar URL del servidor Kobo, `Asset UID` y token API, y validar conectividad. | `ConfigModal`, `/api/kobo/test-connection`, `/api/kobo/health` |

---

## 4. Alcance Funcional Actual (Implementado)

| ID | Módulo | Funcionalidad Real Implementada | Referencia en Código |
| :--- | :--- | :--- | :--- |
| **RF-01** | Selector de Encuesta | Cambio dinámico entre activos Kobo (`aJwBHzgWAqMozzcGLbZjgE` y `ajgQTzZcCG3ccEuB8dvNZc`) con persistencia en `localStorage`. | `src/components/Header/SurveySelector.jsx`, `src/utils/headerHelpers.js` |
| **RF-02** | Mapa Interactivo | Renderizado de pines personalizados según estado/categoría, popups con resumen, cambio de capa base (OSM / Satelital ESRI), auto-ajuste (`fitBounds`) y `flyTo` al seleccionar registro. | `src/components/MapView.jsx`, `src/utils/mapHelpers.js` |
| **RF-03** | Filtro Espacial (BBox) | Al mover o hacer zoom en el mapa, `MapView` emite `{ south, west, north, east }` para sincronizar `DataTable`. | `src/App.jsx`, `src/utils/formattersAndFilters.js` |
| **RF-04** | Filtros de Atributos | Filtrado en memoria por texto libre, rango de fechas (`startDate`, `endDate`), encuestador normalizado, parroquia (`S1/par`), sector (`S1/sec`) y categoría. | `src/components/Sidebar.jsx`, `src/utils/formattersAndFilters.js` |
| **RF-05** | Tabla de Datos | Tabla paginada (15 filas por página), ordenable por columnas y vinculada al detalle y centrado del mapa. | `src/components/DataTable.jsx`, `src/utils/tableHelpers.js` |
| **RF-06** | Ficha de Registro | Drawer modal con metadatos GPS (lat, lon, altitud, precisión), estado y listado completo de respuestas traducidas mediante `QUESTION_LABELS` y `formatValueLabel`. | `src/components/RecordDetail.jsx`, `src/utils/recordDetailHelpers.js` |
| **RF-07** | Dashboard Analítico | Tarjetas KPI, gráficos de dona y barras (`Chart.js`) y listas de distribución porcentual para demografía (sexo/edad), intención electoral y evaluación de servicios/gestión. | `src/components/DashboardView.jsx`, `src/utils/dashboardAnalytics.js` |
| **RF-08** | Exportación | Descarga en navegador de los registros actualmente filtrados en formato `.geojson` y `.csv`. | `src/utils/exporters.js` |
| **RF-09** | Proxy Backend Dual | Backend principal en **FastAPI** (`backend/main.py`, puerto `8005`) y servidor alternativo en **Express** (`server/index.js`, puerto `3001`) con soporte de transformación GeoJSON, validación de conexión y descarga de snapshots locales (solo FastAPI). | `backend/main.py`, `server/index.js` |
| **RF-10** | Configuración API | Modal para editar `serverUrl`, `assetUid` y `token`, con prueba de conexión en vivo (`POST /api/kobo/test-connection`). | `src/components/ConfigModal.jsx`, `src/services/api.js` |

---

## 5. Requisitos No Funcionales

| Categoría | Estado / Especificación Actual |
| :--- | :--- |
| **Responsividad** | Interfaz adaptativa móvil y escritorio (`< md` con conmutador Mapa/Tabla y sidebar tipo drawer con FAB; `>= md` vista dividida 60% mapa / 40% tabla). |
| **Rendimiento** | Build optimizado con `manualChunks` en Vite (`vendor`, `leaflet`, `charts`) y cálculos de filtrado/analítica memoizados con `useMemo`. |
| **Disponibilidad de Datos** | Modo demo/mock disponible en `backend/mock_data.py` y `server/mockData.js`; snapshots offline en `data/` descargables vía `download_kobo_data.py` y `/api/kobo/download/{filename}`. |
| **Calidad** | Cobertura automatizada con **Vitest** (`tests/`) y **Pytest** (`tests_python/`). |
| **Seguridad** | Requiere endurecimiento previo a exposición pública (ver [`SECURITY.md`](../SECURITY.md)). |

---

## 6. Fuera de Alcance Actual (No Implementado)

- Autenticación de usuarios finales (login, sesiones, RBAC).
- Base de datos persistente propia (PostgreSQL/PostGIS) o edición de encuestas desde el dashboard.
- Sincronización bidireccional (escritura hacia KoboToolbox).
- Agrupamiento visual activo con `leaflet.markercluster` (la dependencia está instalada en `package.json`, pero `MapView.jsx` usa `L.featureGroup()` para marcadores individuales).
- Despliegue contenedorizado (no existe `Dockerfile` ni pipelines CI/CD actualmente).

---

## 7. Métricas de Éxito

- **Tasa de geolocalización visible**: Porcentaje de envíos con coordenadas válidas (`percentGeocoded` en `calculateKPIs`).
- **Tiempo de respuesta del proxy**: Lectura y transformación de hasta `1000`–`5000` registros dentro del timeout de `15s` configurado en `httpx.AsyncClient`.
- **Cobertura territorial**: Número de parroquias (11 oficiales en Maturín) y sectores (23 oficiales) con datos capturados.

