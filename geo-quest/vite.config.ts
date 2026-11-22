import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the built site works from any sub-path (e.g. GitHub Pages).
// BUILD_ID is stamped into data URLs so a new deploy never mixes new code with stale cached data.
export default defineConfig({ base: './', plugins: [react()], define: { __BUILD_ID__: JSON.stringify(Date.now().toString(36)) } });
