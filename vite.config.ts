import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/popup.html'),
        background: resolve(__dirname, 'src/background/background.ts'),
        content: resolve(__dirname, 'src/content/content.ts')
      },
      output: {
        // Place the popup bundle inside `src/popup/` in the dist output so
        // the generated `popup.js` lives next to `popup.html` (dist/src/popup/popup.html)
        entryFileNames: (chunkInfo) => {
          const name = chunkInfo.name
          if (name === 'popup') return 'src/popup/popup.js'
          // keep other entries at root
          return '[name].js'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})
