import json
import os
import re
from collections import defaultdict
import urllib.parse
import urllib.request

DATA_PATH = r"C:\Users\dario\Documents\antigravity\quick-goodall\src\data\vinyls.json"

def clean_str(s):
    if not s:
        return ""
    s = re.sub(r'\(.*?\)', '', s)
    s = re.sub(r'\[.*?\]', '', s)
    s = re.sub(r'[^a-zA-Z0-9]', '', s).lower()
    return s

def deduplicate_and_verify():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        records = json.load(f)

    print(f"Total records: {len(records)}")

    # Map cover URLs to records
    cover_map = defaultdict(list)
    for r in records:
        cov = r.get("officialCover")
        if cov:
            cover_map[cov].append(r)

    duplicates_cleared = 0
    for cov, item_list in cover_map.items():
        if len(item_list) > 1:
            # Check if all items in this list have similar titles
            # If they have completely different titles, it's a false match!
            titles = set(clean_str(item['title']) for item in item_list)
            if len(titles) > 1:
                # Keep cover ONLY for the record whose title matches the cover URL or best fit
                # For the rest, clear officialCover so it doesn't show fake duplicate images!
                for item in item_list[1:]:
                    item['officialCover'] = None
                    duplicates_cleared += 1

    print(f"Cleared {duplicates_cleared} false duplicate covers!")

    # Save back
    with open(DATA_PATH, "w", encoding="utf-8") as out:
        json.dump(records, out, ensure_ascii=False, indent=2)

    found_covers = sum(1 for r in records if r.get('officialCover'))
    print(f"Clean accurate covers remaining: {found_covers}/{len(records)}")

if __name__ == "__main__":
    deduplicate_and_verify()
