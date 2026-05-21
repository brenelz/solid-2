import { createSignal, For } from "solid-js"
import { commentsByIssueId, type Comment, type Issue } from "../data"

export function DetailPanel(props: { issue: Issue }) {
  return (
    <section class="detail-panel" aria-label="Selected issue details">
      <IssueHeader issue={props.issue} />
      <IssueSummary issue={props.issue} />
      <div style={{ opacity: 1 }}>
        <Timeline issue={props.issue} comments={commentsByIssueId[props.issue.id] ?? []} />
      </div>
      <CommentComposer />
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

function Timeline(props: { issue: Issue, comments: readonly Comment[] }) {
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
  const [comment, setComment] = createSignal("");
  const submitComment = () => {
    console.log('submitting');
  };

  return (
    <form class="composer" onSubmit={e => {
      e.preventDefault();
      submitComment();
    }}>
      <label for="comment">Add a comment</label>
      <textarea
        id="comment"
        rows="4"
        placeholder="Leave a project update..."
        value={comment()}
        onInput={e => setComment(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitComment();
          }
        }}
      />
      <div class="composer-actions">
        <button type="submit">Comment</button>
      </div>
    </form>
  )
}
