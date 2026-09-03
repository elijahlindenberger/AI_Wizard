import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Prevent Vite from watching Rust build files
  server: {
    port: 5173,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
});