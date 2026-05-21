import { For, isPending, Loading } from "solid-js"
import type { Issue } from "../data"

type IssueColumnProps = {
  issues: Issue[]
  selectIssue: (issue: Issue) => void
  selectedIssue: Issue
}

export function IssueColumn(props: IssueColumnProps) {
  return (
    <section class="issue-column" aria-label="Issues">
      <header class="toolbar">
        <div>
          <p class="eyebrow">Project</p>
          <h2>solid-core</h2>
        </div>
        <button type="button">New Issue</button>
      </header>

      <div class="filter-row" aria-label="Issue filters">
        <button class="active" type="button">Open</button>
        <button type="button">Mine</button>
        <button type="button">High signal</button>
      </div>

      <div class="issue-list">
        <Loading fallback={<div>Loading Issues...</div>}>
          <For each={props.issues}>{issue => <IssueCard issue={issue} selectedIssue={props.selectedIssue} selectIssue={props.selectIssue} />}</For>
        </Loading>
      </div>
    </section>
  )
}

function IssueCard(props: { issue: Issue, selectedIssue: Issue, selectIssue: (issue: Issue) => void }) {
  return (
    <article
      class={props.selectedIssue.id === props.issue.id ? "issue-card active" : "issue-card"}
      onClick={() => props.selectIssue(props.issue)}
      style={{ cursor: "pointer", opacity: props.selectedIssue.id === props.issue.id && isPending(() => props.selectedIssue) ? 0.7 : 1 }}>
      <div class="issue-card-header">
        <span class="status-dot" aria-hidden="true" />
        <span class="issue-number">#{props.issue.id}</span>
        <span class="issue-status">{props.issue.status}</span>
      </div>
      <h3>{props.issue.title}</h3>
      <div class="issue-meta">
        <span>{props.issue.area}</span>
        <span>{props.issue.author}</span>
        <span>{props.issue.updated}</span>
      </div>
      <div class="issue-stats" aria-label="Issue activity">
        <span>{props.issue.comments} comments</span>
        <span>{props.issue.reactions} reactions</span>
      </div>
    </article >
  )
}
