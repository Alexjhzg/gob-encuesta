# Design System — GeoEncuestas

Este documento formaliza los tokens visuales, tipografía, paleta de colores, patrones de componentes y reglas de UI/UX extraídos directamente de la implementación actual (`index.html`, `src/index.css`, `src/components/`, `src/utils/dashboardAnalytics.js` y `src/utils/mapHelpers.js`).

---

## 1. Principios de Diseño

1. **Dark-First Territorial UI**: Superficies oscuras de alto contraste (`slate-950` / `slate-900`) para maximizar la legibilidad de datos, KPIs y mapas durante jornadas prolongadas de análisis.
2. **Densidad Informativa Controlada**: Uso de tipografía compacta (`text-xs` / `text-[11px]`) en tablas y filtros, reservando pesos `font-bold` y `font-extrabold` para métricas clave y encabezados.
3. **Semántica Cromática Consistente**: Cada escala Likert, estado de atención y categoría política/social utiliza un color fijo para evitar ambigüedad visual entre gráficos y marcadores.
4. **Adaptabilidad Mobile-First**: En pantallas `< md`, el split-view se transforma en pestañas dedicadas (`Mapa` / `Tabla`) y el panel de filtros colapsa en un drawer con botón flotante (FAB).

---

## 2. Sistema de Tipografía

- **Fuente Principal**: `'Inter', sans-serif` cargada desde Google Fonts en `index.html` (pesos `400`, `500`, `600`, `700`, `800`).
- **Motor CSS**: Tailwind CSS v4 (`@import "tailwindcss";` en `src/index.css` vía `@tailwindcss/vite`).
- **Suavizado**: `antialiased` aplicado en `<body>`.

| Nivel | Clases Tailwind Reales | Uso en la Aplicación |
| :--- | :--- | :--- |
| **Título de Sección / Banner** | `text-base sm:text-lg font-extrabold tracking-tight text-white` | Encabezado de encuesta activa en `DashboardView.jsx` |
| **Título de Tarjeta** | `text-sm font-bold text-slate-100` | Encabezados de gráficos y `Sidebar` |
| **Eyebrow / Etiqueta Uppercase** | `text-[10px] font-bold uppercase tracking-wider text-blue-400` | Subtítulos de categoría y etiquetas de KPI |
| **Cuerpo / Controles** | `text-xs font-semibold` / `text-xs` | Botones, filtros de `Sidebar`, filas de `DataTable` |
| **Metadatos / Badges** | `text-xs font-mono text-slate-400` / `text-[10px] font-bold` | Etiquetas de eje, badges de estado, coordenadas |

---

## 3. Paleta de Colores y Tokens

### 3.1 Superficies y Neutros (Tailwind Slate)

| Token / Uso | Clase Tailwind | Hex Referencia | Aplicación Real |
| :--- | :--- | :--- | :--- |
| **Fondo Base (Canvas)** | `bg-slate-950` | `#020617` | `<body>`, contenedor raíz de `App.jsx`, fondo de `DashboardView` |
| **Superficie Primaria (Cards/Header/Sidebar)** | `bg-slate-900` | `#0f172a` | `Header`, `Sidebar`, tarjetas analíticas |
| **Superficie Elevada / Controles** | `bg-slate-800` | `#1e293b` | Chips de conteo, botones inactivos, hover states |
| **Bordes Estructurales** | `border-slate-800` / `border-slate-700` | `#1e293b` / `#334155` | Separadores de paneles y tarjetas |
| **Texto Primario** | `text-slate-100` / `text-white` | `#f1f5f9` / `#ffffff` | Títulos, valores KPI |
| **Texto Secundario** | `text-slate-300` / `text-slate-400` | `#cbd5e1` / `#94a3b8` | Subtítulos, metadatos, placeholders |

### 3.2 Colores de Acento y Estado

| Rol Semántico | Clases Tailwind | Hex (`Chart.js`) | Uso Real |
| :--- | :--- | :--- | :--- |
| **Primario / Acción** | `bg-blue-600`, `hover:bg-blue-700`, `text-blue-400` | `#3b82f6` | Botones activos, FAB móvil, toggle sidebar, barra de progreso |
| **Positivo / Resuelto / Favorable** | `bg-emerald-600`, `text-emerald-400` | `#10b981` | Pines resueltos (`getPinBgClass`), nivel superior de escalas Likert |
| **Advertencia / Pendiente / Regular** | `bg-amber-500`, `text-amber-400` | `#f59e0b` | Pines pendientes, botón limpiar filtros, nivel intermedio Likert |
| **Alerta Alta / Desfavorable** | — | `#f97316` | Nivel 4 de escalas Likert (Malo / Empeorado / Inseguro) |
| **Error / Crítico / Negativo** | `bg-rose-900/90`, `text-rose-400` | `#ef4444` | Banner de error API en `App.jsx`, nivel inferior Likert |
| **Acento Demográfico / Especial** | `text-purple-400`, `bg-purple-600`, `bg-pink-600` | `#8b5cf6` / `#ec4899` | Rangos de edad, sexo femenino, categorías de pines (`Salud`, `Vialidad`) |
| **Geográfico / Territorial** | `text-cyan-400` | `#06b6d4` | Cobertura territorial por parroquia |

