import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  // 魔搭 static 托管在子路径下，必须用相对路径，否则 /assets 会 404 白屏
  base: process.env.MODELSCOPE === "true" ? "./" : process.env.GITHUB_PAGES === "true" ? "/LifeSim/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
})
