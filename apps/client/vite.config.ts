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
      // Web App Manifest — brand identity + installable PWA
      manifest: {
        background_color: "#FDF8F5",
        description:
          "Nail art studio cao cấp - Nơi sự sáng tạo gặp gỡ nghệ thuật",
        display: "standalone",
        icons: [
          {
            sizes: "192x192",
            src: "/icons/icon-192.png",
            type: "image/png",
          },
          {
            purpose: "any maskable",
            sizes: "512x512",
            src: "/icons/icon-512.png",
            type: "image/png",
          },
        ],
        name: "Pink Nail Art Studio",
        short_name: "Pink. Nails",
        start_url: "/",
        theme_color: "#D1948B",
      },

      registerType: "autoUpdate",

      // Workbox runtime caching
      workbox: {
        runtimeCaching: [
          {
            handler: "CacheFirst",
            options: {
              cacheableResponse: { statuses: [0, 200] },
              cacheName: "cloudinary-images",
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                maxEntries: 100,
              },
            },
            // Cloudinary images — CacheFirst (immutable URLs, 7-day TTL)
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
          },
          {
            handler: "NetworkFirst",
            options: {
              cacheableResponse: { statuses: [0, 200] },
              cacheName: "api-responses",
              expiration: {
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
                maxEntries: 50,
              },
              networkTimeoutSeconds: 5,
            },
            // API gallery + services — NetworkFirst (data changes, 24h fallback)
            urlPattern: /\/api\/(gallery|services)/,
          },
        ],
      },
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
