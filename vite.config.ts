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
          // Group vendor libraries into smaller chunks
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            // Animation libraries - split these further
            if (id.includes('lottie')) {
              return 'vendor-lottie';
            }
            if (id.includes('framer-motion')) {  
              return 'vendor-framer';
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap';
            }
            // UI libraries
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'vendor-ui';
            }
            // Routing
            if (id.includes('react-router')) {
              return 'vendor-routing';
            }
            // Internationalization
            if (id.includes('i18next')) {
              return 'vendor-i18n';
            }
            // 3D libraries
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-3d';
            }
            // Email and particles
            if (id.includes('@emailjs') || id.includes('tsparticles')) {
              return 'vendor-utils';
            }
            // Other vendor libraries
            return 'vendor-misc';
          }
          
          // Split animation JSON files by type/folder to avoid large chunks
          if (id.includes('.json')) {
            if (id.includes('animations/') || id.includes('lottie')) {
              // Create hash-based chunks for animations to split them
              const hash = id.split('/').pop()?.split('.')[0] || 'default';
              const hashCode = hash.split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
              }, 0);
              return `animations-${Math.abs(hashCode) % 10}`;
            }
          }
          
          // Group large image assets
          if (id.includes('assets/afbeeldingen/') && (id.includes('.png') || id.includes('.jpg') || id.includes('.webp'))) {
            return 'images';
          }
        }
      }
    },
    chunkSizeWarningLimit: 2000, // Increase warning limit to 2MB for large animation files
  },
  // ...geen test property, deze hoort in vitest.config.ts
});
