// src/global.d.ts
import type Lenis from "lenis";

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare global {
  interface Window {
    lenis?: Lenis;
  }
}