from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from curl_cffi import requests


@dataclass
class InstagramScraper:
    app_id: str
    user_id: str
    session_id: str

    def __post_init__(self) -> None:
        self.instagram_api_base_url = "https://i.instagram.com/api/v1"
        self.session = requests.Session()
        self.session.headers.update(
            {
                "accept": "*/*",
                "content-type": "application/x-www-form-urlencoded",
                "sec-fetch-site": "same-site",
                "x-ig-app-id": self.app_id,
                "cookie": f"ds_user_id={self.user_id}; sessionid={self.session_id};",
            }
        )

    def _get(self, url: str) -> requests.Response:
        return self.session.get(url, impersonate="chrome124")

    def get_user_id(self, username: str) -> str | None:
        try:
            response = self._get(
                f"{self.instagram_api_base_url}/users/web_profile_info/?username={username}"
            )
            response.raise_for_status()
            payload: dict[str, Any] = response.json()
            if payload.get("status") == "ok":
                return payload["data"]["user"]["id"]
            print(f"[+] Failed to get User-ID for {username}")
            return None
        except Exception:
            print(f"[+] Error in loading user-id from {username}. Maybe the user doesn't exist!")
            return None

    def get_story(self, user_id: str) -> dict[str, Any]:
        try:
            response = self._get(
                f"https://www.instagram.com/api/v1/feed/reels_media/?reel_ids={user_id}"
            )
            response.raise_for_status()
            return response.json()
        except Exception:
            print(f"[+] Error in fetching story for user with ID {user_id}")
            raise

