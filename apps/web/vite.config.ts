import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@pact/shared-types": path.resolve(
        __dirname,
        "../../packages/shared/types"
      ),
      "@pact/shared-api": path.resolve(__dirname, "../../packages/shared/api"),
      "@pact/shared-utils": path.resolve(
        __dirname,
        "../../packages/shared/utils"
      ),
      "@pact/shared-hooks": path.resolve(
        __dirname,
        "../../packages/shared/hooks"
      ),
    },
  },
  build: {
    commonjsOptions: {
      include: [/packages/, /node_modules/],
    },
    rollupOptions: {
      external: [],
    },
  },
  optimizeDeps: {
    include: [
      "@pact/shared-types",
      "@pact/shared-api",
      "@pact/shared-utils",
      "@pact/shared-hooks",
    ],
  },
});
