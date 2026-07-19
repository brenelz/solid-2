import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <section class="page">
      <p class="eyebrow">Route /about</p>
      <h1>About</h1>
      <p class="lede">This app renders the whole document on the server, streams async boundaries, then hydrates into a client-side router.</p>
    </section>
  )
}
