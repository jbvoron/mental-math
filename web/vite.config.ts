import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  define: {
    "window.__BUILD_DATE__": JSON.stringify(
      new Date().toISOString().slice(0, 10)
    ),
    "window.__GIT_SHA__": JSON.stringify(
      process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) ?? "local"
    ),
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Calcul Mental ⚡️",
        short_name: "Calcul Mental",
        start_url: "/#home",
        scope: "/",
        display: "standalone",
        display_override: ["standalone", "browser"],
        background_color: "#0b1220",
        theme_color: "#0b1220",
        icons: [
          { src: "/pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })
  ]
});