### 3.3 Paleta Ordenada de Visualización (`COLOR_PALETTES`)

Definida en `src/utils/dashboardAnalytics.js`:

```text
#3b82f6 (Blue)   | #10b981 (Emerald) | #f59e0b (Amber)  | #ef4444 (Red)
#8b5cf6 (Purple) | #06b6d4 (Cyan)    | #ec4899 (Pink)   | #6366f1 (Indigo)
#f97316 (Orange) | #14b8a6 (Teal)    | #a855f7 (Violet) | #64748b (Slate)
```

---

## 4. Layout, Espaciado y Breakpoints

| Región | Desktop (`>= md`, 768px) | Móvil (`< md`) |
| :--- | :--- | :--- |
| **Header** | Fila horizontal (`md:flex-row`) con marca, selector de encuesta, tabs y KPIs (`~65px`). | Apilado vertical (`flex-col`) con acciones en fila superior. |
| **Sidebar** | Relativa a la izquierda: `w-72` (`288px`) expandida o `w-14` (`56px`) colapsada. | `fixed inset-y-0 left-0 z-40` con backdrop `bg-slate-950/75 backdrop-blur-sm` y botón FAB `bottom-16 left-4`. |
| **Vista Mapa (`activeTab === 'map'`)** | Split horizontal: `60%` `MapView` + `40%` `DataTable`. | Sub-barra conmutadora `Mapa` / `Tabla` a ancho completo. |
| **Vista Dashboard (`activeTab === 'dashboard'`)** | Contenedor scrollable `p-6 space-y-6` con grids `sm:grid-cols-3` (KPIs) y `lg:grid-cols-2` (gráficos). | Columna única (`grid-cols-1`). |

---

## 5. Catálogo de Componentes UI

| Componente | Subcomponentes | Patrón Visual |
| :--- | :--- | :--- |
| `Header` | `BrandHeader`, `SurveySelector`, `ViewTabSwitcher`, `KpiCardGroup`, `HeaderActions` | Barra superior fija con borde inferior `border-slate-800` y sombra `shadow-md`. |
| `Sidebar` | `SearchFilterInput`, `DateRangeFilter`, `SelectFilter`, `ExportActions`, `CollapsedSidebar` | Panel colapsable con transición `duration-300 ease-in-out`. |
| `MapView` | `MapControlsOverlay` | Contenedor `min-h-[350px]`, marcadores `L.divIcon` circulares `w-6 h-6 border-2 border-white`, popups claros (`bg-white`/`text-slate-900`) para contraste sobre mapa. |
| `DataTable` | `TableSortHeader`, `TableRowItem`, `EmptyTableState` | Tabla densa con paginación cliente (`pageSize={15}`) y resaltado de fila seleccionada. |
| `DashboardView` | `MetricCard`, `DonutChartCard`, `BarChartCard`, `DistributionBarList`, `SurveyorRankingTable` | Tarjetas `bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg`. |
| `RecordDetail` | `RecordStatusBanner`, `RecordMetadataGrid`, `GeoLocationDetails`, `SurveyResponseList` | Modal/drawer lateral con ficha completa del registro seleccionado. |
| `ConfigModal` | `ConfigFormField`, `TestResultAlert` | Modal de configuración Kobo API con feedback de prueba en vivo. |
| `LoadingScreen` | — | Overlay de carga a pantalla completa durante peticiones a la API. |

---

## 6. Iconografía y Reglas de Accesibilidad / UX

- **Librería de Iconos**: `lucide-react` (`^0.475.0`), tamaños estándar `14px` (botones compactos), `16px` (sidebar/alertas), `18px` (cabeceras de tarjetas) y `22px` (banners).
- **Feedback Interactivo**: Todos los botones interactivos deben incluir `cursor-pointer`, estados `hover:` y transiciones suaves (`transition-colors` / `transition-all`).
- **Idioma**: Toda la interfaz, etiquetas, fechas (`toLocaleDateString('es-ES')`) y mensajes de error se presentan en **español**.
- **Regla de Contraste en Mapas**: Los popups de Leaflet usan fondo claro (`text-slate-900` / `bg-slate-50`) sobre tiles cartográficos; el resto de la aplicación mantiene el esquema oscuro `slate-950`/`slate-900`.
- **Deuda de Accesibilidad Conocida**: Añadir atributos `aria-label`, manejo de foco con tecla `Escape` en modales (`ConfigModal`, `RecordDetail`) y sanitizar texto en popups de `MapView.jsx` (evitando `innerHTML` crudo).

