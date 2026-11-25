from unittest.mock import AsyncMock, patch

import pytest

from backend.kobo_service import (
    fetch_kobo_submissions,
    normalize_server_url,
    validate_server_url,
)


def test_normalize_server_url():
    assert normalize_server_url("kf.kobotoolbox.org") == "https://kf.kobotoolbox.org"
    assert normalize_server_url("https://eu.kobotoolbox.org/") == "https://eu.kobotoolbox.org"


def test_validate_server_url_blocks_ssrf():
    assert validate_server_url("https://kf.kobotoolbox.org/") == "https://kf.kobotoolbox.org"
    with pytest.raises(ValueError, match="HTTPS"):
        validate_server_url("http://kf.kobotoolbox.org")
    with pytest.raises(ValueError, match="IP"):
        validate_server_url("https://169.254.169.254")
    with pytest.raises(ValueError, match="no permitido"):
        validate_server_url("https://evil.example.com")


@pytest.mark.asyncio
async def test_fetch_kobo_submissions_success():
    mock_response = AsyncMock()
    mock_response.status_code = 200
    mock_response.is_success = True
    mock_response.json = lambda: {
        "count": 1,
        "results": [{"_id": 100, "start-geopoint": "10.4 -66.9 100 2.0"}],
    }

    with patch("httpx.AsyncClient.get", return_value=mock_response) as mock_get:
        data = await fetch_kobo_submissions(
            server_url="https://kf.kobotoolbox.org",
            asset_uid="aJwBHzgWAqMozzcGLbZjgE",
            token="test-token-123",
            limit=50,
            offset=0,
        )

        assert mock_get.called
        call_url = mock_get.call_args[0][0]
        headers = mock_get.call_args[1]["headers"]
        assert "aJwBHzgWAqMozzcGLbZjgE" in call_url
        assert headers["Authorization"] == "Token test-token-123"
        assert data["count"] == 1
