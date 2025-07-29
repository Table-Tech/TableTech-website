import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import viteCompression from 'vite-plugin-compression';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  base: '/', // Voor custom domeinen zoals tabletech.nl BROO
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    viteCompression(), // gzip compressie
    imagetools(),      // image optimalisatie
  ],
  // ...geen test property, deze hoort in vitest.config.ts
});
