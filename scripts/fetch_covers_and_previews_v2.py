import json
import os
import urllib.parse
import urllib.request
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

DATA_PATH = r"C:\Users\dario\Documents\antigravity\quick-goodall\src\data\vinyls.json"

def clean_text(text):
    if not text:
        return ""
    # Remove parens, extra spaces, special symbols
    cleaned = re.sub(r'\(.*?\)', '', text)
    cleaned = re.sub(r'\[.*?\]', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def fetch_media_enhanced(item):
    artist_raw = item.get("artist", "").strip()
    title_raw = item.get("title", "").strip()
    
    cover_url = item.get("officialCover")
    audio_url = item.get("audioPreview")

    if cover_url and audio_url:
        return item

    artist = clean_text(artist_raw)
    title = clean_text(title_raw)

    if not artist or artist.upper() == "VARIOS" or artist.upper() == "VARIOUS":
        search_query = title
    else:
        search_query = f"{artist} {title}"

    # 1. Try Deezer Search API (Great for Latin America, Tango, Rock Nacional, International)
    if not cover_url or not audio_url:
        try:
            q_enc = urllib.parse.quote(search_query)
            url = f"https://api.deezer.com/search?q={q_enc}&limit=3"
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=4) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                if data.get('data') and len(data['data']) > 0:
                    first = data['data'][0]
                    if not cover_url:
                        album_info = first.get('album', {})
                        cover_url = album_info.get('cover_xl') or album_info.get('cover_big') or album_info.get('cover_medium')
                    if not audio_url:
                        audio_url = first.get('preview')
        except Exception as e:
            pass

    # 2. Try iTunes Search API with country=AR (Argentina) and fallback country=US
    if not cover_url or not audio_url:
        for country in ['AR', 'ES', 'US']:
            if cover_url and audio_url:
                break
            try:
                q_enc = urllib.parse.quote(search_query)
                url = f"https://itunes.apple.com/search?term={q_enc}&country={country}&limit=3"
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=4) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    if data.get('results'):
                        res = data['results'][0]
                        if not cover_url:
                            c100 = res.get('artworkUrl100', '')
                            if c100:
                                cover_url = c100.replace('100x100bb', '600x600bb')
                        if not audio_url:
                            audio_url = res.get('previewUrl')
            except Exception as e:
                pass

    # 3. If title only search helps
    if (not cover_url or not audio_url) and artist and title:
        try:
            q_enc = urllib.parse.quote(artist)
            url = f"https://api.deezer.com/search/artist?q={q_enc}&limit=1"
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=4) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                if data.get('data'):
                    artist_img = data['data'][0].get('picture_xl') or data['data'][0].get('picture_big')
                    if not cover_url and artist_img:
                        cover_url = artist_img
        except Exception:
            pass

    item['officialCover'] = cover_url
    item['audioPreview'] = audio_url
    return item

def main():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        records = json.load(f)

    print(f"Enhancing dataset with Deezer + Multi-country iTunes API for {len(records)} records...")
    
    updated_records = []
    found_covers = 0
    found_audio = 0

    with ThreadPoolExecutor(max_workers=15) as executor:
        futures = {executor.submit(fetch_media_enhanced, item): item for item in records}
        for future in as_completed(futures):
            res = future.result()
            if res.get('officialCover'):
                found_covers += 1
            if res.get('audioPreview'):
                found_audio += 1
            updated_records.append(res)

    id_map = {r['id']: r for r in updated_records}
    final_records = [id_map[r['id']] for r in records if r['id'] in id_map]

    with open(DATA_PATH, "w", encoding="utf-8") as out:
        json.dump(final_records, out, ensure_ascii=False, indent=2)

    print(f"Finished! Found {found_covers}/{len(records)} covers and {found_audio}/{len(records)} audio previews!")

if __name__ == "__main__":
    main()
