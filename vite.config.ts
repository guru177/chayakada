import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ytSearchPlugin } from "./scripts/yt-search.mjs";

export default defineConfig({
  plugins: [react(), ytSearchPlugin()],
  server: {
    port: 5173,
    host: true,
  },
});
