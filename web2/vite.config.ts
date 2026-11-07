import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import tsconfigPaths from "vite-tsconfig-paths";

import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import mkcert from "vite-plugin-mkcert";
import path from "path";
import type { Plugin } from "vite";
import * as fs from "fs";

interface SourcemapExclude {
  excludeNodeModules?: boolean;
}

const packageJsonPath = path.resolve(process.cwd(), "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
const appVersion = packageJson.version;
console.log(`[Vite Config] Versão do Sistema Carregada: v${appVersion}`);

export function sourcemapExclude(opts?: SourcemapExclude): Plugin {
  return {
    name: "sourcemap-exclude",
    transform(code: string, id: string) {
      if (opts?.excludeNodeModules && id.includes("node_modules")) {
        return {
          code,
          map: { mappings: "" },
        };
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";
  return {
    base: "./",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`,
        },
      },
      modulePreload: false,
      target: "esnext",
      minify: true,
      cssCodeSplit: false,
      outDir: "build",
      sourcemap: isDevelopment ? true : "hidden",
      chunkSizeWarningLimit: 1600,
    },
    server: {
      host: "localhost",
      port: 5173,
      strictPort: true,
    },
    preview: {
      host: "localhost",
      port: 4173,
      strictPort: false,
    },
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        manifest: false, // Usamos o manifest.json em public/
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          cleanupOutdatedCaches: true,
        },
      }),
      svgr(),
      mkcert(),
      react({
        babel: {
          plugins: [
            "babel-plugin-macros",
            [
              "babel-plugin-styled-components",
              {
                displayName: true,
                fileName: false,
              },
            ],
          ],
        },
      }),
      tsconfigPaths(),
      sourcemapExclude({ excludeNodeModules: true }),
    ],
  };
});
