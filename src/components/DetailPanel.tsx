import { createMemo, For, isPending, Loading } from "solid-js"
import type { Comment, Issue } from "../data"
import { getComments } from "../api";

export function DetailPanel(props: { issue: Issue }) {
  const comments = createMemo(() => getComments(props.issue.id));;

  return (
    <section class="detail-panel" aria-label="Selected issue details" style={{ opacity: isPending(() => props.issue) ? 0.5 : 1 }}>
      <IssueHeader issue={props.issue} />
      <IssueSummary issue={props.issue} />
      <Loading fallback={<div>Loading Comments...</div>}>
        <Timeline issue={props.issue} comments={comments()} />
        <CommentComposer />
      </Loading>
    </section>
  )
}

function IssueHeader(props: { issue: Issue }) {
  return (
    <header class="detail-header">
      <div>
        <p class="eyebrow">Selected Issue</p>
        <h2>{props.issue.title}</h2>
      </div>
      <span class="pill">{props.issue.status}</span>
    </header>
  )
}

function IssueSummary(props: { issue: Issue }) {
  return (
    <div class="summary-card">
      <div class="summary-grid">
        <div>
          <span>Assignee</span>
          <strong>{props.issue.assignee}</strong>
        </div>
        <div>
          <span>Milestone</span>
          <strong>{props.issue.milestone}</strong>
        </div>
        <div>
          <span>Priority</span>
          <strong>{props.issue.priority}</strong>
        </div>
      </div>
      <p>
        {props.issue.description}
      </p>
    </div>
  )
}

function Timeline(props: { issue: Issue, comments: Comment[] }) {
  return (
    <section class="timeline" aria-labelledby="timeline-heading">
      <div class="section-heading">
        <h3 id="timeline-heading">Timeline</h3>
        <span>{props.comments.length} updates</span>
      </div>
      <For each={props.comments}>{comment => <CommentCard comment={comment} />}</For>
    </section>
  )
}

function CommentCard(props: { comment: Comment }) {
  return (
    <article class="comment-card">
      <div class="avatar" aria-hidden="true">{props.comment.author.charAt(0)}</div>
      <div>
        <div class="comment-heading">
          <strong>{props.comment.author}</strong>
          <span>{props.comment.time}</span>
        </div>
        <p>{props.comment.body}</p>
      </div>
    </article>
  )
}

function CommentComposer() {
  return (
    <form class="composer">
      <label for="comment">Add a comment</label>
      <textarea id="comment" rows="4" placeholder="Leave a project update..." />
      <div class="composer-actions">
        <button class="secondary" type="button">Add reaction</button>
        <button type="button">Comment</button>
      </div>
    </form>
  )
}
