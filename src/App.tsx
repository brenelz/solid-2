import { DetailPanel } from "./components/DetailPanel"
import { IssueColumn } from "./components/IssueColumn"
import { Sidebar } from "./components/Sidebar"
import { getIssues, getLabels } from "./api"
import "./App.css"
import { createMemo, createSignal, Loading } from "solid-js"
import type { Issue } from "./data"

export default function App() {
  const labels = createMemo(getLabels);
  const issues = createMemo(getIssues);
  const [selectedIssue, setSelectedIssue] = createSignal(() => issues()[0]);

  const selectIssue = (issue: Issue) => {
    setSelectedIssue(issue);
  }

  return (
    <main class="app-shell">
      <Sidebar labels={labels()} />
      <IssueColumn issues={issues()} selectedIssue={selectedIssue()} selectIssue={selectIssue} />
      <Loading fallback={<div>Loading Issue...</div>}>
        <DetailPanel issue={selectedIssue()} />
      </Loading>
    </main>
  )
}
