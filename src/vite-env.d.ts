/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

// Type declarations for Vite environment

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
  readonly VITE_ENCRYPTION_KEY: string;
  readonly VITE_SESSION_SECRET: string;
  readonly PROD: boolean;
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.ico" {
  const src: string;
  export default src;
}

declare module "lenis";
declare module "gsap";
declare module "gsap/ScrollTrigger";
declare module "react-i18next";
declare module "framer-motion";
declare module "lucide-react";

// Browser timeout types
type Timeout = number;

// Global window extensions
declare global {
  interface Window {
    lenis?: unknown;
  }
}
