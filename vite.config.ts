import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'API_URL'],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    pool: 'forks',
    fileParallelism: false,
    isolate: true,
  },
})
