import { A, Route, Router, type RouteSectionProps } from '@solidjs/router'
import { lazy } from 'solid-js'
import { hello } from './api.ts'

const About = lazy(() => import('./routes/About.tsx'))
const Index = lazy(() => import('./routes/Index.tsx'))
const NotFound = lazy(() => import('./routes/NotFound.tsx'))

interface AppProps {
  url?: string
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
      <Route path="/" component={Index} preload={() => {
        void hello();
      }} />
      <Route path="/about" component={About} />
      <Route path="*404" component={NotFound} />
    </Router>
  )
}
