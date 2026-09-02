"""
Mock Data Generator module for Python FastAPI backend.
"""
import random
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List

MOCK_ENUMERATORS: List[str] = [
    "Ing. María Rodríguez",
    "Lic. Carlos Mendoza",
    "Dra. Elena Silva",
    "Tec. Roberto Gómez",
    "Sra. Ana Gutiérrez",
    "Ldo. Fernando Torres",
    "Ing. José Hernández"
]

MOCK_CATEGORIES: List[str] = [
    "Infraestructura",
    "Salud",
    "Educación",
    "Seguridad",
    "Vialidad",
    "Agua y Sanidad",
    "Alumbrado Público"
]

MOCK_STATUSES: List[str] = [
    "Resuelto",
    "En Proceso",
    "Inspección Requerida",
    "Pendiente"
]

MOCK_MUNICIPALITIES: List[Dict[str, Any]] = [
    {"municipio": "Municipio Libertador", "parroquias": ["Sucre (Catia)", "El Recreo", "La Vega", "Caricuao"]},
    {"municipio": "Municipio Sucre", "parroquias": ["Petare", "Leoncio Martínez", "Caucagüita"]},
    {"municipio": "Municipio Chacao", "parroquias": ["Chacao", "El Rosal"]},
    {"municipio": "Municipio Baruta", "parroquias": ["Nuestra Señora del Rosario", "Las Minas"]}
]

OBSERVATION_SAMPLES: List[str] = [
    "Inspección de tubería principal con fuga leve de agua potable.",
    "Revisión de infraestructura en ambulatorio local. Se requiere material eléctrico.",
    "Evaluación de falla de borde en avenida principal. Tramo señalizado.",
    "Verificación de alumbrado público. 4 luminarias LED requieren sustitución.",
    "Levantamiento de necesidades en escuela primaria.",
    "Módulo policial con mantenimiento preventivo completado."
]

def generate_mock_geojson(count: int = 50) -> Dict[str, Any]:
    """Generates realistic mock GeoJSON FeatureCollection."""
    features = []
    now = datetime.now(timezone.utc)
    base_lat = 10.475
    base_lon = -66.890

    for i in range(1, count + 1):
        hub_offset_lat = (i % 5) * 0.02 - 0.04
        hub_offset_lon = (i % 5) * 0.03 - 0.06

        lat = round(random.uniform(base_lat + hub_offset_lat - 0.015, base_lat + hub_offset_lat + 0.015), 6)
        lon = round(random.uniform(base_lon + hub_offset_lon - 0.02, base_lon + hub_offset_lon + 0.02), 6)

        mun_obj = random.choice(MOCK_MUNICIPALITIES)
        parroquia = random.choice(mun_obj["parroquias"])

        days_ago = random.randint(0, 30)
        hours_ago = random.randint(0, 23)
        sub_date = now - timedelta(days=days_ago, hours=hours_ago)

        item_id = 1000 + i
        enum_name = random.choice(MOCK_ENUMERATORS)
        cat_name = random.choice(MOCK_CATEGORIES)
        st_name = random.choice(MOCK_STATUSES)
        obs = random.choice(OBSERVATION_SAMPLES)

        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat]
            },
            "properties": {
                "id": item_id,
                "_id": item_id,
                "uuid": f"mock-uuid-{item_id}",
                "submitted_by": enum_name,
                "_submitted_by": enum_name,
                "submission_time": sub_date.isoformat(),
                "_submission_time": sub_date.isoformat(),
                "status": "approved" if st_name == "Resuelto" else "submitted",
                "latitude": lat,
                "longitude": lon,
                "altitude": random.randint(400, 1050),
                "precision": round(random.uniform(1.5, 6.0), 1),
                "categoria": cat_name,
                "estado_atencion": st_name,
                "municipio": mun_obj["municipio"],
                "parroquia": parroquia,
                "observaciones": obs
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features,
        "meta": {
            "total": count,
            "geocoded_count": count,
            "non_geocoded_count": 0,
            "is_mock": True,
            "limit": count,
            "offset": 0,
            "timestamp": now.isoformat()
        }
    }
