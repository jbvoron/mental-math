import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "window.__BUILD_DATE__": JSON.stringify(
      new Date().toISOString().slice(0, 10)
    ),
    "window.__GIT_SHA__": JSON.stringify(
      process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) ?? "local"
    ),
  },
});