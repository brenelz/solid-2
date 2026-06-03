import { action, createOptimisticStore, createSignal, flush, For, isPending, latest, onSettled, refresh, Show } from "solid-js"
import type { Comment, Issue } from "../data"
import { getComments } from "../api";

type CommentWithErrored = Comment & { id?: string, errored?: boolean, retrying?: boolean };

const erroredComments: CommentWithErrored[] = [];

export function DetailPanel(props: { issue?: Issue, saveCommentAction: (issueId: number, comment: Comment) => Promise<unknown>, updateIssueStatusAction: (issueId: number, status: string) => Promise<unknown>, updateIssueTitleAction: (issueId: number, title: string) => Promise<unknown> }) {
  const [optimisticComments, setOptimisticComments] = createOptimisticStore<CommentWithErrored[]>(async () => {
    const comments = await getComments(props.issue!.id);
    return comments.concat(erroredComments).sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  }, []);

  const addCommentAction = action(function* (comment: string) {
    const newComment = { id: crypto.randomUUID(), author: "Brenley Dueck", createdAt: new Date().toISOString(), body: comment };

    setOptimisticComments(comments => {
      comments.push(newComment);
    });

    try {
      yield props.saveCommentAction(props.issue!.id, newComment);
    } catch (error) {
      erroredComments.push({ ...newComment, errored: true });
    }
    refresh(optimisticComments);
  });

  const retryComment = action(function* (comment: CommentWithErrored) {
    try {
      setOptimisticComments(comments => {
        comments.find(c => c.id === comment.id)!.retrying = true;
      });
      yield props.saveCommentAction(props.issue!.id, comment);
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
    <section class="detail-panel" aria-label="Selected issue details">
      <Show when={props.issue} fallback={"No Issue Found"}>
        {issue => (
          <>
            <IssueHeader issue={issue()} />
            <IssueSummary issue={issue()} updateIssueStatusAction={props.updateIssueStatusAction} updateIssueTitleAction={props.updateIssueTitleAction} />
            <div style={{ opacity: 1 }}>
              <Timeline issue={issue()} comments={optimisticComments} retryComment={retryComment} />
            </div>
            <Show when={issue().id} keyed>
              <CommentComposer addCommentAction={addCommentAction} />
            </Show>
          </>
        )}
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
  const isOpen = () => props.issue.status === "Open";
  const nextStatus = () => isOpen() ? "Closed" : "Open";

  const updateStatus = async () => {
    await props.updateIssueStatusAction(props.issue.id, nextStatus());
  };

  const saveTitle = async (value: string) => {
    const nextTitle = value.trim();
    if (!nextTitle || nextTitle === props.issue.title) return;

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
        <span>{isPending(() => props.issue.title) ? "Saving title..." : null}</span>
        <button class="secondary" type="button" onClick={updateStatus} disabled={isPending(() => props.issue.status)}>
          {isPending(() => props.issue.status) ? "Updating..." : isOpen() ? "Close" : props.issue.status === "Closed" ? "Reopen" : "Open"}
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
  return (
    <article class="comment-card">
      <div class="avatar" aria-hidden="true">{props.comment.author.charAt(0)}</div>
      <div>
        <div class="comment-heading">
          <strong>{props.comment.author}</strong>
          <span>{props.comment.time ?? (props.comment.errored ? <button onClick={() => {
            props.retryComment(props.comment);
          }}>{isPending(() => props.comment.retrying) ? "Retrying..." : "Retry"}</button> : "Saving...")}</span>
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
