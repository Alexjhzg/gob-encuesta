# AGENTS.md — Reglas de Ingeniería y Calidad para GeoEncuestas

Este archivo define las reglas operativas obligatorias para cualquier agente o colaborador que trabaje en el repositorio `gob_encuesta` (**GeoEncuestas — KoboToolbox Spatial Intelligence Platform**).

---

## 1. Arquitectura y Fuentes de Verdad

Antes de modificar cualquier componente, consulta la documentación viva del proyecto:
- **Producto y Alcance**: `docs/PRD.md`
- **Sistema de Diseño**: `docs/DESIGN_SYSTEM.md`
- **Arquitectura y ADRs**: `docs/ARCHITECTURE.md`
- **Modelo de Datos / GeoJSON**: `docs/database_model.md`
- **Contratos de API**: `docs/API.md`
- **Seguridad y Hardening**: `SECURITY.md`
- **Estilo de Código**: `docs/CODE_STYLE.md`

---

## 2. Reglas Estrictas de Calidad y Tipado

1. **Veracidad**: Nunca inventes endpoints, propiedades de KoboToolbox ni dependencias no verificadas en `package.json` o `requirements.txt`.
2. **Backend Python (`backend/`)**:
   - Tipado estricto en todas las firmas públicas (`typing`, `pydantic.BaseModel`).
   - Operaciones HTTP externas siempre asíncronas (`httpx.AsyncClient`) con timeout explícito.
   - Cumplir con `ruff check` y `ruff format` según `pyproject.toml`.
3. **Frontend React / Express (`src/`, `server/`)**:
   - Separar lógica pura de filtrado, formateo, exportación y analítica en `src/utils/*.js` para mantener testabilidad en Vitest (`environment: 'node'`).
   - Respetar las reglas de Hooks (`eslint-plugin-react-hooks`) y formato Prettier (`.prettierrc`).
   - Mantener paridad o documentar explícitamente cualquier divergencia entre `backend/` (FastAPI, principal) y `server/` (Express, alternativo).
4. **Seguridad Obligatoria**:
   - **Prohibido** hardcodear tokens, secretos o credenciales de KoboToolbox en código fuente.
   - **Prohibido** interpolar datos externos sin escapar dentro de `innerHTML` o `dangerouslySetInnerHTML` (en particular en popups de Leaflet).
   - Validar cualquier URL externa antes de realizar peticiones desde el servidor (prevención SSRF).

---

## 3. Estándares UI/UX del Proyecto

- **Tema Dark-First**: Superficies `bg-slate-950` / `bg-slate-900`, bordes `border-slate-800`, tipografía `Inter` (`font-sans antialiased`) y textos en **español**.
- **Consistencia Visual**: Reutilizar `COLOR_PALETTES` y los mapas semánticos de `DashboardView.jsx` y `mapHelpers.js`.
- **Responsividad**: Verificar compatibilidad tanto en desktop (`>= md`: split 60/40 mapa-tabla) como en móvil (`< md`: conmutador Mapa/Tabla + sidebar drawer con FAB).

---

## 4. Verificación Obligatoria en Runtime

Ningún cambio se considera terminado sin ejecutar y verificar:
1. **Lint JS/React**: `npm run lint`
2. **Lint Python**: `npm run lint:python` (o `./venv/bin/ruff check backend tests_python download_kobo_data.py`)
3. **Build Producción**: `npm run build`
4. **Pruebas Frontend/Express**: `npm test`
5. **Pruebas Backend Python**: `npm run test:python`

---

## 5. Skills Disponibles por Rol (`.agents/skills/`)

| Rol | Ruta | Responsabilidad Principal |
| :--- | :--- | :--- |
| **Tech Lead** | `.agents/skills/tech-lead/SKILL.md` | Arquitectura, ADRs, seguridad, revisión de PRs y paridad entre stacks. |
| **Backend Dev** | `.agents/skills/backend-dev/SKILL.md` | FastAPI (`backend/`), Express (`server/`), cliente KoboToolbox API v2 y hardening. |
| **Frontend Dev** | `.agents/skills/frontend-dev/SKILL.md` | React 19, Tailwind v4, Leaflet (`MapView`), Chart.js (`DashboardView`) y UX responsive. |
| **DBA / Data Engineer** | `.agents/skills/dba-data-engineer/SKILL.md` | Esquemas KoboToolbox, transformación GeoJSON, catálogos territoriales y snapshots `data/`. |
| **QA Engineer** | `.agents/skills/qa-engineer/SKILL.md` | Suites Vitest y Pytest, pruebas de regresión, calidad de datos y verificación E2E/runtime. |

