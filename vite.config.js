import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served from https://priyanshuvarma1.github.io/adaptive-ui-kit/ in production,
// so assets need the repo-name prefix. Dev stays at / to keep tools/measure.sh
// pointing at http://localhost:5173/probe.html.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/adaptive-ui-kit/' : '/',
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173 },
}))
