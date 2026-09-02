from backend.mock_data import generate_mock_geojson, MOCK_ENUMERATORS, MOCK_CATEGORIES

def test_generate_mock_geojson():
    count = 20
    data = generate_mock_geojson(count)
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) == count
    assert data["meta"]["is_mock"] is True
    assert data["meta"]["total"] == count

    f0 = data["features"][0]
    assert f0["type"] == "Feature"
    assert f0["geometry"]["type"] == "Point"
    assert len(f0["geometry"]["coordinates"]) == 2

def test_mock_options():
    assert isinstance(MOCK_ENUMERATORS, list)
    assert len(MOCK_ENUMERATORS) > 0
    assert isinstance(MOCK_CATEGORIES, list)
    assert len(MOCK_CATEGORIES) > 0
