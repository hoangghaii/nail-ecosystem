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

      // Web App Manifest — brand identity + installable PWA
      manifest: {
        name: "Pink Nail Art Studio",
        short_name: "Pink. Nails",
        description:
          "Nail art studio cao cấp - Nơi sự sáng tạo gặp gỡ nghệ thuật",
        theme_color: "#D1948B",
        background_color: "#FDF8F5",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      // Workbox runtime caching
      workbox: {
        runtimeCaching: [
          {
            // Cloudinary images — CacheFirst (immutable URLs, 7-day TTL)
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "cloudinary-images",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // API gallery + services — NetworkFirst (data changes, 24h fallback)
            urlPattern: /\/api\/(gallery|services)/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-responses",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: { statuses: [0, 200] },
            },
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
