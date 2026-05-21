import { For, isPending } from "solid-js"
import type { Issue } from "../data"

type IssueColumnProps = {
  issues: readonly Issue[]
  selectIssue: (issue: Issue) => void
  selectedIssue: Issue
  getCommentCount: (issue: Issue) => number
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
        <For each={props.issues}>{issue => <IssueCard issue={issue} selectedIssue={props.selectedIssue} selectIssue={props.selectIssue} commentCount={props.getCommentCount(issue)} />}</For>
      </div>
    </section>
  )
}

function IssueCard(props: { issue: Issue, selectedIssue: Issue, selectIssue: (issue: Issue) => void, commentCount: number }) {
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
        <span>{props.commentCount} comments</span>
        <span>{props.issue.reactions} reactions</span>
      </div>
    </article >
  )
}
