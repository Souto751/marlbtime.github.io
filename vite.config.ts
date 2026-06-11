import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function getBasePath(): string {
  if (process.env.VITE_BASE_PATH) {
    const base = process.env.VITE_BASE_PATH
    return base.endsWith('/') ? base : `${base}/`
  }

  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
  if (repo) {
    return `/${repo}/`
  }

  return '/'
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : getBasePath(),
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
}))
