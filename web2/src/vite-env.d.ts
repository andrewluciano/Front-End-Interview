/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare const __VERSION__: string;

interface ImportMetaEnv {
  readonly VITE_VERSION: string;
  readonly VITE_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};

declare global {
  interface Window {
    config: {
      API_BASE_URL: string;
      API_BASE_URL_NOVO: string;
    };
  }
}
