/* @refresh reload */
import './index.css'

import { renderToStream, type RequestEvent } from '@solidjs/web'
import { provideRequestEvent } from '@solidjs/web/storage'
import manifest from 'virtual:solid-manifest'
import clientAssets from './entry-client.tsx?assets=client'
import serverAssets from './entry-server.tsx?assets=ssr'
import App from './App.tsx'
import HtmlDocument from './HtmlDocument.tsx'

const assets = clientAssets.merge(serverAssets)
const doctype = new TextEncoder().encode('<!doctype html>')
const devStylePatch = import.meta.env.DEV
  ? (await import('vite-plugin-solid')).devStylePatch
  : undefined

export default {
  fetch(request: Request) {
    const response: RequestEvent['response'] = {
      headers: new Headers({
        'content-type': 'text/html; charset=utf-8',
      }),
    }

    return provideRequestEvent({ request, locals: {}, response }, () => {
      const output = renderToStream(() => (
        <HtmlDocument
          assets={assets}
          viteDev={import.meta.env.DEV}
          devStylePatch={devStylePatch}
        >
          <App url={request.url} />
        </HtmlDocument>
      ), {
        manifest,
        onError(error) {
          console.error(error)
        },
      })
      const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>({
        start(controller) {
          controller.enqueue(doctype)
        },
      })

      void output.pipeTo(writable).catch(error => {
        console.error('SSR stream failed', error)
      })

      return new Response(readable, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      })
    })
  },
}
