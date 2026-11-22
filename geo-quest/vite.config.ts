import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Version shown on the home screen, so you can tell an update has gone live:
// package.json version + the git commit it was built from + the build date.
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
let commit = (process.env.GITHUB_SHA ?? '').slice(0, 7);
if (!commit) { try { commit = execSync('git rev-parse --short HEAD').toString().trim(); } catch { commit = 'dev'; } }

// base './' so the built site works from any sub-path (e.g. GitHub Pages).
// BUILD_ID is stamped into data URLs so a new deploy never mixes new code with stale cached data.
export default defineConfig({
  base: './',
  plugins: [react()],
  define: {
    __BUILD_ID__: JSON.stringify(Date.now().toString(36)),
    __APP_VERSION__: JSON.stringify(pkg.version),
    __COMMIT__: JSON.stringify(commit),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
});
