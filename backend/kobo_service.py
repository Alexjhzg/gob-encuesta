"""
KoboToolbox API v2 Async Service module using httpx for FastAPI.
"""
import httpx
from typing import Dict, Any, Tuple

def normalize_server_url(url: str = "https://kf.kobotoolbox.org") -> str:
    cleaned = url.strip()
    if not cleaned.startswith("http://") and not cleaned.startswith("https://"):
        cleaned = f"https://{cleaned}"
    return cleaned.rstrip("/")

async def fetch_kobo_submissions(
    server_url: str,
    asset_uid: str,
    token: str,
    limit: int = 100,
    offset: int = 0
) -> Dict[str, Any]:
    """Async fetch raw submission data from KoboToolbox API v2."""
    if not asset_uid:
        raise ValueError("El identificador del formulario (Asset UID) es requerido.")
    if not token:
        raise ValueError("El token de API de KoboToolbox (KOBO_API_TOKEN) es requerido.")

    base_url = normalize_server_url(server_url)
    endpoint = f"{base_url}/api/v2/assets/{asset_uid}/data/?limit={limit}&offset={offset}"

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(
            endpoint,
            headers={
                "Authorization": f"Token {token}",
                "Accept": "application/json"
            }
        )

        if not response.is_success:
            err_msg = f"Kobo API HTTP Error {response.status_code}: {response.reason_phrase}"
            if response.status_code == 401:
                err_msg = "Error de Autenticación 401: Token de KoboToolbox no válido o expirado."
            elif response.status_code == 404:
                err_msg = f"Formulario 404: No se encontró el Asset UID '{asset_uid}' en el servidor '{base_url}'."
            raise RuntimeError(err_msg)

        return response.json()

async def validate_kobo_connection(
    server_url: str,
    asset_uid: str,
    token: str
) -> Tuple[bool, Dict[str, Any]]:
    """Validates connection and returns asset metadata."""
    if not token or not asset_uid:
        return False, {"error": "Token y Asset UID son requeridos."}

    base_url = normalize_server_url(server_url)
    endpoint = f"{base_url}/api/v2/assets/{asset_uid}/"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                endpoint,
                headers={
                    "Authorization": f"Token {token}",
                    "Accept": "application/json"
                }
            )

            if response.is_success:
                asset = response.json()
                return True, {
                    "name": asset.get("name", "Formulario KoboToolbox"),
                    "uid": asset.get("uid", asset_uid)
                }
            else:
                return False, {"error": f"Error HTTP {response.status_code}: Autenticación fallida o formulario no existe."}
    except Exception as e:
        return False, {"error": f"No se pudo conectar con el servidor Kobo ({base_url}): {str(e)}"}
