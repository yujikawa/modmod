import path from "path"
import fs from "fs"
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

const isSingleFile = process.env.VITE_SINGLE_FILE === '1'

function inlinePublicAssets(): Plugin {
  const publicDir = path.resolve(__dirname, 'public')
  const mimeTypes: Record<string, string> = {
    svg: 'image/svg+xml',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    ico: 'image/x-icon',
    webp: 'image/webp',
  }

  function toDataUrl(filePath: string): string | null {
    if (!fs.existsSync(filePath)) return null
    const ext = path.extname(filePath).slice(1)
    const mime = mimeTypes[ext]
    if (!mime) return null
    const content = fs.readFileSync(filePath, ext === 'svg' ? 'utf8' : null)
    return ext === 'svg'
      ? `data:${mime},${encodeURIComponent(content as string)}`
      : `data:${mime};base64,${(content as Buffer).toString('base64')}`
  }

  return {
    name: 'inline-public-assets',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'asset' || !chunk.fileName.endsWith('.html')) continue
        let html = chunk.source as string
        // HTML属性内のパス参照を置換（href="./foo.svg" / href="/foo.svg"）
        html = html.replace(/(?:href|src)="(\.?\/)([^"]+)"/g, (match, _prefix, assetPath) => {
          const dataUrl = toDataUrl(path.join(publicDir, assetPath))
          return dataUrl ? match.replace(/"[^"]*"/, `"${dataUrl}"`) : match
        })
        // インライン化されたJS内の new URL("foo.svg", import.meta.url).href を置換
        html = html.replace(/""\+new URL\("([^"]+)",import\.meta\.url\)\.href/g, (_match, assetPath) => {
          const dataUrl = toDataUrl(path.join(publicDir, assetPath))
          return dataUrl ? JSON.stringify(dataUrl) : _match
        })
        chunk.source = html
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: isSingleFile ? [react(), viteSingleFile(), inlinePublicAssets()] : [react()],
  base: './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
