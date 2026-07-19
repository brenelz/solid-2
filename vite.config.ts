import { defineConfig } from 'vite'
import solid, { serverFunctions } from 'vite-plugin-solid'
import { nitro } from 'nitro/vite'

export default defineConfig({
  plugins: [
    serverFunctions(),
    solid({ ssr: true }),
    nitro(),
  ],
  environments: {
    client: {
      build: {
        rollupOptions: {
          input: './src/entry-client.tsx',
        },
      },
    },
    ssr: {
      build: {
        rollupOptions: {
          input: './src/entry-server.tsx',
        },
      },
    },
  },
})
