import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    visualizer({
      filename: 'bundle-report.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
      ],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    css: true,
  },
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./src/main.jsx', import.meta.url)),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
})
