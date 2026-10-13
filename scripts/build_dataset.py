import csv
import json
import os
import re

CONTENT_PATH = r"C:\Users\dario\.gemini\antigravity\brain\b5c1e3f1-d93b-4738-bc43-1d4b67f44f93\.system_generated\steps\6\content.md"
OUTPUT_DIR = r"C:\Users\dario\Documents\antigravity\quick-goodall\src\data"
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "vinyls.json")

GENRE_RULES = [
    ("Synth-Pop / New Wave", [
        "alphaville", "a-ha", "arcadia", "book of love", "camouflage", "depeche mode", 
        "duran duran", "erasure", "pet shop boys", "new order", "eurythmics", "cyndi lauper", 
        "boy george", "culture club", "bangles", "information society", "soft cell", "yello", 
        "ultravox", "human league", "omd", "orchestral manoeuvres", "talk talk", "spandau ballet", 
        "tears for fears", "real life", "cause & effect", "visage", "yazoo", "fancy", 
        "alison moyet", "bronski beat", "communica", "greg kihn", "thomas dolby", "propaganda"
    ]),
    ("Hard Rock / Heavy Metal", [
        "acdc", "ac/dc", "accept", "deep purple", "kiss", "rainbow", "blackmore", "bon jovi", 
        "whitesnake", "iron maiden", "scorpions", "def leppard", "alice cooper", "april wine", 
        "billy squier", "heart", "quiet riot", "van halen", "motley crue", "judas priest", 
        "dio", "w.a.s.p.", "ratt", "twisted sister", "poison", "cinderella", "skid row", 
        "ozzy", "black sabbath", "megadeth", "metallica", "slayer", "anthrax", "motorhead", 
        "saxon", "krokus", "europe", "great white", "dokken", "y&t", "loudness", "fastway", "savatage"
    ]),
    ("Eurodance / House / Club", [
        "amadin", "black machine", "brothers of funk", "bassix", "cappella", "chakra", 
        "chocolate", "clivillés & cole", "dr dj cerla", "cafe latino", "ace of base", 
        "2 unlimited", "dr alban", "snap", "technotronic", "corona", "culture beat", 
        "la bouche", "haddaway", "ice mc", "real mccoy", "dj bobo", "masterboy", "capitan dj", 
        "fun factory", "u96", "twenty 4 seven", "alexia", "playahitty", "whigfield", 
        "double you", "robert miles", "scatman", "vengaboys", "e-type", "loft", "maxx", 
        "intermission", "scooter", "urban cookie", "factory dancer", "dj", "remix", 
        "club mix", "house", "techno", "eurodance", "italo", "discomagic", "expanded music", 
        "zyx", "flying records", "dr. records", "smash one", "power brothers"
    ]),
    ("Pop / Disco / Funk", [
        "boney m", "billy ocean", "barry manilow", "billy preston", "angela bofill", 
        "cece peniston", "andy williams", "annie adams", "betty boo", "michael jackson", 
        "madonna", "prince", "george michael", "wham", "whitney houston", "donna summer", 
        "bee gees", "abba", "earth wind", "kool & the gang", "chic", "sister sledge", 
        "kc and the sunshine", "village people", "lipps inc", "pointer sisters", 
        "gloria gaynor", "rick james", "chaka khan", "diana ross", "lionel richie", 
        "commodores", "tina turner", "paula abdul", "kylie minogue", "rick astley", 
        "bananarama", "kim wilde", "samantha fox", "taylor dayne", "laura branigan", 
        "martika", "belinda carlisle", "debbie gibson", "clivilles", "sheena easton"
    ]),
    ("Classic Rock / Soft Rock", [
        "beatles", "bob dylan", "the clash", "chicago", "boston", "air supply", "america", 
        "al stewart", "asia", "bryan ferry", "chris rea", "david bowie", "mick jagger", 
        "squeeze", "eric clapton", "dire straits", "fleetwood mac", "eagles", "supertramp", 
        "toto", "police", "sting", "genesis", "phil collins", "peter gabriel", "queen", 
        "rolling stones", "who", "led zeppelin", "creedence", "santana", "elvis", 
        "john lennon", "paul mccartney", "george harrison", "roxy music", "u2", 
        "bruce springsteen", "tom petty", "r.e.m.", "midnight oil", "inxs", "simple minds", 
        "pretenders", "foreigner", "styx", "reo speedwagon", "journey", "bad company", 
        "cheap trick", "boz scaggs", "boys meets girl", "box tops", "bernie marsden"
    ]),
    ("Tango / Folklore / Rock Nacional", [
        "alberto cortez", "alberto echague", "alejandro lerner", "alfredo de angelis", 
        "alma y vida", "argentisima", "alvaro torres", "alberto castelar", "a mi paraguay", 
        "tango", "folklore", "zamba", "chacarera", "milonga", "troilo", "piazzolla", 
        "gardel", "goyeneche", "faley", "sosa", "chalchaleros", "fronterizos", "mercedes sosa", 
        "sui generis", "seru giran", "charly garcia", "spinetta", "fito paez", "soda stereo", 
        "virus", "git", "enrosque", "los abuelos de la nada", "los fabulosos cadillacs", 
        "los autenticos decadentes", "divididos", "las pelotas", "sumo", "redonditos", 
        "ratones paranoicos", "memphis", "vox dei", "pescado rabioso", "almendra"
    ]),
    ("Latino / Cumbia / Cuarteto", [
        "ariel", "el cordobaile", "belen thomas", "el chicano", "gilda", "ricky maravilla", 
        "los palmeras", "pocho la pantera", "alcides", "sombras", "comanche", "rasta", 
        "cuarteto", "cumbia", "gaita", "bailongo", "tropical", "magenta", "acapulco", "azucar moreno"
    ]),
    ("Blues / Jazz / Soul", [
        "b. b. king", "b.b. king", "audio inspection", "curtis in chicago", "curtis mayfield", 
        "miles davis", "john coltrane", "louis armstrong", "ella fitzgerald", "nina simone", 
        "ray charles", "aretha franklin", "stevie wonder", "marvin gaye", "sam cooke", 
        "otis redding", "muddy waters", "howlin wolf", "buddy guy", "robert johnson", 
        "albert king", "freddie king", "astrud gilberto", "jazz", "blues", "soul", "funk"
    ])
]

