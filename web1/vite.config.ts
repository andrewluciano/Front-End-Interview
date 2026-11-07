import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { createRequire } from "node:module";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const require = createRequire(import.meta.url);

export default defineConfig(({ command }) => {
  const plugins: import("vite").PluginOption[] = [
    viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({ server: { entry: "server" } }),
    viteReact(),
    tailwindcss(),
  ];

  if (command === "serve") {
    const mkcert = require("vite-plugin-mkcert").default;
    const basicSsl = require("@vitejs/plugin-basic-ssl").default;
    plugins.push(mkcert(), basicSsl());
  }

  return {
    build: {
      minify: true,
    },
    plugins,
    server:
      command === "serve"
        ? {
            host: "localhost",
            port: 5173,
            strictPort: true,
            https: {},
          }
        : undefined,
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    ssr: {
      noExternal: ["react", "react-dom", "sonner"],
    },
    environments: {
      ssr: {
        build: {
          rollupOptions: {
            input: "./src/server.ts",
          },
        },
      },
    },
  };
});
