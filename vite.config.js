import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import path from 'path';

// ESM-safe __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      // Proxy uploads to backend so images load without CORS during development
      '/uploads': {
        target: 'https://m19logisticsbackend.mtscorporate.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/uploads/, '/uploads'),
      },
      // Also proxy API calls if needed (optional)
      '/api': {
        target: 'https://m19logisticsbackend.mtscorporate.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
