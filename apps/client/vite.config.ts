import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  // Build configuration
  build: {
    assetsDir: "assets",
    minify: "esbuild", // Minification
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          "react-vendor": ["react", "react-dom"],
          "router-vendor": ["react-router-dom"],
        },
      },
    },
    sourcemap: false, // Don't generate sourcemaps in production
  },

  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      registerType: "autoUpdate",
    }),
  ],

  // Preview server (for testing production build)
  preview: {
    host: "0.0.0.0",
    port: 4173,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Development server
  server: {
    host: "0.0.0.0", // Listen on all interfaces (for Docker)
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // For Docker hot reload
    },
  },
});
