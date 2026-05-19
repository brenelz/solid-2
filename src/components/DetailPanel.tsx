import { For } from "solid-js"
import type { Comment } from "../data"

type DetailPanelProps = {
  comments: Comment[]
}

export function DetailPanel(props: DetailPanelProps) {
  return (
    <section class="detail-panel" aria-label="Selected issue details">
      <IssueHeader />
      <IssueSummary />
      <Timeline comments={props.comments} />
      <CommentComposer />
    </section>
  )
}

function IssueHeader() {
  return (
    <header class="detail-header">
      <div>
        <p class="eyebrow">Selected Issue</p>
        <h2>Comment timeline duplicates after reconnect</h2>
      </div>
      <span class="pill">Open</span>
    </header>
  )
}

function IssueSummary() {
  return (
    <div class="summary-card">
      <div class="summary-grid">
        <div>
          <span>Assignee</span>
          <strong>Eli Park</strong>
        </div>
        <div>
          <span>Milestone</span>
          <strong>2.0 beta</strong>
        </div>
        <div>
          <span>Priority</span>
          <strong>High</strong>
        </div>
      </div>
      <p>
        Reconnecting to the event stream can duplicate the latest timeline item. The static layout separates the
        route shell, issue detail, comments, and action composer so async behavior can be layered in later.
      </p>
    </div>
  )
}

function Timeline(props: DetailPanelProps) {
  return (
    <section class="timeline" aria-labelledby="timeline-heading">
      <div class="section-heading">
        <h3 id="timeline-heading">Timeline</h3>
        <span>3 updates</span>
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