def extract_drive_ids(photo_field):
    if not photo_field:
        return []
    urls = [u.strip() for u in photo_field.replace('"', '').split(',') if u.strip()]
    ids = []
    for url in urls:
        m = re.search(r'id=([a-zA-Z0-9_-]+)', url)
        if m:
            ids.append(m.group(1))
    return ids

def classify_genre(artist, title, label, side_a, side_b):
    text = f"{artist} {title} {label} {side_a} {side_b}".lower()
    for genre_name, keywords in GENRE_RULES:
        for kw in keywords:
            if kw in text:
                return genre_name
    return "Pop / Rock General"

def parse_dataset():
    with open(CONTENT_PATH, "r", encoding="utf-8") as f:
        lines = f.readlines()

    start_idx = 0
    for i, l in enumerate(lines):
        if "Compañía discográfica" in l:
            start_idx = i
            break

    csv_data = "".join(lines[start_idx:])
    reader = list(csv.reader(csv_data.splitlines()))
    headers = reader[0]
    rows = reader[1:]

    records = []
    genre_counts = {}
    seen_ids = set()

    for idx, r in enumerate(rows):
        if len(r) < 10:
            continue
        label = r[1].strip()
        artist = r[2].strip()
        title = r[3].strip()
        side_a = r[4].strip()
        side_b = r[5].strip()
        cover_cond = r[6].strip()
        vinyl_cond = r[7].strip()
        photos_raw = r[8].strip()
        year = r[9].strip()
        notes = r[10].strip() if len(r) > 10 else ""
        
        raw_id = r[13].strip() if len(r) > 13 else ""
        if raw_id and raw_id != "#N/A" and raw_id != "N/A" and raw_id not in seen_ids:
            catalog_id = raw_id
        else:
            catalog_id = f"VINYL-{idx+1}"
        seen_ids.add(catalog_id)

        genre = classify_genre(artist, title, label, side_a, side_b)
        genre_counts[genre] = genre_counts.get(genre, 0) + 1

        drive_ids = extract_drive_ids(photos_raw)
        
        primary_photo = f"https://lh3.googleusercontent.com/d/{drive_ids[0]}" if drive_ids else None
        all_photos = [f"https://lh3.googleusercontent.com/d/{pid}" for pid in drive_ids]

        records.append({
            "id": catalog_id,
            "artist": artist,
            "title": title,
            "label": label,
            "year": year if year and year != "No tiene" and year != "0" else "N/A",
            "genre": genre,
            "sideA": side_a,
            "sideB": side_b,
            "coverCondition": cover_cond,
            "vinylCondition": vinyl_cond,
            "driveIds": drive_ids,
            "primaryPhoto": primary_photo,
            "photos": all_photos,
            "notes": notes
        })

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as out:
        json.dump(records, out, ensure_ascii=False, indent=2)

    print(f"Successfully processed {len(records)} vinyl records with unique IDs into {OUTPUT_PATH}")

if __name__ == "__main__":
    os.makedirs("scripts", exist_ok=True)
    parse_dataset()
