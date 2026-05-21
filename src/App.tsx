import { DetailPanel } from "./components/DetailPanel"
import { IssueColumn } from "./components/IssueColumn"
import { issues } from "./data"

import "./App.css"

export default function App() {
  return (
    <main class="app-shell">
      <IssueColumn issues={issues} />
      <DetailPanel issue={issues[0]} />
    </main>
  )
}
