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
});
