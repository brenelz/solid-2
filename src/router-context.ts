export interface RouterAssets {
  entry?: string
  js: { href: string }[]
  css: {
    href: string
    'data-vite-dev-id'?: string
  }[]
}

export interface RouterContext {
  assets?: RouterAssets
  viteDev?: boolean
  devStylePatch?: string
}
