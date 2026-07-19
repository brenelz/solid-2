/* @refresh reload */
import { hydrate } from '@solidjs/web'
import './index.css'
import App from './App.tsx'
import HtmlDocument from './HtmlDocument.tsx'

hydrate(() => (
  <HtmlDocument>
    <App />
  </HtmlDocument>
), document)
