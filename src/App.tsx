import { A, Route, Router, type RouteSectionProps } from '@solidjs/router'
import { getRequestEvent } from '@solidjs/web'
import { createMemo, Loading } from 'solid-js'
import { hello } from './api.ts'

interface AppProps {
  url?: string
}

function Index() {
  const asyncValue = createMemo(hello)
  return (
    <section class="page">
      <p class="eyebrow">Route /</p>
      <h1>Home</h1>
      <p class="lede">A small Solid 2 playground for streamed SSR, server functions, and routing.</p>
      <div class="server-result" aria-live="polite">
        <span class="result-label">Server response</span>
        <Loading fallback={<p class="loading"><span class="loading-dot" />Loading...</p>}>
          <p class="result-value">{asyncValue()}</p>
        </Loading>
      </div>
    </section>
  )
}

function About() {
  return (
    <section class="page">
      <p class="eyebrow">Route /about</p>
      <h1>About</h1>
      <p class="lede">This app renders the whole document on the server, streams async boundaries, then hydrates into a client-side router.</p>
    </section>
  )
}

function NotFound() {
  const event = getRequestEvent()
  if (event) event.response.status = 404
  return (
    <section class="page">
      <p class="eyebrow">404</p>
      <h1>Not Found</h1>
      <p class="lede">That route does not exist.</p>
    </section>
  )
}

function Layout(props: RouteSectionProps) {
  return (
    <main class="site-shell">
      <header class="site-header">
        <A class="brand" href="/" end>Solid / SSR</A>
        <nav aria-label="Primary navigation">
          <A href="/" end>Home</A>
          <A href="/about">About</A>
        </nav>
      </header>
      <div class="route-stage">{props.children}</div>
      <footer>
        <span>Solid 2</span>
        <span>Streaming enabled</span>
      </footer>
    </main>
  )
}

export default function App(props: AppProps) {
  return (
    <Router url={props.url} root={Layout}>
      <Route path="/" component={Index} />
      <Route path="/about" component={About} />
      <Route path="*404" component={NotFound} />
    </Router>
  )
}
