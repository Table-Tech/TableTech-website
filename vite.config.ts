/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
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
    // Bundle analyzer - alleen in analyze mode
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
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
    sourcemap: false, // Disable sourcemaps in production
    reportCompressedSize: false, // Snellere build tijdens development
    minify: 'esbuild', // Gebruik esbuild voor snellere minificatie
    target: 'es2020', // Modern browser target voor kleinere bundles
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Skip voor CSS files
          if (id.includes('.css')) return;

          // Optimaliseerde vendor chunking
          if (id.includes('node_modules')) {
            // React core - altijd apart
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'react-vendor';
            }

            // Animations (groot, vaak niet direct nodig)
            if (id.includes('lottie') || id.includes('framer-motion') || id.includes('gsap')) {
              return 'animations-vendor';
            }

            // Icons (kunnen groot zijn)
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'icons-vendor';
            }

            // i18n
            if (id.includes('i18next')) {
              return 'i18n-vendor';
            }

            // Lenis/scrolling libraries
            if (id.includes('lenis') || id.includes('@studio-freight')) {
              return 'scroll-vendor';
            }

            // Crypto libraries (voor security)
            if (id.includes('crypto-js')) {
              return 'crypto-vendor';
            }

            // Rest van de vendors
            return 'misc-vendor';
          }

          // Application code chunking
          if (id.includes('src/')) {
            // Demo components (lazy loaded)
            if (id.includes('Demo') || id.includes('demo')) {
              return 'demo-components';
            }

            // Modal components
            if (id.includes('Modal') || id.includes('modal')) {
              return 'modal-components';
            }

            // Utils en services
            if (id.includes('utils/') || id.includes('services/')) {
              return 'utilities';
            }
          }
        },
        // Optimalisatie voor asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|ttf|otf|eot/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
      // Tree shaking optimalisaties
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    chunkSizeWarningLimit: 500, // Verlaag warning limit naar 500KB
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
}));
