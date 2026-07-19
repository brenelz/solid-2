/* @refresh reload */
import { RouterProvider } from '@tanstack/solid-router'
import { hydrate as hydrateRouter } from '@tanstack/router-core/ssr/client'
import { hydrate } from '@solidjs/web'
import './index.css'
import { createAppRouter } from './router.tsx'

const router = createAppRouter()

await hydrateRouter(router)

hydrate(() => <RouterProvider router={router} />, document)
