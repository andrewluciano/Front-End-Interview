import { defineConfig } from "vitest/config";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [viteReact(), viteTsConfigPaths({ projects: ["./tsconfig.json"] })],
  resolve: {
    alias: {
      // Stub binary assets so imports don't break in jsdom
      "@/assets/leaf-logo.png": resolve(
        import.meta.dirname,
        "src/test/file-mock.ts",
      ),
    },
    dedupe: ["react", "react-dom"],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/lib/**", "src/hooks/**", "src/components/**"],
      exclude: [
        "src/test/**",
        "src/routeTree.gen.ts",
        "src/components/ui/**",
      ],
    },
  },
});
