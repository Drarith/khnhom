/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: [],
    testTimeout: 30000,
    hookTimeout: 60000, // Increase timeout for beforeAll/afterAll hooks (MongoDB Memory Server initialization)
  },
  esbuild: {
    target: "node18",
  },
});
