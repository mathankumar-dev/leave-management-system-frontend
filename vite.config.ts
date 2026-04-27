import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8112',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path  // keep /api prefix — Spring Boot expects it
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://106.51.0.210:8111',
        changeOrigin: true,
        secure: false
      }
    }
  },
});