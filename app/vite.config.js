import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages project sites, set base to '/<repo-name>/'.
// Override at build time with:  VITE_BASE=/your-repo/ npm run build
// HashRouter is used so deep links work on GitHub Pages without server config.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/ugc-net-psycology/',
})
