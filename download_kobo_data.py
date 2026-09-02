"""
Script to download all submissions from KoboToolbox API v2 for both survey forms
and save them as JSON and GeoJSON files in the data/ directory.
"""
import os
import json
import asyncio
import httpx
from backend.geojson_transformer import transform_kobo_to_geojson

TOKEN = "31b028fc8651f10052f1883cf907ea77302d39bf"
BASE_URL = "https://kf.kobotoolbox.org"

ASSETS = [
    {
        "name": "intencion_de_voto",
        "title": "Intención de Voto y Clima Electoral",
        "uid": "aJwBHzgWAqMozzcGLbZjgE"
    },
    {
        "name": "aspectos_politicos_y_sociales",
        "title": "Aspectos Políticos y Sociales",
        "uid": "ajgQTzZcCG3ccEuB8dvNZc"
    }
]

async def download_asset_data(client, asset):
    name = asset["name"]
    uid = asset["uid"]
    print(f"📥 Descargando datos para '{asset['title']}' (UID: {uid})...")

    # Fetch all records with large limit
    url = f"{BASE_URL}/api/v2/assets/{uid}/data/?limit=2000"
    headers = {
        "Authorization": f"Token {TOKEN}",
        "Accept": "application/json"
    }

    response = await client.get(url, headers=headers)
    if not response.is_success:
        print(f"❌ Error al descargar {name}: HTTP {response.status_code}")
        return

    raw_data = response.json()
    results = raw_data.get("results", [])
    print(f"✅ Recibidos {len(results)} registros para '{asset['title']}'")

    os.makedirs("data", exist_ok=True)

    # 1. Save Raw JSON
    raw_path = f"data/{name}_raw.json"
    with open(raw_path, "w", encoding="utf-8") as f:
        json.dump(raw_data, f, ensure_ascii=False, indent=2)
    print(f"💾 Guardado Raw JSON en: {raw_path}")

    # 2. Save Transformed GeoJSON
    geojson = transform_kobo_to_geojson(results, options={"form_title": asset["title"], "asset_uid": uid})
    geojson_path = f"data/{name}.geojson"
    with open(geojson_path, "w", encoding="utf-8") as f:
        json.dump(geojson, f, ensure_ascii=False, indent=2)
    print(f"🌍 Guardado GeoJSON en: {geojson_path} ({geojson['meta']['geocoded_count']} puntos geolocalizados)")

async def main():
    async with httpx.AsyncClient(timeout=60.0) as client:
        for asset in ASSETS:
            await download_asset_data(client, asset)

if __name__ == "__main__":
    asyncio.run(main())
