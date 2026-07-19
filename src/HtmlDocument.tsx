import { HydrationScript, type JSX } from '@solidjs/web'
import { NoHydration } from 'solid-js'

export interface DocumentAssets {
  entry?: string
  js: { href: string }[]
  css: {
    href: string
    'data-vite-dev-id'?: string
  }[]
}

interface HtmlDocumentProps {
  assets?: DocumentAssets
  viteDev?: boolean
  devStylePatch?: string
  children: JSX.Element
}

export default function HtmlDocument(props: HtmlDocumentProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + Solid + TS</title>
        <NoHydration>
          {props.assets?.css.map(asset => (
            <link rel="stylesheet" {...asset} />
          ))}
          {props.assets?.js.map(asset => (
            <link rel="modulepreload" {...asset} />
          ))}
          {props.devStylePatch && <script innerHTML={props.devStylePatch} />}
          <HydrationScript />
          {props.viteDev && <script type="module" src="/@vite/client" />}
        </NoHydration>
      </head>
      <body>
        <div id="root">{props.children}</div>
        <NoHydration>
          {props.assets?.entry && (
            <script type="module" src={props.assets.entry} />
          )}
        </NoHydration>
      </body>
    </html>
  )
}
