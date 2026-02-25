import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  base: "/myadmin/",
  plugins: [react(), tailwindcss(), {
      name: "health-check",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          console.log(req.url)
          next()
        });
      },
    },],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5174,
    allowedHosts: [
      "nanithefuck.local",
      "localhost",
      "127.0.0.1"
    ]
  }
})