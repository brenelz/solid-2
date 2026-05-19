import { For } from "solid-js"
import type { Issue } from "../data"

type IssueColumnProps = {
  issues: Issue[]
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

      <label class="search-field">
        <span>Search issues</span>
        <input value="is:open timeline" aria-label="Search issues" readonly />
      </label>

      <div class="filter-row" aria-label="Issue filters">
        <button class="active" type="button">Open</button>
        <button type="button">Mine</button>
        <button type="button">High signal</button>
      </div>

      <div class="issue-list">
        <For each={props.issues}>{issue => <IssueCard issue={issue} />}</For>
      </div>
    </section>
  )
}

function IssueCard(props: { issue: Issue }) {
  return (
    <article class={props.issue.active ? "issue-card active" : "issue-card"}>
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
    </article>
  )
}
