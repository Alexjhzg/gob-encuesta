"""
KoboToolbox Geopoint to GeoJSON FeatureCollection Transformer module for Python FastAPI.
"""
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

def parse_geopoint(value: Any) -> Optional[Dict[str, Any]]:
    """
    Parses Kobo geopoint format (string 'lat lon alt precision' or list [lat, lon])
    Returns dict with latitude, longitude, altitude, precision and coordinates [lon, lat].
    """
    if not value:
        return None

    lat, lon, alt, precision = 0.0, 0.0, 0.0, 0.0

    if isinstance(value, (list, tuple)) and len(value) >= 2:
        try:
            lat = float(value[0])
            lon = float(value[1])
            if len(value) >= 3 and value[2] is not None:
                alt = float(value[2])
            if len(value) >= 4 and value[3] is not None:
                precision = float(value[3])
        except (ValueError, TypeError):
            return None
    elif isinstance(value, str):
        parts = value.strip().split()
        if len(parts) >= 2:
            try:
                lat = float(parts[0])
                lon = float(parts[1])
                if len(parts) >= 3:
                    alt = float(parts[2])
                if len(parts) >= 4:
                    precision = float(parts[3])
            except (ValueError, TypeError):
                return None
        else:
            return None
    elif isinstance(value, dict):
        try:
            lat = float(value.get("latitude", 0))
            lon = float(value.get("longitude", 0))
            alt = float(value.get("altitude", 0))
            precision = float(value.get("precision", 0))
        except (ValueError, TypeError):
            return None
    else:
        return None

    return {
        "latitude": lat,
        "longitude": lon,
        "altitude": alt,
        "precision": precision,
        "coordinates": [lon, lat]  # GeoJSON format: [longitude, latitude]
    }


def find_geopoint(submission: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Inspects submission keys for geopoint information."""
    if not isinstance(submission, dict):
        return None

    known_keys = [
        "_geolocation",
        "start-geopoint",
        "start_geopoint",
        "location",
        "geopoint",
        "_geopoint",
        "gps",
        "coordenadas"
    ]

    for key in known_keys:
        if key in submission and submission[key]:
            parsed = parse_geopoint(submission[key])
            if parsed:
                return parsed

    for key, val in submission.items():
        if not key.startswith("_") and val:
            parsed = parse_geopoint(val)
            if parsed:
                return parsed

    return None


def transform_kobo_to_geojson(raw_submissions: List[Dict[str, Any]], options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Transforms raw Kobo submissions list into a standard GeoJSON FeatureCollection."""
    if options is None:
        options = {}

    geocoded_count = 0
    non_geocoded_count = 0
    features = []

    for item in raw_submissions:
        geo = find_geopoint(item)
        if geo:
            geocoded_count += 1
            lat = geo["latitude"]
            lon = geo["longitude"]

            surveyor_name = (
                item.get("S0/_xm_s0_nombreapellido")
                or item.get("S0/nombre_apellido")
                or item.get("S0/nombre_encuestador")
                or item.get("encuestador")
                or item.get("_submitted_by")
                or item.get("submitted_by")
                or "Encuestador Anónimo"
            )

            # Determine survey category dynamically
            survey_cat = item.get("categoria") or item.get("type") or item.get("sector")
            if not survey_cat or survey_cat == "Encuesta de Campo":
                xform_id = item.get("_xform_id_string")
                if xform_id == "aJwBHzgWAqMozzcGLbZjgE":
                    survey_cat = "Intención de Voto"
                elif xform_id == "ajgQTzZcCG3ccEuB8dvNZc":
                    survey_cat = "Aspectos Políticos"
                elif any("aspectos_politicos" in k for k in item.keys()):
                    survey_cat = "Aspectos Políticos"
                elif any(k.startswith("g_preguntas/") or k.startswith("g_filtro/") or k.startswith("S2/") for k in item.keys()):
                    survey_cat = "Intención de Voto"
                else:
                    survey_cat = options.get("form_title") or "Intención de Voto"

            properties = {
                **item,
                "id": item.get("_id") or item.get("id") or f"sub_{geocoded_count}",
                "submitted_by": str(surveyor_name).strip(),
                "submission_time": item.get("_submission_time") or item.get("submission_time") or datetime.now(timezone.utc).isoformat(),
                "uuid": item.get("_uuid") or item.get("uuid"),
                "status": item.get("_status") or item.get("status") or "submitted",
                "latitude": lat,
                "longitude": lon,
                "altitude": geo["altitude"],
                "precision": geo["precision"],
                "categoria": survey_cat,
                "estado_atencion": item.get("estado_atencion") or item.get("estado") or "Registrado",
                "observaciones": item.get("observaciones") or item.get("observacion") or item.get("notes") or ""
            }

            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": geo["coordinates"]
                },
                "properties": properties
            })
        else:
            non_geocoded_count += 1

    return {
        "type": "FeatureCollection",
        "features": features,
        "meta": {
            "total": len(raw_submissions),
            "geocoded_count": geocoded_count,
            "non_geocoded_count": non_geocoded_count,
            "limit": options.get("limit", len(raw_submissions)),
            "offset": options.get("offset", 0),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    }
