#!/usr/bin/env python3
# Where should a music clip start? Downloads each recording (Wikimedia's MP3 copy) and finds its signature 30 s: 'loud' = the loudest window (a climax: cannons, a finale);
# 'high' = the window with most energy at 1.1-1.5 kHz relative to the rest (a soprano's high staccato).
import hashlib, json, subprocess, sys, time, urllib.parse, os
import numpy as np
# Usage: printf 'File name.ogg\tloud\n' | python3 scripts/find-clip-moments.py   (needs ffmpeg and numpy)
#        a third and fourth column limit the search to a range of seconds: 'File.ogg\tloud\t60\t260'.
# Write the result as '@seconds' after the file in the music list. Downloads go to ./dl (delete afterwards).
UA = 'GeoQuestStudyApp/0.1 (personal flashcard app)'
SR = 11025
os.makedirs('dl', exist_ok=True)
def urls(f):
    n = f.replace(' ', '_'); n = n[0].upper() + n[1:]; h = hashlib.md5(n.encode()).hexdigest(); e = urllib.parse.quote(n, safe='')
    base = f'https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{e}'
    return [base] if n.lower().endswith('.mp3') else [f'https://upload.wikimedia.org/wikipedia/commons/transcoded/{h[0]}/{h[:2]}/{e}/{e}.mp3', base]
def fetch(f):
    out = 'dl/' + hashlib.md5(f.encode()).hexdigest()
    if os.path.exists(out) and os.path.getsize(out) > 10000: return out
    for u in urls(f):
        for attempt in range(3):
            code = subprocess.run(['curl', '-s', '-L', '-o', out, '-w', '%{http_code}', '--max-time', '300', '-A', UA, u], capture_output=True, text=True).stdout
            if code == '200': return out
            if code == '429': time.sleep(20 * (attempt + 1)); continue
            break
    return None
def analyze(f, mode, win=30, lo=0, hi=None):
    p = fetch(f)
    if not p: return None, 'download failed'
    raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    secs = len(x) // SR
    if secs < win + 2: return 0, f'{secs}s long'
    frames = x[:secs * SR].reshape(secs, SR)
    spec = np.abs(np.fft.rfft(frames * np.hanning(SR), axis=1)) ** 2
    freqs = np.fft.rfftfreq(SR, 1 / SR)
    total = spec[:, (freqs > 60) & (freqs < 5000)].sum(1) + 1e-9
    if mode == 'loud': score = np.sqrt((frames ** 2).mean(1))
    else: score = spec[:, (freqs > 1100) & (freqs < 1500)].sum(1) / total * np.sqrt((frames ** 2).mean(1))
    hi = min(hi or secs, secs) - win
    best = max(range(lo, max(lo + 1, hi)), key=lambda s: score[s:s + win].mean())
    # Start a few seconds before the peak window, so the moment arrives rather than starts mid-note.
    return max(0, best - 3), f'{secs}s long'
for line in sys.stdin:
    if not line.strip(): continue
    f, mode, *rng = line.rstrip('\n').split('\t')
    lo, hi = (int(rng[0]), int(rng[1])) if rng else (0, None)
    s, info = analyze(f, mode, lo=lo, hi=hi)
    print(json.dumps({'file': f, 'mode': mode, 'start': s, 'info': info}), flush=True)
    time.sleep(2)
