import { defineConfig } from "vite";
import { resolve } from "path";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  root: ".",
  plugins: [cloudflare()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});