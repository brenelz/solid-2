import { DetailPanel } from "./components/DetailPanel"
import { IssueColumn } from "./components/IssueColumn"
import { Sidebar } from "./components/Sidebar"
import { comments, issues, labels } from "./data"
import "./App.css"

export default function App() {
  return (
    <main class="app-shell">
      <Sidebar labels={labels} />
      <IssueColumn issues={issues} />
      <DetailPanel comments={comments} />
    </main>
  )
}
