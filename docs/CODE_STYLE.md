# Guía de Estilo de Código — GeoEncuestas

Este documento establece las convenciones oficiales de estilo, formato y análisis estático para el stack real del proyecto (**React 19 / JavaScript ESM + Python 3 / FastAPI**).

---

## 1. Estándares Transversales (`.editorconfig`)

Todas las contribuciones deben respetar [`.editorconfig`](../.editorconfig):
- **Codificación**: `utf-8`
- **Fin de línea**: `lf` (`\n`)
- **Nueva línea final**: obligatoria (`insert_final_newline = true`)
- **Espacios finales**: eliminados (`trim_trailing_whitespace = true`, salvo en `.md`)
- **Indentación**:
  - `2` espacios para `.js`, `.jsx`, `.json`, `.css`, `.html`, `.yml`, `.yaml`, `.md`
  - `4` espacios para `.py`

---

## 2. Frontend y Servidor Node.js (JavaScript / React)

### Herramientas Configuradas
- **Linter**: ESLint 9 (Flat Config en [`eslint.config.js`](../eslint.config.js)) con `@eslint/js`, `eslint-plugin-react`, `eslint-plugin-react-hooks` y `eslint-config-prettier`.
- **Formateador**: Prettier ([`.prettierrc`](../.prettierrc) y [`.prettierignore`](../.prettierignore)).

### Comandos Oficiales (`package.json`)
```bash
npm run lint          # Ejecuta ESLint sobre src/, server/ y tests/
npm run lint:fix      # Corrige automáticamente incidencias seguras de ESLint
npm run format        # Formatea con Prettier
npm run format:check  # Verifica formato sin modificar archivos
```

### Convenciones Clave
- **Módulos ESM**: Usar `import`/`export` con extensión explícita `.js`/`.jsx` en imports relativos cuando corresponda al patrón existente.
- **Estilo de Formato**: Comillas simples (`'`), punto y coma (`;`), ancho de línea `100`, sin coma final (`trailingComma: "none"`).
- **React**:
  - Componentes funcionales en `PascalCase` (`MapView.jsx`, `DonutChartCard.jsx`).
  - Hooks respetando `react-hooks/rules-of-hooks` y dependencias exhaustivas (`react-hooks/exhaustive-deps`).
  - Separar lógica pura de transformación/filtrado/cálculo en `src/utils/*.js` para facilitar pruebas unitarias en Vitest (`environment: 'node'`).
- **Seguridad en DOM**: Evitar `innerHTML` y `dangerouslySetInnerHTML` con datos no confiables.

---

## 3. Backend Python (FastAPI / Scripts)

### Herramientas Configuradas
- **Linter y Formateador**: **Ruff** configurado en [`pyproject.toml`](../pyproject.toml) (instalado en `./venv`).
- **Tests**: **Pytest** configurado en [`pyproject.toml`](../pyproject.toml) (`testpaths = ["tests_python"]`, `pythonpath = ["."]`).

### Comandos Oficiales
```bash
./venv/bin/ruff check backend tests_python download_kobo_data.py
./venv/bin/ruff format --check backend tests_python download_kobo_data.py
npm run lint:python     # Atajo en package.json para ruff check
npm run format:python   # Atajo en package.json para ruff format
npm run test:python     # Ejecuta pytest sobre tests_python/
```

### Convenciones Clave
- **PEP 8 + Ruff**: Longitud máxima de línea `100`, indentación de `4` espacios, imports ordenados (`I` / isort).
- **Tipado**: Anotar parámetros y tipos de retorno en todas las funciones públicas (`typing` / anotaciones nativas Python 3.10+) y usar modelos `pydantic.BaseModel` para payloads HTTP.
- **Asincronía**: Usar `async def` + `httpx.AsyncClient` con timeouts explícitos para llamadas externas a KoboToolbox; nunca bloquear el event loop con I/O síncrono en endpoints FastAPI.
- **Secretos**: Nunca hardcodear tokens ni credenciales; leer siempre desde `os.getenv(...)`.

---

## 4. Pruebas y Control de Calidad

- **Frontend / Express**: `npm test` (Vitest) — pruebas en `tests/**/*.test.js`.
- **Backend Python**: `npm run test:python` (Pytest) — pruebas en `tests_python/test_*.py`.
- **Build de Producción**: `npm run build` (Vite) debe finalizar con código `0` antes de cualquier merge.

