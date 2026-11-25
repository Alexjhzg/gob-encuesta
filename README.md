# GeoEncuestas — KoboToolbox Spatial Intelligence Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.10+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![CI](https://github.com/Alexjhzg/gob-encuesta/actions/workflows/ci.yml/badge.svg)](https://github.com/Alexjhzg/gob-encuesta/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Plataforma full-stack de **Inteligencia Territorial y Análisis Geoespacial** diseñada para ingerir, transformar a GeoJSON (RFC 7946) y visualizar en tiempo real encuestas de campo recolectadas con **KoboToolbox KPI API v2**.

Sincroniza un mapa interactivo (**Leaflet**), una tabla filtrable por **Bounding Box espacial**, fichas detalladas de registro y un dashboard analítico (**Chart.js**) con exportación instantánea a **GeoJSON** y **CSV**.

---

## Características Principales

- **Mapa Geoespacial Interactivo**: Pines personalizados por estado/categoría sobre mapas base OpenStreetMap y Satelital (ESRI World Imagery), auto-encuadre (`fitBounds`), `flyTo` al seleccionar registros y popups seguros contra XSS.
- **Filtro Espacial Dinámico (Bounding Box Sync)**: Al mover o hacer zoom en el mapa, la tabla de registros y los exportadores se sincronizan automáticamente con el área visible.
- **Dashboard Analítico Sincronizado**: Más de 20 visualizaciones interactivas (**Chart.js**) de demografía (sexo/edad), cobertura territorial por parroquia/sector, intención electoral y evaluación de gestión/servicios.
- **Modo Demo Instantáneo (Sin Credenciales)**: Si se inicia sin `KOBO_API_TOKEN`, la aplicación activa automáticamente un dataset sintético realista (`?demo=true`) para explorar todas las vistas sin configuración previa.
- **Backend Proxy Dual & Seguridad**: Servidor principal asíncrono en **FastAPI** (`backend/`) y alternativa en **Express** (`server/`), con protección SSRF (lista blanca de hosts HTTPS), token por cabecera `X-Kobo-Token` y CORS restringido por entorno.
- **Calidad Automatizada**: 63 pruebas automatizadas (`Vitest` + `Pytest`), `ESLint 9`, `Prettier`, `Ruff` y pipeline CI en GitHub Actions.

---

## Arquitectura y Documentación Técnica

| Documento | Contenido |
| :--- | :--- |
| [PRD](docs/PRD.md) | Alcance funcional, personas, requerimientos y métricas de éxito. |
| [Arquitectura (C4 & ADRs)](docs/ARCHITECTURE.md) | Diagramas Mermaid C4, flujos de datos, topología de despliegue y ADRs. |
| [Design System](docs/DESIGN_SYSTEM.md) | Tokens dark-first, tipografía Inter, paletas semánticas y patrones responsivos. |
| [Modelo de Datos](docs/database_model.md) | ERD lógico, esquema GeoJSON RFC 7946, diccionarios territoriales y snapshots. |
| [Contratos de API](docs/API.md) | Endpoints REST `/api/kobo/*`, parámetros, respuestas y paridad FastAPI/Express. |
| [Seguridad](SECURITY.md) | Controles aplicados (`SEC-01`–`SEC-06`) y plan de endurecimiento para producción. |
| [Guía de Estilo](docs/CODE_STYLE.md) | Reglas de ESLint, Prettier, Ruff y `.editorconfig`. |

---

## Inicio Rápido (Modo Demo en 2 minutos)

No necesitas cuenta ni token de KoboToolbox para probar la plataforma:

```bash
# 1. Instalar dependencias Frontend
npm install

# 2. Crear entorno virtual Python e instalar dependencias Backend
python3 -m venv venv
./venv/bin/python -m pip install -r requirements.txt

# 3. Terminal 1 — Levantar Backend FastAPI (puerto 8005)
npm run server

# 4. Terminal 2 — Levantar Frontend Vite (puerto 5173)
npm run dev
```

Abre `http://localhost:5173`. Al no detectar credenciales de KoboToolbox, el sistema cargará automáticamente el **Modo Demo** con datos geoespaciales sintéticos.

### Conectar con KoboToolbox Real (Opcional)

```bash
cp .env.example .env
```

Configura tus variables en `.env`:

```env
KOBO_SERVER_URL=https://kf.kobotoolbox.org
KOBO_ASSET_UID=tu_kobo_asset_uid
KOBO_API_TOKEN=tu_kobo_api_token
ALLOWED_KOBO_HOSTS=kf.kobotoolbox.org,eu.kobotoolbox.org,kobo.humanitarianresponse.info
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
PORT=3001
```

---

## Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | React 19, Vite 6, Tailwind CSS v4, Leaflet, Chart.js (`react-chartjs-2`), Lucide React |
| **Backend Principal** | Python 3.10+, FastAPI, Uvicorn, HTTPX (async), Pydantic |
| **Backend Alternativo** | Node.js (ESM), Express, CORS, Dotenv |
| **Calidad y CI** | Vitest, Supertest, Pytest, ESLint 9, Prettier, Ruff, GitHub Actions |

---

## Scripts de Calidad, Build y Pruebas

```bash
# Linters y formato
npm run lint            # ESLint sobre src/, server/ y tests/
npm run format:check    # Verificación de formato Prettier
npm run lint:python     # Ruff check sobre backend/, tests_python/ y scripts
npm run format:python   # Verificación de formato Ruff

# Pruebas y build
npm test                # Suite Vitest (Frontend + Express)
npm run test:python     # Suite Pytest (Backend FastAPI)
npm run build           # Build de producción en dist/
```

---

## Licencia

Este proyecto está bajo la **Licencia MIT**. Consulta [LICENSE](LICENSE) para más detalles.
