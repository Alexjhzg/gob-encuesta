import pytest
from backend.geojson_transformer import parse_geopoint, transform_kobo_to_geojson

def test_parse_geopoint_string():
    input_str = "10.4806 -66.9036 125.0 3.5"
    res = parse_geopoint(input_str)
    assert res is not None
    assert pytest.approx(res["latitude"], 0.0001) == 10.4806
    assert pytest.approx(res["longitude"], 0.0001) == -66.9036
    assert res["coordinates"] == [-66.9036, 10.4806]  # [lon, lat]

def test_parse_geopoint_list():
    input_arr = [10.4806, -66.9036]
    res = parse_geopoint(input_arr)
    assert res is not None
    assert res["coordinates"] == [-66.9036, 10.4806]

def test_parse_geopoint_invalid():
    assert parse_geopoint(None) is None
    assert parse_geopoint("") is None
    assert parse_geopoint("invalid data") is None

def test_transform_kobo_to_geojson():
    raw_data = [
        {
          "_id": 1,
          "start-geopoint": "9.6875 -63.4424 128.5 5.0",
          "S0/_xm_s0_nombreapellido": "Ebelin Rolston",
          "submission_time": "2026-08-28T10:00:00Z"
        },
        {
          "_id": 2,
          "_geolocation": [10.50, -66.92],
          "_submitted_by": "cceem"
        },
        {
          "_id": 3,
          "notes": "No geolocation"
        }
    ]

    res = transform_kobo_to_geojson(raw_data)
    assert res["type"] == "FeatureCollection"
    assert len(res["features"]) == 2
    assert res["meta"]["total"] == 3
    assert res["meta"]["geocoded_count"] == 2
    assert res["meta"]["non_geocoded_count"] == 1

    f0 = res["features"][0]
    assert f0["type"] == "Feature"
    assert f0["geometry"]["coordinates"] == [-63.4424, 9.6875]
    assert f0["properties"]["submitted_by"] == "Ebelin Rolston"
