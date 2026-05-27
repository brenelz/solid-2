import { For, isPending } from "solid-js"
import type { Issue } from "../data"

type IssueColumnProps = {
  issues: readonly Issue[]
  selectIssue: (issue: Issue) => void
  selectedIssue: Issue
  getCommentCount: (issue: Issue) => number
  isAddingIssue: boolean
  startAddingIssue: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function IssueColumn(props: IssueColumnProps) {
  return (
    <section class="issue-column" aria-label="Issues">
      <header class="toolbar">
        <div>
          <p class="eyebrow">Project</p>
          <h2>solid-core</h2>
        </div>
        <button type="button" onClick={() => props.startAddingIssue()}>New issue</button>
      </header>

      <label class="search-field" for="issue-search">
        <input
          id="issue-search"
          type="search"
          placeholder="Title, area, author, priority..."
          value={props.searchQuery}
          onInput={e => props.setSearchQuery(e.target.value)}
        />
      </label>

      <div class="issue-list" style={{ opacity: isPending(() => props.issues.length) ? 0.5 : 1 }}>
        <For each={props.issues} fallback={<p class="empty-state">No issues match your search.</p>}>
          {issue =>
            <IssueCard
              issue={issue}
              selectedIssue={props.selectedIssue}
              selectIssue={props.selectIssue}
              commentCount={props.getCommentCount(issue)}
              isAddingIssue={props.isAddingIssue} />}
        </For>
      </div>
    </section>
  )
}

function IssueCard(props: { issue: Issue, selectedIssue?: Issue, selectIssue: (issue: Issue) => void, commentCount: number, isAddingIssue: boolean }) {
  return (
    <article
      class={props.selectedIssue?.id === props.issue.id && !props.isAddingIssue ? "issue-card active" : "issue-card"}
      onClick={() => props.selectIssue(props.issue)}
      style={{ cursor: "pointer" }}>
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
