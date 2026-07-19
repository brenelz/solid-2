/* @refresh reload */
import './index.css'

import {
  RouterServer,
  createRequestHandler,
  renderRouterToStream,
} from '@tanstack/solid-router/ssr/server'
import { provideRequestEvent } from '@solidjs/web/storage'
import manifest from 'virtual:solid-manifest'
import clientAssets from './entry-client.tsx?assets=client'
import serverAssets from './entry-server.tsx?assets=ssr'
import { createAppRouter } from './router.tsx'

const assets = clientAssets.merge(serverAssets)
const devStylePatch = import.meta.env.DEV
  ? (await import('vite-plugin-solid')).devStylePatch
  : undefined

export default {
  fetch(request: Request) {
    return provideRequestEvent({ request, locals: {} }, () => {
      const handler = createRequestHandler({
        request,
        createRouter: () => createAppRouter({
          assets,
          viteDev: import.meta.env.DEV,
          devStylePatch,
        }),
      })

      return handler(({ request, responseHeaders, router }) => {
        responseHeaders.set('content-type', 'text/html; charset=utf-8')
        return renderRouterToStream({
          request,
          responseHeaders,
          router,
          manifest,
          children: () => <RouterServer router={router} />,
        })
      })
    })
  },
}
