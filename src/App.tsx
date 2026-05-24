import { DetailPanel } from "./components/DetailPanel"
import { IssueColumn } from "./components/IssueColumn"
import { addComment, addIssue, searchIssues } from "./api"
import "./App.css"
import { action, createOptimistic, createSignal, createStore, flush, latest, Loading, refresh, Show } from "solid-js"
import type { Comment, Issue, NewIssueInput } from "./data"

export default function App() {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [issues, setIssues] = createStore(() => searchIssues(searchQuery()), []);
  const [selectedIssue, setSelectedIssue] = createSignal(() => issues[0]);
  const [isAddingIssue, setIsAddingIssue] = createSignal(false);
  const [optimisticCommentCount, setOptimisticCommentCount] = createOptimistic(() => selectedIssue().comments);

  const selectIssue = (issue: Issue) => {
    setIsAddingIssue(false);
    setSelectedIssue(issue);
  }

  const getCommentCount = (issue: Issue) => {
    return selectedIssue().id === issue.id ? optimisticCommentCount() : issue.comments;
  }

  const saveCommentAction = action(function* (issueId: number, comment: Comment) {
    setOptimisticCommentCount(commentCount => commentCount + 1);

    const comments = yield addComment(issueId, comment);

    setIssues(issues => {
      const issue = issues.find(i => i.id === issueId);
      if (issue) {
        issue.comments = comments.length;
      }
    });
  });

  const saveIssueAction = action(function* (input: NewIssueInput) {
    const issue = yield addIssue(input);
    refresh(issues);
    selectIssue(issue);
  });

  return (
    <main class="app-shell">
      <IssueColumn issues={issues} searchQuery={searchQuery()} setSearchQuery={setSearchQuery} selectedIssue={latest(selectedIssue)} selectIssue={selectIssue} getCommentCount={getCommentCount} isAddingIssue={isAddingIssue()} startAddingIssue={() => setIsAddingIssue(true)} />
      <Show when={isAddingIssue()} fallback={
        <DetailPanel issue={selectedIssue()} saveCommentAction={saveCommentAction} />
      }>
        <NewIssuePage saveIssueAction={saveIssueAction} cancel={() => setIsAddingIssue(false)} />
      </Show>
    </main>
  )
}

function NewIssuePage(props: { saveIssueAction: (input: NewIssueInput) => Promise<unknown>, cancel: () => void }) {
  const [title, setTitle] = createSignal("");
  const [area, setArea] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [addingIssue, setAddingIssue] = createOptimistic(false);

  const submitIssue = async () => {
    setAddingIssue(true);
    const input = {
      title: title().trim(),
      area: area().trim() || "triage",
      description: description().trim(),
    };

    if (!input.title || !input.description) return;

    await props.saveIssueAction(input);
  };

  return (
    <section class="detail-panel" aria-label="New issue">
      <header class="detail-header">
        <div>
          <p class="eyebrow">New Issue</p>
          <h2>Capture the next project thread</h2>
        </div>
        <button class="secondary" type="button" onClick={() => props.cancel()}>Cancel</button>
      </header>

      <form style={{ opacity: addingIssue() ? 0.5 : 1 }} class="new-issue-page" onSubmit={e => {
        e.preventDefault();
        submitIssue();
      }}>
        <label for="issue-title">Title</label>
        <input
          id="issue-title"
          placeholder="Summarize the problem"
          value={title()}
          onInput={e => setTitle(e.target.value)}
        />
        <label for="issue-area">Area</label>
        <input
          id="issue-area"
          placeholder="triage"
          value={area()}
          onInput={e => setArea(e.target.value)}
        />
        <label for="issue-description">Description</label>
        <textarea
          id="issue-description"
          rows="8"
          placeholder="Add the initial context..."
          value={description()}
          onInput={e => setDescription(e.target.value)}
        />
        <div class="composer-actions">
          <button type="submit" disabled={!title().trim() || !description().trim()} style={{ opacity: !title().trim() || !description().trim() ? 0.5 : 1 }}>
            {addingIssue() ? 'Adding...' : 'Add issue'}
          </button>
        </div>
      </form>
    </section>
  )
}
