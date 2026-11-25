"""
KoboToolbox API v2 Async Service module using httpx for FastAPI.
"""

import ipaddress
import os
from typing import Any
from urllib.parse import urlparse

import httpx

DEFAULT_ALLOWED_KOBO_HOSTS = (
    "kf.kobotoolbox.org",
    "eu.kobotoolbox.org",
    "kobo.humanitarianresponse.info",
)


def get_allowed_kobo_hosts() -> set[str]:
    """Returns the allowlist of permitted KoboToolbox hostnames (SSRF protection)."""
    raw = os.getenv("ALLOWED_KOBO_HOSTS", "")
    if raw.strip():
        return {h.strip().lower() for h in raw.split(",") if h.strip()}
    return set(DEFAULT_ALLOWED_KOBO_HOSTS)


def normalize_server_url(url: str = "https://kf.kobotoolbox.org") -> str:
    cleaned = url.strip()
    if not cleaned.startswith("http://") and not cleaned.startswith("https://"):
        cleaned = f"https://{cleaned}"
    return cleaned.rstrip("/")


def validate_server_url(url: str = "https://kf.kobotoolbox.org") -> str:
    """Validates and normalizes server URL against scheme, IP and host allowlist rules."""
    normalized = normalize_server_url(url)
    parsed = urlparse(normalized)

    if parsed.scheme != "https":
        raise ValueError("Solo se permiten servidores KoboToolbox sobre HTTPS.")

    hostname = (parsed.hostname or "").lower()
    if not hostname:
        raise ValueError("La URL del servidor KoboToolbox no es válida.")

    try:
        ipaddress.ip_address(hostname)
        raise ValueError("No se permiten direcciones IP directas como servidor KoboToolbox.")
    except ValueError as err:
        if "direcciones IP" in str(err):
            raise

    allowed_hosts = get_allowed_kobo_hosts()
    if hostname not in allowed_hosts:
        raise ValueError(
            f"Servidor KoboToolbox no permitido ('{hostname}'). "
            f"Hosts permitidos: {', '.join(sorted(allowed_hosts))}."
        )

    return normalized


async def fetch_kobo_submissions(
    server_url: str,
    asset_uid: str,
    token: str,
    limit: int = 100,
    offset: int = 0,
) -> dict[str, Any]:
    """Async fetch raw submission data from KoboToolbox API v2."""
    if not asset_uid:
        raise ValueError("El identificador del formulario (Asset UID) es requerido.")
    if not token:
        raise ValueError("El token de API de KoboToolbox (KOBO_API_TOKEN) es requerido.")

    base_url = validate_server_url(server_url)
    endpoint = f"{base_url}/api/v2/assets/{asset_uid}/data/?limit={limit}&offset={offset}"

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(
            endpoint,
            headers={
                "Authorization": f"Token {token}",
                "Accept": "application/json",
            },
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
    token: str,
) -> tuple[bool, dict[str, Any]]:
    """Validates connection and returns asset metadata."""
    if not token or not asset_uid:
        return False, {"error": "Token y Asset UID son requeridos."}

    try:
        base_url = validate_server_url(server_url)
    except ValueError as err:
        return False, {"error": str(err)}

    endpoint = f"{base_url}/api/v2/assets/{asset_uid}/"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                endpoint,
                headers={
                    "Authorization": f"Token {token}",
                    "Accept": "application/json",
                },
            )

            if response.is_success:
                asset = response.json()
                return True, {
                    "name": asset.get("name", "Formulario KoboToolbox"),
                    "uid": asset.get("uid", asset_uid),
                }
            else:
                return False, {
                    "error": f"Error HTTP {response.status_code}: Autenticación fallida o formulario no existe."
                }
    except Exception as e:
        return False, {"error": f"No se pudo conectar con el servidor Kobo ({base_url}): {str(e)}"}
