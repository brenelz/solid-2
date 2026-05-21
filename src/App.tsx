import { DetailPanel } from "./components/DetailPanel"
import { IssueColumn } from "./components/IssueColumn"
import { LoadingState } from "./components/LoadingState"
import { getIssues } from "./api"
import "./App.css"
import { createMemo, createSignal, Loading } from "solid-js"
import type { Issue } from "./data"

export default function App() {
  const issues = createMemo(getIssues);
  const [selectedIssue, setSelectedIssue] = createSignal(() => issues()[0]);

  const selectIssue = (issue: Issue) => {
    setSelectedIssue(issue);
  }

  return (
    <main class="app-shell">
      <IssueColumn issues={issues()} selectedIssue={selectedIssue()} selectIssue={selectIssue} />
      <Loading fallback={<LoadingState label="Loading issue" detail="Opening the selected issue." />}>
        <DetailPanel issue={selectedIssue()} />
      </Loading>
    </main>
  )
}
