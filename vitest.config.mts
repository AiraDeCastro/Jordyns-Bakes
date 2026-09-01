import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.mts"],
    globals: true,
    exclude: ["node_modules", ".next", "e2e"],
    // Default 5s is tight once many jsdom environments run in parallel
    // across a growing test suite — a test with several sequential
    // userEvent interactions can legitimately take longer under load.
    testTimeout: 15000,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
