/* @refresh reload */
import { HeadContent, Link, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/solid-router'
import { HydrationScript, type JSX } from '@solidjs/web'
import { NoHydration } from 'solid-js'
import type { RouterContext } from '../router-context.ts'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Layout,
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootDocument(props: { children: JSX.Element }) {
  const context = Route.useRouteContext()

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Solid SSR Lab</title>
        <NoHydration>
          {context().assets?.css.map(asset => (
            <link rel="stylesheet" {...asset} />
          ))}
          {context().assets?.js.map(asset => (
            <link rel="modulepreload" {...asset} />
          ))}
          {context().devStylePatch && <script innerHTML={context().devStylePatch} />}
          <HydrationScript />
          {context().viteDev && <script type="module" src="/@vite/client" />}
          <HeadContent />
        </NoHydration>
      </head>
      <body>
        <div id="root">{props.children}</div>
        <Scripts />
        <NoHydration>
          {context().assets?.entry && (
            <script type="module" src={context().assets?.entry} />
          )}
        </NoHydration>
      </body>
    </html>
  )
}

function Layout() {
  return (
    <main class="site-shell">
      <header class="site-header">
        <Link class="brand" to="/">Solid / SSR</Link>
        <nav aria-label="Primary navigation">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ class: 'active' }}>Home</Link>
          <Link to="/about" activeProps={{ class: 'active' }}>About</Link>
        </nav>
      </header>
      <div class="route-stage"><Outlet /></div>
      <footer>
        <span>Solid 2</span>
        <span>Streaming enabled</span>
      </footer>
    </main>
  )
}

function NotFound() {
  return (
    <section class="page">
      <p class="eyebrow">404</p>
      <h1>Not Found</h1>
      <p class="lede">That route does not exist.</p>
    </section>
  )
}
