/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  base: '/', // Voor custom domeinen zoals tabletech.nl BROO
  plugins: [
    react(),
    viteCompression(), // gzip compressie
    imagetools(),      // image optimalisatie
  ],
  build: {
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
          
          // Group large image assets
          if (id.includes('assets/afbeeldingen/') && (id.includes('.png') || id.includes('.jpg') || id.includes('.webp'))) {
            return 'images';
          }
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
