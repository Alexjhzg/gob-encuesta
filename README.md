# 🗺️ GeoSurvey Dashboard - KoboToolbox Spatial Intelligence Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.10+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Plataforma de **Inteligencia Territorial y Análisis Geoespacial** desarrollada para procesar, estructurar y visualizar en tiempo real datos recolectados en campo a través de **KoboToolbox API v2**.

La aplicación transforma respuestas tabulares complejas y coordenadas GPS en mapas interactivos y dashboards analíticos sincronizados con capacidad de filtrado espacial (Bounding Box).

---

## 🌟 Características Principales

* 🗺️ **Mapa Geoespacial Interactivo**:
  * Visualización de encuestas georreferenciadas con **Leaflet** y agrupamiento dinámico mediante **MarkerCluster**.
  * Soporte para múltiples mapas base (CartoDB Dark/Positron, OpenStreetMap y Satélite ESRI World Imagery).
  * Drawer de detalle por registro con metadata completa y respuestas individuales.
* 📊 **Dashboard Analítico Sincronizado**:
  * Gráficos dinámicos interactivos (**Chart.js**) de distribución por sectores, parroquias y categorías.
  * Ránking de rendimiento de empadronadores y cálculo automático de KPIs.
* 🎯 **Filtro Espacial Dinámico (Bounding Box Sync)**:
  * Sincronización automática de la tabla de datos y métricas según el área geográfica visible en la vista del mapa.
* 🔄 **Conector API KoboToolbox & Switcher de Activos**:
  * Conexión con servidores KoboToolbox (KoboToolbox KPI API v2).
  * Cambio dinámico entre diferentes instrumentos/formularios de encuesta (*Aspectos Políticos*, *Intención de Voto*, etc.).
  * Modo fallback con datos simulados (Mock Data) cuando no hay conexión a API.
* 📥 **Exportación de Datos**:
  * Exportación inmediata de subconjuntos de datos filtrados a formatos **GeoJSON** y **CSV**.
* 🧪 **Arquitectura Robustecida y Pruebas Unitarias**:
  * Cobertura de pruebas unitarias y de integración en Frontend (**Vitest**) y Backend (**Pytest**).

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
* **Core**: React 19 + Vite 6
* **Estilos**: Tailwind CSS v4 + Vanilla CSS
* **Mapas & GIS**: Leaflet + Leaflet.markercluster
* **Visualización**: Chart.js + react-chartjs-2
* **Iconografía**: Lucide React
* **Testing**: Vitest + Testing Library

### **Backend & Servicios Proxy**
* **Python API**: FastAPI + Uvicorn + Requests / Pytest
* **Node.js API**: Express + CORS + Dotenv

---

## 📂 Estructura del Proyecto

```bash
gob_encuesta/
├── backend/                  # Servidor Proxy en Python (FastAPI)
│   ├── geojson_transformer.py # Motor de transformación Kobo JSON -> GeoJSON
│   ├── kobo_service.py        # Servicio de integración con KoboToolbox API v2
│   └── main.py                # Endpoints FastAPI
├── server/                   # Servidor Proxy alternativo en Node.js (Express)
│   ├── geojsonTransformer.js  # Lógica de transformación JS
│   ├── koboService.js         # Cliente HTTP Kobo v2
│   └── index.js               # Entrypoint servidor Express
├── src/                      # Aplicación Frontend React
│   ├── components/            # Componentes modulares (Header, Sidebar, MapView, DataTable, DashboardView, RecordDetail, ConfigModal)
│   ├── services/              # Cliente API de integración
│   └── utils/                 # Utilidades de filtrado espacial, cálculo de KPIs y exportación
├── tests/                    # Suite de pruebas Frontend (Vitest)
├── tests_python/             # Suite de pruebas Backend (Pytest)
├── .env.example              # Plantilla de variables de entorno
└── vite.config.js            # Configuración de Vite y Vitest
```

---

## 🚀 Guía de Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Alexjhzg/gob-encuesta.git
cd gob-encuesta
```

### 2. Configurar variables de entorno

Copia la plantilla `.env.example` y crea un archivo `.env`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de KoboToolbox (opcional si usas datos de prueba):

```env
KOBO_SERVER_URL=https://kf.kobotoolbox.org
KOBO_ASSET_UID=tu_kobo_asset_uid
KOBO_API_TOKEN=tu_kobo_api_token
PORT=3001
```

---

### 3. Ejecución del Frontend (React + Vite)

Instala las dependencias y ejecuta el servidor de desarrollo:

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

### 4. Ejecución del Backend (Python / FastAPI)

Crea y activa un entorno virtual de Python:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Inicia el servidor backend FastAPI:

```bash
npm run server
# o bien: python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8005 --reload
```

---

## 🧪 Ejecución de Pruebas

Para asegurar la calidad y consistencia del código, el proyecto incluye pruebas unitarias para el frontend y el backend:

### Pruebas de Frontend (Vitest):
```bash
npm run test
```

### Pruebas de Backend (Pytest):
```bash
npm run test:python
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para obtener más información.
