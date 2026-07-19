import { createRouter } from '@tanstack/solid-router'
import { routeTree } from './routeTree.gen.ts'
import type { RouterContext } from './router-context.ts'

export function createAppRouter(context: RouterContext = {}) {
  return createRouter({
    routeTree,
    context,
    defaultPreload: 'intent',
    scrollRestoration: true,
  })
}

declare module '@tanstack/solid-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}
