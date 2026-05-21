import { For, isPending, Loading } from "solid-js"
import type { Issue } from "../data"
import { LoadingState } from "./LoadingState"

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
      </header>

      <div class="issue-list">
        <For each={props.issues}>{issue => <IssueCard issue={issue} selectedIssue={props.selectedIssue} selectIssue={props.selectIssue} />}</For>
      </div>
    </section>
  )
}

function IssueListLoading() {
  return (
    <>
      <LoadingState label="Loading issues" detail="Fetching latest project activity." />
      <div class="issue-card loading-card" aria-hidden="true" />
      <div class="issue-card loading-card" aria-hidden="true" />
      <div class="issue-card loading-card" aria-hidden="true" />
    </>
  )
}

function IssueCard(props: { issue: Issue, selectedIssue: Issue, selectIssue: (issue: Issue) => void }) {
  return (
    <article
      class={props.selectedIssue.id === props.issue.id ? "issue-card active" : "issue-card"}
      onClick={() => props.selectIssue(props.issue)}
      style={{ cursor: "pointer", opacity: props.selectedIssue.id === props.issue.id && isPending(() => props.selectedIssue) ? 0.5 : 1 }}>
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
