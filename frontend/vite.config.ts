import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/graphql": {
        target: "http://graphql:4000",
        changeOrigin: true,
        ws: true,
      },
      "/auth": {
        target: "http://keycloak:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
