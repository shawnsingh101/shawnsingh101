// Edits from inside the app go to GitHub as pull requests, made with the owner's own fine-grained token.
// The token is kept on this device only (its own localStorage key: never in progress or backups) and is sent only to
// api.github.com. GitHub's API allows requests from a web page, so no server is needed.
export const OWNER = 'shawnsingh101', REPO = 'shawnsingh101', BASE = 'main';
const KEY = 'geoquest:github';
const API = `https://api.github.com/repos/${OWNER}/${REPO}`;

export interface Sent { url: string; number: number; card: string; date: string }
interface Stored { token: string | null; sent: Sent[] }
function read(): Stored { try { const v = JSON.parse(localStorage.getItem(KEY) ?? ''); return { token: v.token ?? null, sent: v.sent ?? [] }; } catch { return { token: null, sent: [] }; } }
function write(s: Stored) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode */ } }
export const getToken = () => read().token;
export const setToken = (token: string | null) => write({ ...read(), token });
export const sentEdits = () => read().sent;

async function gh<T>(path: string, init: RequestInit = {}, token = getToken()): Promise<T> {
  if (!token) throw new Error('No GitHub token on this device yet.');
  const r = await fetch(API + path, { ...init, headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', ...(init.body ? { 'Content-Type': 'application/json' } : {}) } });
  if (!r.ok) {
    let msg = ''; try { msg = (await r.json()).message ?? ''; } catch { /* not JSON */ }
    if (r.status === 401) throw new Error('GitHub did not accept the token (it may have expired). Make a new one in Settings › Editing on GitHub.');
    if (r.status === 403 || r.status === 404) throw new Error(`The token can't do this (${msg || r.status}). It needs this repository, with Contents and Pull requests set to "Read and write".`);
    throw new Error(`GitHub said: ${msg || r.status}`);
  }
  return r.status === 204 ? (undefined as T) : r.json();
}

/** Checks a token before saving it: can it see the repository and write to it? */
export async function checkToken(token: string) {
  const repo = await gh<{ permissions?: { push?: boolean } }>('', {}, token);
  if (!repo.permissions?.push) throw new Error('The token can read the repository but not change it. Set Contents and Pull requests to "Read and write".');
}

// File contents travel as base64 of their UTF-8 bytes (cards are full of 日本, Ελλάδα, $\alpha$).
const toB64 = (s: string) => { const b = new TextEncoder().encode(s); let out = ''; for (let i = 0; i < b.length; i += 0x8000) out += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(out); };
const fromB64 = (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\n/g, '')), c => c.charCodeAt(0)));

/**
 * Replace `oldText` with `newText` in a file on a new branch, and open a pull request for it.
 * The file is read fresh from GitHub, so an edit made since this version of the app was built isn't lost; if the
 * old text isn't there any more, nothing is sent.
 */
export async function proposeEdit(o: { path: string; oldText: string; newText: string; title: string; body: string; card: string }): Promise<Sent> {
  const ref = await gh<{ object: { sha: string } }>(`/git/ref/heads/${BASE}`);
  const file = await gh<{ content: string; sha: string }>(`/contents/${encodeURI(o.path)}?ref=${BASE}`);
  const current = fromB64(file.content);
  const at = current.indexOf(o.oldText);
  if (at < 0) throw new Error('This card has changed on GitHub since this version of the app. Reload the app once the latest update is live, then try again.');
  const updated = current.slice(0, at) + o.newText + current.slice(at + o.oldText.length);
  const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const branch = `edit/${o.path.split('/').pop()!.replace(/\.md$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}-${stamp}`;
  await gh(`/git/refs`, { method: 'POST', body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: ref.object.sha }) });
  await gh(`/contents/${encodeURI(o.path)}`, { method: 'PUT', body: JSON.stringify({ message: o.title, content: toB64(updated), sha: file.sha, branch }) });
  const pr = await gh<{ html_url: string; number: number }>(`/pulls`, { method: 'POST', body: JSON.stringify({ title: o.title, head: branch, base: BASE, body: o.body }) });
  const sent: Sent = { url: pr.html_url, number: pr.number, card: o.card, date: new Date().toISOString() };
  const s = read(); write({ ...s, sent: [sent, ...s.sent].slice(0, 50) });
  return sent;
}
