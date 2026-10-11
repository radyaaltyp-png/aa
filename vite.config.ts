import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this repository under /aa; Firebase Hosting serves at /.
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/aa/' : '/',
  plugins: [react()],
})
