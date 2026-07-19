import { defineConfig } from 'vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import solid, { serverFunctions } from 'vite-plugin-solid'
import { nitro } from 'nitro/vite'

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'solid',
      autoCodeSplitting: true,
      indexToken: 'home',
    }),
    serverFunctions(),
    solid({ ssr: true }),
    nitro(),
  ],
  environments: {
    nitro: {
      resolve: {
        noExternal: ['@tanstack/solid-router'],
      },
    },
    client: {
      build: {
        manifest: true,
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
