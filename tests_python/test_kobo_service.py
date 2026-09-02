import pytest
from unittest.mock import AsyncMock, patch
from backend.kobo_service import fetch_kobo_submissions, validate_kobo_connection, normalize_server_url

def test_normalize_server_url():
    assert normalize_server_url("kf.kobotoolbox.org") == "https://kf.kobotoolbox.org"
    assert normalize_server_url("https://eu.kobotoolbox.org/") == "https://eu.kobotoolbox.org"

@pytest.mark.asyncio
async def test_fetch_kobo_submissions_success():
    mock_response = AsyncMock()
    mock_response.status_code = 200
    mock_response.is_success = True
    mock_response.json = lambda: {
        "count": 1,
        "results": [{"_id": 100, "start-geopoint": "10.4 -66.9 100 2.0"}]
    }

    with patch("httpx.AsyncClient.get", return_value=mock_response) as mock_get:
        data = await fetch_kobo_submissions(
            server_url="https://kf.kobotoolbox.org",
            asset_uid="aJwBHzgWAqMozzcGLbZjgE",
            token="test-token-123",
            limit=50,
            offset=0
        )

        assert mock_get.called
        call_url = mock_get.call_args[0][0]
        headers = mock_get.call_args[1]["headers"]
        assert "aJwBHzgWAqMozzcGLbZjgE" in call_url
        assert headers["Authorization"] == "Token test-token-123"
        assert data["count"] == 1
