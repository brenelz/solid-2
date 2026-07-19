import { createFileRoute } from '@tanstack/solid-router'
import { createMemo, Loading } from 'solid-js'
import { hello } from '../api.ts'

export const Route = createFileRoute('/')({
  loader: () => ({ message: hello() }),
  component: Home,
})

function Home() {
  const data = Route.useLoaderData()
  const message = createMemo(() => data().message)

  return (
    <section class="page">
      <p class="eyebrow">Route /</p>
      <h1>Home</h1>
      <p class="lede">A small Solid 2 playground for streamed SSR, server functions, and routing.</p>
      <div class="server-result" aria-live="polite">
        <Loading fallback={<p class="loading"><span class="loading-dot" />Loading...</p>}>
          <p class="result-value">{message()}</p>
        </Loading>
      </div>
    </section>
  )
}
