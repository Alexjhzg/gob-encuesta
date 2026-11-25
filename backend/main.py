"""
FastAPI Main Application & Proxy Endpoints for KoboToolbox v2.
"""

import os
from datetime import datetime, timezone
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from backend.geojson_transformer import transform_kobo_to_geojson
from backend.kobo_service import fetch_kobo_submissions, validate_kobo_connection
from backend.mock_data import MOCK_CATEGORIES, MOCK_ENUMERATORS

load_dotenv()

app = FastAPI(
    title="KoboToolbox Geo-Dashboard API",
    description="FastAPI Proxy Server & GeoJSON Transformation Engine for KoboToolbox KPI API v2",
    version="1.0.0",
)

# Restrict CORS origins via environment variable (defaults to local Vite dev server)
_raw_cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
CORS_ORIGINS = [origin.strip() for origin in _raw_cors_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "X-Kobo-Token", "Authorization"],
)


class ConnectionTestRequest(BaseModel):
    serverUrl: str | None = "https://kf.kobotoolbox.org"
    assetUid: str | None = None
    token: str | None = None


@app.get("/api/kobo/health")
async def healthcheck() -> dict[str, Any]:
    return {
        "status": "ok",
        "service": "KoboToolbox FastAPI Proxy API & GeoJSON Engine",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/kobo/data")
async def get_kobo_data(
    serverUrl: str | None = Query(None),
    assetUid: str | None = Query(None),
    token: str | None = Query(None),
    x_kobo_token: str | None = Header(default=None, alias="X-Kobo-Token"),
    limit: int = Query(1000, ge=1, le=5000),
    offset: int = Query(0, ge=0),
    demo: bool = Query(False),
) -> dict[str, Any]:
    # Read environment variables as fallbacks; prefer X-Kobo-Token header over query param
    eff_server_url = serverUrl or os.getenv("KOBO_SERVER_URL", "https://kf.kobotoolbox.org")
    eff_asset_uid = assetUid or os.getenv("KOBO_ASSET_UID")
    eff_token = x_kobo_token or token or os.getenv("KOBO_API_TOKEN")

    if not eff_token or not eff_asset_uid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Credenciales faltantes: Se requiere Token de API y Asset UID de KoboToolbox.",
        )

    try:
        raw_data = await fetch_kobo_submissions(
            server_url=eff_server_url,
            asset_uid=eff_asset_uid,
            token=eff_token,
            limit=limit,
            offset=offset,
        )

        results = (
            raw_data.get("results", [])
            if isinstance(raw_data, dict)
            else (raw_data if isinstance(raw_data, list) else [])
        )
        geojson = transform_kobo_to_geojson(results, options={"limit": limit, "offset": offset})
        return geojson

    except (RuntimeError, ValueError) as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err)) from err
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error inesperado backend: {str(err)}",
        ) from err


@app.post("/api/kobo/test-connection")
async def test_connection(payload: ConnectionTestRequest, response: Response) -> dict[str, Any]:
    if not payload.token or not payload.assetUid:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "success": False,
            "error": "Tanto el Token de API como el Asset UID del formulario son requeridos.",
        }

    is_valid, result = await validate_kobo_connection(
        server_url=payload.serverUrl or "https://kf.kobotoolbox.org",
        asset_uid=payload.assetUid,
        token=payload.token,
    )

    if not is_valid:
        response.status_code = status.HTTP_400_BAD_REQUEST

    return {"success": is_valid, **result}


@app.get("/api/kobo/options")
async def get_filter_options() -> dict[str, Any]:
    return {"enumerators": MOCK_ENUMERATORS, "categories": MOCK_CATEGORIES}


@app.get("/api/kobo/download/{filename}")
async def download_json_file(filename: str):
    allowed_files = {
        "intencion_de_voto.geojson": "data/intencion_de_voto.geojson",
        "intencion_de_voto_raw.json": "data/intencion_de_voto_raw.json",
        "aspectos_politicos_y_sociales.geojson": "data/aspectos_politicos_y_sociales.geojson",
        "aspectos_politicos_y_sociales_raw.json": "data/aspectos_politicos_y_sociales_raw.json",
    }

    if filename not in allowed_files:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")

    file_path = os.path.join(os.path.dirname(__file__), "..", allowed_files[filename])
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="El archivo solicitado aún no existe")

    return FileResponse(file_path, filename=filename, media_type="application/json")


# Static Frontend & SPA Fallback
dist_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), "../dist"))

if os.path.exists(dist_dir) and os.path.exists(os.path.join(dist_dir, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")


@app.get("/")
async def root():
    index_file = os.path.join(dist_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {
        "status": "online",
        "service": "GeoSurvey KoboToolbox FastAPI Proxy Server",
        "documentation": "/docs",
        "endpoints": {
            "health": "/api/kobo/health",
            "data": "/api/kobo/data",
            "options": "/api/kobo/options",
        },
    }


@app.get("/{full_path:path}")
async def serve_spa_or_fallback(full_path: str):
    if full_path.startswith("api/") or full_path == "docs" or full_path == "openapi.json":
        raise HTTPException(status_code=404, detail="Endpoint API no encontrado")
    index_file = os.path.join(dist_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    raise HTTPException(
        status_code=404,
        detail="Frontend estático no encontrado. Visita /docs para ver la documentación de la API.",
    )
