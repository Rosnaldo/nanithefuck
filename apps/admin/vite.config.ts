import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  console.log("Backend:", env.VITE_BACKEND_URL)

  return {
    plugins: [react(), tailwindcss()],
    cacheDir: 'node_modules/.vite_cache',
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true,
      port: 5173,
      allowedHosts: [
        "nanithefuck.local",
        "localhost",
        "127.0.0.1"
      ]
    }
  }
})