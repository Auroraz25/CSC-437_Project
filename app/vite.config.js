import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    host: true,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false
      },
      "/auth": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 3000,
    host: true
  },
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});