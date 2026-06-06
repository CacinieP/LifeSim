import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  // 魔搭 Docker 由 FastAPI 在根路径托管，使用绝对路径 /assets
  base: process.env.MODELSCOPE === "true" ? "/" : process.env.GITHUB_PAGES === "true" ? "/LifeSim/" : "/",
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
