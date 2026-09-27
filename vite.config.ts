import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { localPortfolioSave } from './local-portfolio-save.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localPortfolioSave()],
})
