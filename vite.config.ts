import { defineConfig, mergeConfig } from 'vite'
import { defineConfig as defineVitestConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const viteConfig = defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      // Skip files the dev server never needs to hot-reload, so Vite
      // doesn't burn inotify watches on them.
      ignored: [
        '**/dist/**',
        '**/e2e/**',
        '**/playwright.config.ts',
        '**/test-results/**',
        '**/playwright-report/**',
        '**/.git/**',
      ],
    },
  },
})

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: [...configDefaults.exclude, '**/e2e/**', 'e2e/**/*'],
  },
})

export default mergeConfig(viteConfig, vitestConfig)
