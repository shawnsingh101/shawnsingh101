#!/usr/bin/env python3
# Find free recordings on Wikimedia Commons for a list of musical themes, and rank them by how good they're likely to
# sound. Prints the best few per theme, as JSON lines, for a person to choose from (names say a lot, not everything).
#
#   python3 scripts/find-recordings.py themes.tsv > candidates.jsonl      (one theme per line: key<TAB>search words)
#
# Skipped: transfers of old 78 rpm records (crackle), stock-music arrangements on other instruments (ISRC USUAN…),
# MIDI, and short excerpts. Preferred: modern studio recordings (Musopen, US military bands, recent uploads).
# Goes slowly and retries, because Commons limits how fast it can be asked.
import json, re, subprocess, sys, time, urllib.parse

UA = 'GeoQuestStudyApp/0.1 (personal flashcard app)'
BAD = re.compile(r'PDP-CH|\bHmv\b|Electrola|Columbia-|Edison|Victor|Decca-|Gramophone|Brunswick|Odeon|78 ?rpm|shellac|USUAN|\.mid$|MIDI|ringtone|excerpt|bars? \d', re.I)
OLD = re.compile(r'\b(18[89]\d|19[0-4]\d)\b')   # a year from the 78 rpm era in the name
GOOD = re.compile(r'Musopen|Marine Band|Navy Band|Air Force|Army Band|Coast Guard|Philharmonic|Symphony Orchestra|Kammer|Chamber', re.I)

def api(params):
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode({**params, 'format': 'json'})
    for attempt in range(8):
        out = subprocess.run(['curl', '-s', '--max-time', '40', '-A', UA, url], capture_output=True, text=True).stdout
        try: return json.loads(out)
        except Exception: time.sleep(20 + 20 * attempt)  # rate-limited: wait it out
    return {}

def score(title, secs):
    s = 0
    if GOOD.search(title): s += 3
    if OLD.search(title): s -= 3
    if secs >= 90: s += 1
    if title.lower().endswith(('.ogg', '.oga', '.flac', '.wav')): s += 0.5
    return s

for line in open(sys.argv[1], encoding='utf-8'):
    if not line.strip() or line.startswith('#'): continue
    key, query = line.rstrip('\n').split('\t')[:2]
    d = api({'action': 'query', 'generator': 'search', 'gsrnamespace': 6, 'gsrsearch': query + ' filemime:audio', 'gsrlimit': 15, 'prop': 'imageinfo', 'iiprop': 'size'})
    found = []
    for p in d.get('query', {}).get('pages', {}).values():
        t, secs = p['title'][5:], round((p.get('imageinfo') or [{}])[0].get('duration', 0))
        if BAD.search(t) or secs < 40: continue
        found.append({'file': t, 'secs': secs, 'score': score(t, secs)})
    found.sort(key=lambda x: -x['score'])
    print(json.dumps({'key': key, 'query': query, 'best': found[:4]}, ensure_ascii=False), flush=True)
    time.sleep(3)
