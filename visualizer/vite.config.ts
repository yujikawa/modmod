import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

const isSingleFile = process.env.VITE_SINGLE_FILE === '1'

// https://vite.dev/config/
export default defineConfig({
  plugins: isSingleFile ? [react(), viteSingleFile()] : [react()],
  base: './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
