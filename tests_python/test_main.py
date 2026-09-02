from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_healthcheck_endpoint():
    response = client.get("/api/kobo/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "FastAPI" in data["service"]

def test_data_missing_credentials_endpoint(monkeypatch):
    monkeypatch.delenv("KOBO_API_TOKEN", raising=False)
    monkeypatch.delenv("KOBO_ASSET_UID", raising=False)
    response = client.get("/api/kobo/data")
    assert response.status_code == 400
    data = response.json()
    assert "Credenciales" in data["detail"]

def test_test_connection_missing_token():
    response = client.post("/api/kobo/test-connection", json={"serverUrl": "https://kf.kobotoolbox.org", "assetUid": "123"})
    assert response.status_code == 400
    data = response.json()
    assert "error" in data
