from __future__ import annotations

import json
import random
from datetime import datetime
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

from curl_cffi import requests

from lib.ig import InstagramScraper


JAKARTA = ZoneInfo("Asia/Jakarta")
CONFIG_PATH = Path("config.json")


def date_now() -> str:
    return datetime.now(JAKARTA).strftime("%H:%M:%S")


def load_config() -> dict[str, str]:
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def build_elements(story_json: dict[str, Any]) -> list[dict[str, Any]]:
    elements: list[dict[str, Any]] = []
    reels_media = story_json.get("reels_media") or []
    items = reels_media[0].get("items") if reels_media else None

    if not items:
        return elements

    for item in items:
        if item.get("video_versions"):
            elements.append({"type": "video", "data": item["video_versions"][0]})
        else:
            elements.append({"type": "image", "data": item["image_versions2"]["candidates"][0]})

    return elements


def download_file(url: str, destination: Path) -> None:
    response = requests.get(url, impersonate="chrome124")
    response.raise_for_status()
    destination.write_bytes(response.content)


def main() -> None:
    config = load_config()
    instagram_scraper = InstagramScraper(
        config["X-Ig-App-Id"], config["ds_user_id"], config["sessionid"]
    )

    username = input("[+] Instagram Username: ").strip()
    if not username:
        return

    user_id = instagram_scraper.get_user_id(username)
    if not user_id:
        return

    try:
        story_json = instagram_scraper.get_story(user_id)
    except Exception:
        print(f"[+] [{date_now()}] Cookie its not valid, please check again your config.json file.")
        return

    elements = build_elements(story_json)
    if not elements:
        print(
            f"[+] [{date_now()}] Username of {username} its not found or not have story or account its private."
        )
        return

    folder = Path("temp") / "story" / username
    folder.mkdir(parents=True, exist_ok=True)
    print(f"[+] [{date_now()}] Start Downloading story from {username}...")

    downloaded = 0
    for item in elements:
        now = datetime.now()
        date_part = now.strftime("%d-%m-%Y")
        time_part = f"{now.hour}-{now.minute}-{now.second}-{int(now.microsecond / 1000)}"
        random_part = random.randint(1111, 9999)
        base_name = folder / f"{date_part}-{time_part}-{random_part}"

        try:
            if item["type"] == "video":
                destination = base_name.with_suffix(".mp4")
            else:
                destination = base_name.with_suffix(".jpg")

            download_file(item["data"]["url"], destination)
            downloaded += 1
            print(
                f"[+] [{date_now()}] Downloading story {item['type']} from {username} "
                f"{downloaded} of {len(elements)}"
            )
        except Exception as error:
            print(f"[+] [{date_now()}] Error fetching {item['type']} content: {error}")


if __name__ == "__main__":
    main()

