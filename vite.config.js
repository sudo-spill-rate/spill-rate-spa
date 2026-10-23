import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const appUrl = mode === 'production' ? env.VITE_PROD_APP_URL : env.VITE_DEV_APP_URL
  process.env.VITE_APP_URL = appUrl

  return {
    plugins: [react()],
    build: {
      sourcemap: false,
    },
  }
})
