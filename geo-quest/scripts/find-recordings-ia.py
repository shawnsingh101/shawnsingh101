#!/usr/bin/env python3
# Find free recordings of musical themes on the Internet Archive (archive.org), which holds Musopen's public-domain
# catalog and many more. Commons limits searches hard; the Archive doesn't. Only recordings free to reuse are kept:
# public domain, CC0, CC BY / BY-SA, or Musopen (public domain). For each theme: the best few albums, and in each the
# file whose name best matches the theme (the right movement), with its length.
#
#   python3 scripts/find-recordings-ia.py themes.tsv > candidates.jsonl     (key<TAB>search words<TAB>words for the file)
import json, re, subprocess, sys, time, urllib.parse

UA = 'GeoQuestStudyApp/0.1 (personal flashcard app)'
FREE = re.compile(r'publicdomain|/zero/|/by/|/by-sa/', re.I)
OLD = re.compile(r'78rpm|78_|georgeblood|\b19[0-4]\d\b', re.I)  # 78 rpm transfers (the Great 78 Project): crackle

def get(url):
    for attempt in range(5):
        out = subprocess.run(['curl', '-s', '-L', '--max-time', '60', '-A', UA, url], capture_output=True, text=True).stdout
        try: return json.loads(out)
        except Exception: time.sleep(5 * (attempt + 1))
    return {}

def words(s): return [w for w in re.split(r'[^a-z0-9]+', s.lower()) if len(w) > 1]

for line in open(sys.argv[1], encoding='utf-8'):
    if not line.strip() or line.startswith('#'): continue
    key, query, *rest = line.rstrip('\n').split('\t')
    want = words(rest[0] if rest and rest[0] else query)
    q = f'({query}) AND mediatype:audio'
    d = get('https://archive.org/advancedsearch.php?' + urllib.parse.urlencode({'q': q, 'fl[]': ['identifier', 'title', 'licenseurl', 'collection', 'downloads'], 'rows': 25, 'output': 'json'}, doseq=True))
    items = []
    for x in d.get('response', {}).get('docs', []):
        lic, coll = x.get('licenseurl') or '', ' '.join(x.get('collection') or []) if isinstance(x.get('collection'), list) else str(x.get('collection') or '')
        musopen = 'musopen' in (x['identifier'] + ' ' + coll + ' ' + str(x.get('title'))).lower()
        if not (FREE.search(lic) or musopen) or re.search(r'-nc|-nd', lic) or OLD.search(x['identifier'] + coll): continue
        items.append({**x, 'musopen': musopen, 'license': lic or ('Musopen (public domain)' if musopen else '')})
    items.sort(key=lambda x: (not x['musopen'], -(x.get('downloads') or 0)))
    best = []
    for it in items[:5]:
        md = get(f"https://archive.org/metadata/{it['identifier']}")
        files = [f for f in md.get('files', []) if f.get('name', '').lower().endswith('.mp3')]
        def fit(f): w = set(words(f['name'] + ' ' + f.get('title', ''))); return sum(1 for x in want if x in w)
        files.sort(key=lambda f: -fit(f))
        if files and fit(files[0]) > 0:
            f = files[0]
            best.append({'item': it['identifier'], 'title': it.get('title'), 'file': f['name'], 'secs': round(float(f.get('length', 0) or 0)) if re.match(r'^[\d.]+$', str(f.get('length', ''))) else f.get('length'),
                         'match': fit(f), 'license': it['license'], 'url': f"https://archive.org/download/{it['identifier']}/{urllib.parse.quote(f['name'])}"})
        time.sleep(0.5)
    best.sort(key=lambda b: -b['match'])
    print(json.dumps({'key': key, 'best': best[:3]}, ensure_ascii=False), flush=True)
    time.sleep(1)
