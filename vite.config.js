import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // =========================================================
  // VITEST CONFIGURATION (Added for Testing)
  // =========================================================
  test: {
    environment: 'jsdom',
    
    globals: true, 

    setupFiles: './src/test/setup.ts', 
  },
})