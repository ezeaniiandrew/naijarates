import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".",
  plugins: [],
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
