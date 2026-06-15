#!/usr/bin/env python3
"""
Fetch one CC-licensed JPEG per PC-component category from Wikimedia Commons and
save it into src/assets/components/. Also writes an attributions file capturing
author + license for each image (required for CC-BY / CC-BY-SA).

No API key required. Run from the repo root:  python3 scripts/fetch-stock-images.py
"""
import json
import os
import re
import subprocess
import sys
import urllib.parse

OUT_DIR = os.path.join("src", "assets", "components")
ATTR_PATH = os.path.join("src", "assets", "components", "ATTRIBUTIONS.json")
API = "https://commons.wikimedia.org/w/api.php"
UA = "RigForge/1.0 (educational demo; stock image fetch)"

# Reject obvious non-product imagery (screenshots, diagrams, benchmarks, etc.).
BLOCK = re.compile(
    r"(test|diagnos|screenshot|screen|benchmark|diagram|chart|graph|bios|"
    r"logo|icon|map|comparison|labeled|exploded|schematic|render|drawing|"
    r"echo|phone|laptop|notebook|amazon|arduino|raspberry|tablet|smartphone|"
    r"adapter|expresscard|beige|vintage|antique|broken|dust|repair|"
    r"cart|cartridge|console|game|toy|nintendo|sega|atari|playstation|xbox)",
    re.I,
)

# keyword = soft preference (titles containing it rank first)
CATEGORIES = {
    "cpu": ("processor", ["AMD Ryzen processor", "Intel Core processor", "microprocessor cpu chip", "cpu pins lga"]),
    "gpu": ("graphics", ["graphics card", "video card geforce", "radeon graphics card"]),
    "motherboard": ("motherboard", ["asus gaming motherboard", "msi motherboard atx", "gigabyte motherboard", "computer motherboard atx"]),
    "memory": ("memory", ["DDR4 memory module", "RAM DIMM module", "computer memory ram stick"]),
    "cooler": ("cooler", ["cpu cooler tower heatsink", "air cooler cpu", "cpu heatsink fan"]),
    "storage": ("ssd", ["samsung ssd", "kingston ssd", "solid state drive ssd"]),
    "psu": ("power supply", ["atx power supply unit", "computer power supply", "pc psu"]),
    "case": ("tower", ["computer tower black", "desktop pc tower", "atx midi tower computer", "gaming computer tower"]),
}


def api_get(params):
    # Use curl: it ships with the system CA bundle (urllib does not here).
    url = API + "?" + urllib.parse.urlencode(params)
    out = subprocess.run(
        ["curl", "-sSL", "-A", UA, url], capture_output=True, timeout=40
    )
    return json.loads(out.stdout)


def search_image(term, keyword, width=1100):
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": f"{term} filemime:image/jpeg",
        "gsrnamespace": "6",
        "gsrlimit": "12",
        "prop": "imageinfo",
        "iiprop": "url|extmetadata|size|mime",
        "iiurlwidth": str(width),
    }
    data = api_get(params)
    pages = data.get("query", {}).get("pages", {})
    candidates = []
    for p in pages.values():
        title = p.get("title", "")
        info = (p.get("imageinfo") or [{}])[0]
        if not info.get("thumburl") or info.get("mime") != "image/jpeg":
            continue
        if BLOCK.search(title):
            continue
        w = info.get("thumbwidth", 0)
        h = info.get("thumbheight", 1)
        # avoid extreme aspect ratios (panoramas / tall strips)
        if w / max(h, 1) > 2.4 or h / max(w, 1) > 2.0:
            continue
        prefers = keyword.lower() in title.lower()
        candidates.append((prefers, w, title, info))
    candidates.sort(key=lambda c: (c[0], c[1]), reverse=True)
    return (candidates[0][2], candidates[0][3]) if candidates else None


def strip_html(s):
    return re.sub(r"<[^>]+>", "", s or "").strip()


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    # Merge into existing attributions so partial re-runs keep prior entries.
    try:
        with open(ATTR_PATH) as f:
            attributions = json.load(f)
    except Exception:  # noqa: BLE001
        attributions = {}
    only = set(sys.argv[1:])
    selected = {c: v for c, v in CATEGORIES.items() if not only or c in only}
    for cat, (keyword, terms) in selected.items():
        hit = None
        for term in terms:
            try:
                hit = search_image(term, keyword)
            except Exception as e:  # noqa: BLE001
                print(f"  ! {cat}: '{term}' error {e}", file=sys.stderr)
                hit = None
            if hit:
                break
        if not hit:
            print(f"  ! {cat}: no image found", file=sys.stderr)
            continue
        title, info = hit
        meta = info.get("extmetadata", {})
        dest = os.path.join(OUT_DIR, f"{cat}.jpg")
        subprocess.run(
            ["curl", "-sSL", "-A", UA, "-o", dest, info["thumburl"]],
            timeout=90,
            check=True,
        )
        size = os.path.getsize(dest)
        attributions[cat] = {
            "file": title,
            "author": strip_html(meta.get("Artist", {}).get("value", "Unknown")),
            "license": strip_html(meta.get("LicenseShortName", {}).get("value", "")),
            "source": info.get("descriptionurl", ""),
        }
        print(f"  ok {cat}: {size // 1024} KB  {title[5:]}  ({attributions[cat]['license']})")

    with open(ATTR_PATH, "w") as f:
        json.dump(attributions, f, indent=2)
    print(f"\nWrote {len(attributions)} images + attributions to {OUT_DIR}")


if __name__ == "__main__":
    main()
