import { action, createOptimistic, createOptimisticStore, createSignal, flush, For, isPending, onSettled, refresh, Show } from "solid-js"
import type { Comment, Issue } from "../data"
import { getComments } from "../api";

type CommentWithErrored = Comment & { id?: string, errored?: boolean };

const erroredComments: CommentWithErrored[] = [];

export function DetailPanel(props: { issue: Issue, saveCommentAction: (issueId: number, comment: Comment) => Promise<unknown>, updateIssueStatusAction: (issueId: number, status: string) => Promise<unknown>, updateIssueTitleAction: (issueId: number, title: string) => Promise<unknown> }) {
  const [optimisticComments, setOptimisticComments] = createOptimisticStore<CommentWithErrored[]>(async () => {
    const comments = await getComments(props.issue.id);
    return comments.concat(erroredComments).sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  }, []);

  const addCommentAction = action(function* (comment: string) {
    const newComment = { id: crypto.randomUUID(), author: "Brenley Dueck", createdAt: new Date().toISOString(), body: comment };

    setOptimisticComments(comments => {
      comments.push(newComment);
    });

    try {
      yield props.saveCommentAction(props.issue.id, newComment);
    } catch (error) {
      erroredComments.push({ ...newComment, errored: true });
    }
    refresh(optimisticComments);
  });

  const retryComment = action(function* (comment: CommentWithErrored) {
    try {
      yield props.saveCommentAction(props.issue.id, comment);
      const index = erroredComments.findIndex(c => c.id === comment.id);
      if (index !== -1) {
        erroredComments.splice(index, 1);
      }
    } catch (error) {
      // keep the comment in the erroredComments array
    }
    refresh(optimisticComments);
  });

  return (
    <section class="detail-panel" aria-label="Selected issue details" style={{ opacity: isPending(() => props.issue) ? 0.5 : 1 }}>
      <IssueHeader issue={props.issue} />
      <IssueSummary issue={props.issue} updateIssueStatusAction={props.updateIssueStatusAction} updateIssueTitleAction={props.updateIssueTitleAction} />
      <div style={{ opacity: 1 }}>
        <Timeline issue={props.issue} comments={optimisticComments} retryComment={retryComment} />
      </div>
      <Show when={props.issue.id} keyed>
        <CommentComposer addCommentAction={addCommentAction} />
      </Show>
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

function IssueSummary(props: { issue: Issue, updateIssueStatusAction: (issueId: number, status: string) => Promise<unknown>, updateIssueTitleAction: (issueId: number, title: string) => Promise<unknown> }) {
  const [updatingStatus, setUpdatingStatus] = createOptimistic(false);
  const [updatingTitle, setUpdatingTitle] = createOptimistic(false);
  const isOpen = () => props.issue.status === "Open";
  const nextStatus = () => isOpen() ? "Closed" : "Open";

  const updateStatus = async () => {
    setUpdatingStatus(true);
    await props.updateIssueStatusAction(props.issue.id, nextStatus());
  };

  const saveTitle = async (value: string) => {
    const nextTitle = value.trim();
    if (!nextTitle || nextTitle === props.issue.title) return;

    setUpdatingTitle(true);
    await props.updateIssueTitleAction(props.issue.id, nextTitle);
  };

  return (
    <div class="summary-card">
      <label class="inline-edit" for="issue-title-edit">
        <span>Title</span>
        <input
          id="issue-title-edit"
          value={props.issue.title}
          onInput={e => saveTitle(e.currentTarget.value)}

        />
      </label>
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
      <div class="issue-body-actions">
        <span>{updatingTitle() ? "Saving title..." : null}</span>
        <button class="secondary" type="button" onClick={updateStatus} disabled={updatingStatus()}>
          {updatingStatus() ? "Updating..." : isOpen() ? "Close" : props.issue.status === "Closed" ? "Reopen" : "Open"}
        </button>
      </div>
    </div>
  )
}

function Timeline(props: { issue: Issue, comments: readonly CommentWithErrored[], retryComment: (comment: CommentWithErrored) => void }) {
  return (
    <section class="timeline" aria-labelledby="timeline-heading">
      <div class="section-heading">
        <h3 id="timeline-heading">Timeline</h3>
        <span>{props.comments.length} updates</span>
      </div>
      <For each={props.comments}>{comment => <CommentCard comment={comment} retryComment={props.retryComment} />}</For>
    </section>
  )
}

function CommentCard(props: { comment: CommentWithErrored, retryComment: (comment: CommentWithErrored) => void }) {
  const [retrying, setRetrying] = createOptimistic(false);
  return (
    <article class="comment-card">
      <div class="avatar" aria-hidden="true">{props.comment.author.charAt(0)}</div>
      <div>
        <div class="comment-heading">
          <strong>{props.comment.author}</strong>
          <span>{props.comment.time ?? (props.comment.errored ? <button onClick={() => {
            setRetrying(true);
            props.retryComment(props.comment);
          }}>{retrying() ? "Retrying..." : "Retry"}</button> : "Saving...")}</span>
        </div>
        <p>{props.comment.body}</p>
      </div>
    </article>
  )
}

function CommentComposer(props: { addCommentAction: (comment: string) => void }) {
  let textareaRef: HTMLTextAreaElement | undefined;

  const [comment, setComment] = createSignal("");
  const submitComment = () => {
    const body = comment().trim();
    if (!body) return;
    props.addCommentAction(body);
    flush();
    setComment("");
  };

  onSettled(() => {
    textareaRef?.focus();
  });

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
        <button type="submit" disabled={!comment().trim()} style={{ opacity: !comment().trim() ? 0.5 : 1 }}>Comment</button>
      </div>
    </form>
  )
}
