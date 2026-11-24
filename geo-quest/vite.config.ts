import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';
import { createReadStream, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Version shown on the home screen, so you can tell an update has gone live:
// package.json version + the git commit it was built from + the build date.
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
let commit = (process.env.GITHUB_SHA ?? '').slice(0, 7);
if (!commit) { try { commit = execSync('git rev-parse --short HEAD').toString().trim(); } catch { commit = 'dev'; } }

// Python for practice cards (src/python.ts): Pyodide's core files, copied from the pinned npm package into the site at
// pyodide/ (and served from there in dev), so it loads from the app's own address, not a third-party CDN.
const PYODIDE = ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'];
function pyodide(): Plugin {
  const dir = fileURLToPath(new URL('./node_modules/pyodide/', import.meta.url));
  return {
    name: 'pyodide',
    configureServer(server) {
      server.middlewares.use('/pyodide/', (req, res, next) => {
        const f = (req.url ?? '').split('?')[0].replace(/^\//, '');
        if (!PYODIDE.includes(f)) return next();
        res.setHeader('Content-Type', f.endsWith('.wasm') ? 'application/wasm' : f.endsWith('.zip') ? 'application/zip' : f.endsWith('.json') ? 'application/json' : 'text/javascript');
        createReadStream(dir + f).pipe(res);
      });
    },
    generateBundle() { for (const f of PYODIDE) this.emitFile({ type: 'asset', fileName: 'pyodide/' + f, source: readFileSync(dir + f) }); },
  };
}

// base './' so the built site works from any sub-path (e.g. GitHub Pages).
// BUILD_ID is stamped into data URLs so a new deploy never mixes new code with stale cached data.
export default defineConfig({
  base: './',
  plugins: [react(), pyodide()],
  define: {
    __BUILD_ID__: JSON.stringify(Date.now().toString(36)),
    __APP_VERSION__: JSON.stringify(pkg.version),
    __COMMIT__: JSON.stringify(commit),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
});
