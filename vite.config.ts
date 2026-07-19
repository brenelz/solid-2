import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { nitro } from 'nitro/vite'

export default defineConfig({
  plugins: [solid({
    ssr: true,
    serverFunctions: true
  }), nitro()],
})
