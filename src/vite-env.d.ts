// Type declarations for Vite environment

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
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

// NodeJS types for timeout
declare namespace NodeJS {
  type Timeout = number;
}

// Global window extensions
declare global {
  interface Window {
    lenis?: unknown;
  }
}
