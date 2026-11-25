import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/a-hand-is-here/",
  plugins: [react()],
});
