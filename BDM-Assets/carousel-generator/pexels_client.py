"""Pexels API client for video search and download."""
import requests
from pathlib import Path


class PexelsClient:
    BASE_URL = "https://api.pexels.com/videos/search"

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers["Authorization"] = api_key

    def search_videos(self, query: str, orientation: str = "portrait", per_page: int = 5) -> list[dict]:
        """Search Pexels for videos matching query. Returns list of video info dicts."""
        resp = self.session.get(self.BASE_URL, params={
            "query": query,
            "orientation": orientation,
            "per_page": per_page,
            "size": "medium",
        })
        resp.raise_for_status()
        data = resp.json()

        results = []
        for video in data.get("videos", []):
            # Pick best video file: prefer HD mp4, fallback to SD
            files = video.get("video_files", [])
            chosen = None
            for f in files:
                if f.get("file_type") == "video/mp4" and f.get("quality") == "hd":
                    chosen = f
                    break
            if not chosen:
                for f in files:
                    if f.get("file_type") == "video/mp4" and f.get("quality") == "sd":
                        chosen = f
                        break
            if not chosen and files:
                chosen = files[0]
            if chosen:
                results.append({
                    "id": video["id"],
                    "url": chosen["link"],
                    "width": chosen.get("width", 0),
                    "height": chosen.get("height", 0),
                    "duration": video.get("duration", 0),
                })
        return results

    def download_video(self, video_url: str, dest_path: Path) -> Path:
        """Download video file to dest_path. Returns the path."""
        dest_path = Path(dest_path)
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        resp = self.session.get(video_url, stream=True)
        resp.raise_for_status()
        with open(dest_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
        return dest_path
