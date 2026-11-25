---
name: frontend-dev
description: Desarrollo de interfaz React 19, Tailwind CSS v4, mapas Leaflet (MapView), analítica Chart.js (DashboardView) y utilidades de filtrado espacial en GeoEncuestas.
---

# Skill: Frontend Developer — GeoEncuestas

## Cuándo activar
Activa esta skill al crear o modificar componentes en `src/components/`, estilos en `src/index.css`, cliente HTTP en `src/services/api.js` o utilidades en `src/utils/`.

## Stack y Rutas Clave
- **Core**: `src/App.jsx`, `src/main.jsx`, `src/services/api.js`.
- **Componentes**: `Header`, `Sidebar`, `MapView`, `DataTable`, `DashboardView`, `RecordDetail`, `ConfigModal`, `LoadingScreen`.
- **Utilidades puras**: `src/utils/formattersAndFilters.js`, `src/utils/dashboardAnalytics.js`, `src/utils/mapHelpers.js`, `src/utils/recordDetailHelpers.js`, `src/utils/exporters.js`, `src/utils/tableHelpers.js`.

## Reglas de Implementación
1. **Design System**: Respeta estrictamente `docs/DESIGN_SYSTEM.md` (tema oscuro `slate-950`/`slate-900`, fuente `Inter`, paleta `COLOR_PALETTES` y textos en español).
2. **Separación de Lógica**: Mantén transformaciones, cálculos KPI y filtros como funciones puras en `src/utils/` para que sigan siendo testeables en Vitest (`environment: 'node'`).
3. **Mapas y Seguridad DOM**:
   - Protege `MapView.jsx` contra contenedores `0x0` (`ResizeObserver` + validación en `emitBounds`).
   - Evita `innerHTML` con datos crudos de KoboToolbox; construye nodos DOM con `textContent` o escapa HTML.
4. **Verificación**:
   ```bash
   npm run lint
   npm run format:check
   npm run build
   npm test
   ```

