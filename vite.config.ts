// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/", // ← Voor custom domein, altijd gewoon "/"
  plugins: [react(), tailwindcss()],
});
