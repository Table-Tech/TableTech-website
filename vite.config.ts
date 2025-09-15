/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  base: '/', // Voor custom domeinen zoals tabletech.nl BROO
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false,
      threshold: 1024,
      verbose: false, // Disable verbose logging to reduce clutter
      filter: /\.(js|mjs|json|css|html)$/i
    }), // gzip compressie
    imagetools(),      // image optimalisatie
  ],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true, // Don't try other ports if 5173 is busy
    hmr: {
      port: 5173,
      host: '127.0.0.1',
      clientPort: 5173 // Explicitly set client port
    },
    cors: true,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data: https://r2cdn.perplexity.ai; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com https://api.tabletech.nl https://tabletech.nl http://localhost:3002 ws://localhost:* wss://localhost:*; frame-src 'self' https://www.youtube.com https://player.vimeo.com https://challenges.cloudflare.com; base-uri 'self'; form-action 'self'"
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Group vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lottie') || id.includes('framer-motion')) {  
              return 'vendor-animations';
            }
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'vendor-ui';
            }
            if (id.includes('react-router')) {
              return 'vendor-routing';
            }
            if (id.includes('i18next')) {
              return 'vendor-i18n';
            }
            return 'vendor';
          }
          
          // Group animation JSON files
          if (id.includes('animations/') && id.includes('.json')) {
            return 'animations';
          }
          
          // Image assets are now in public/images/ folder
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
