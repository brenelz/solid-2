/* @refresh reload */
import { createMemo, Loading } from 'solid-js'
import { hello } from '../api.ts'

export default function Index() {
  const asyncValue = createMemo(() => hello())
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
