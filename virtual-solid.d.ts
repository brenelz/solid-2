declare module 'virtual:solid-manifest' {
  import type { ViteManifest } from 'vite-plugin-solid'

  const manifest: ViteManifest
  export default manifest
}

declare module 'virtual:solid-server-function-manifest' {}

declare module 'virtual:solid-server-function-handler' {
  export const endpoint: string
  export function handleServerFunctionRequest(
    request: Request,
    options?: Record<string, unknown>,
  ): Promise<Response>
}
