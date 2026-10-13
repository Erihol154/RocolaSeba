import json
import os
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

DATA_PATH = r"C:\Users\dario\Documents\antigravity\quick-goodall\src\data\vinyls.json"

def fetch_media(item):
    artist = item.get("artist", "").strip()
    title = item.get("title", "").strip()
    
    cover_url = None
    audio_url = None

    if not artist or not title:
        return item

    # 1. Fetch official Album Cover (600x600 HD)
    try:
        query = urllib.parse.quote(f"{artist} {title}")
        url = f"https://itunes.apple.com/search?term={query}&entity=album&limit=1"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if data.get('results'):
                c100 = data['results'][0].get('artworkUrl100', '')
                if c100:
                    cover_url = c100.replace('100x100bb', '600x600bb')
    except Exception as e:
        pass

    # 2. Fetch Audio Track Preview (MP3/AAC sample)
    try:
        query_song = urllib.parse.quote(f"{artist} {title}")
        url_song = f"https://itunes.apple.com/search?term={query_song}&entity=song&limit=1"
        req_song = urllib.request.Request(url_song, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req_song, timeout=5) as resp:
            data_song = json.loads(resp.read().decode('utf-8'))
            if data_song.get('results'):
                audio_url = data_song['results'][0].get('previewUrl', None)
    except Exception as e:
        pass

    item['officialCover'] = cover_url
    item['audioPreview'] = audio_url
    return item

def process_all():
    if not os.path.exists(DATA_PATH):
        print(f"Error: {DATA_PATH} not found.")
        return

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        records = json.load(f)

    print(f"Fetching official cover art and audio previews for {len(records)} vinyl records...")

    updated_records = []
    found_covers = 0
    found_audio = 0

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(fetch_media, item): item for item in records}
        for future in as_completed(futures):
            res = future.result()
            if res.get('officialCover'):
                found_covers += 1
            if res.get('audioPreview'):
                found_audio += 1
            updated_records.append(res)

    # Maintain original catalog order
    id_map = {r['id']: r for r in updated_records}
    final_records = [id_map[r['id']] for r in records if r['id'] in id_map]

    with open(DATA_PATH, "w", encoding="utf-8") as out:
        json.dump(final_records, out, ensure_ascii=False, indent=2)

    print(f"Done! Found {found_covers} official HD album covers and {found_audio} audio preview samples.")

if __name__ == "__main__":
    process_all()
