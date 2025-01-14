import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

<<<<<<< HEAD


=======
>>>>>>> e9a6e1cd4bce80c00391ae8b91258ee731c5e7ba
