import urllib.request
import json

import os
TOKEN = os.environ.get("VERCEL_TOKEN")
if not TOKEN:
    raise SystemExit("Definí la variable de entorno VERCEL_TOKEN antes de ejecutar este script.")
PROJECT_ID = "prj_AXwPYIsRmATbJbdtRKeWWxR3nfgC"

# 1. Fetch deploy hooks via Vercel API v9
url_list = f"https://api.vercel.com/v9/projects/{PROJECT_ID}"
req = urllib.request.Request(url_list, headers={"Authorization": f"Bearer {TOKEN}"})

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print("Project details:", data.get('name'), data.get('id'))
        link = data.get('link', {})
        print("Link:", link)
except Exception as e:
    print("Error fetching project:", e)

# 2. Create Deploy Hook for project
url_create = f"https://api.vercel.com/v1/projects/{PROJECT_ID}/deploy-hooks"
payload = json.dumps({"name": "Google Sheets Auto Update", "ref": "main"}).encode('utf-8')
req_create = urllib.request.Request(url_create, data=payload, headers={
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
})

try:
    with urllib.request.urlopen(req_create) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print("Created hook response:", data)
except Exception as e:
    print("Error creating hook:", e)
