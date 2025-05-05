import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/", // Voor custom domeinen altijd root gebruiken
  plugins: [react(), tailwindcss()],
});
