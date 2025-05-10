import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import jsconfigPaths from "vite-jsconfig-paths";

export default defineConfig({
  // root: ".",
  // publicDir: "public",
  plugins: [react(), jsconfigPaths()],
  server: {
    port: 3000,
    host: "localhost",
    open: true,
    // historyApiFallback: true,
    // proxy: {
    //   "/graphql": {
    //     target: "http://graphql:4000",
    //     changeOrigin: true,
    //     ws: true,
    //   },
    //   "/auth": {
    //     target: "http://keycloak:8080",
    //     changeOrigin: true,
    //   },
    // },
  },
  preview: {
    port: 3000,
  },
  // css: {
  //   preprocessorOptions:{
  //     scss:{
  //       additionalData: `@import "src/Components`
  //     }
  //   }
  // }
  build: {
    outDir: "dist",
    // sourcemap: false,
  },
});
