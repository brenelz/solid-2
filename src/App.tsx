import { DetailPanel } from "./components/DetailPanel"
import { IssueColumn } from "./components/IssueColumn"
import { addComment, addIssue, searchIssues, updateIssueStatus, updateIssueTitle } from "./api"
import "./App.css"
import { action, createMemo, createOptimisticStore, createSignal, isPending, latest, refresh, Show } from "solid-js"
import type { Comment, Issue, NewIssueInput } from "./data"

export default function App() {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [issues, setIssues] = createOptimisticStore(() => searchIssues(searchQuery()), []);
  const [selectedIssueId, setSelectedIssueId] = createSignal(() => issues[0].id);
  const selectedIssue = createMemo(() => issues.find(i => i.id === selectedIssueId()));
  const [isAddingIssue, setIsAddingIssue] = createSignal(false);

  const selectIssue = (issue: Issue) => {
    setSelectedIssueId(issue.id);
  }

  const saveCommentAction = action(function* (issueId: number, comment: Comment) {
    setIssues(issues => {
      const issue = issues.find(i => i.id === issueId);
      if (issue) {
        issue.comments++;
      }
    });
    yield addComment(issueId, comment);
    refresh(issues);

  });

  const saveIssueAction = action(function* (input: NewIssueInput) {
    setIssues(d => {
      d.push(input as any);
    })
    const issue = yield addIssue(input);
    setSelectedIssueId(issue.id);
    setIsAddingIssue(false);
    refresh(issues);
  });

  const updateIssueStatusAction = action(function* (issueId: number, status: string) {
    setIssues(issues => {
      const issue = issues.find(i => i.id === issueId);
      if (issue) {
        issue.status = status;
      }
    });
    yield updateIssueStatus(issueId, status);
    refresh(issues);
  });

  const updateIssueTitleAction = action(function* (issueId: number, title: string) {
    setIssues(issues => {
      const issue = issues.find(i => i.id === issueId);
      if (issue) {
        issue.title = title;
        issue.updated = "Just now";
      }
    });
    yield updateIssueTitle(issueId, title);
    refresh(issues);
  });

  return (
    <main class="app-shell">
      <IssueColumn
        issues={issues}
        searchQuery={searchQuery()}
        setSearchQuery={setSearchQuery}
        selectedIssue={latest(selectedIssue)}
        selectIssue={selectIssue}
        startAddingIssue={() => setIsAddingIssue(true)}
      />
      <Show when={isAddingIssue()} fallback={
        <DetailPanel
          issue={selectedIssue()!}
          saveCommentAction={saveCommentAction}
          updateIssueStatusAction={updateIssueStatusAction}
          updateIssueTitleAction={updateIssueTitleAction} />
      }>
        <NewIssuePage
          addingIssue={isPending(() => issues.length)}
          saveIssueAction={saveIssueAction}
          cancel={() => setIsAddingIssue(false)}
        />
      </Show>
    </main>
  )
}

function NewIssuePage(props: { addingIssue: boolean, saveIssueAction: (input: NewIssueInput) => Promise<unknown>, cancel: () => void }) {
  const [title, setTitle] = createSignal("");
  const [area, setArea] = createSignal("");
  const [description, setDescription] = createSignal("");

  const submitIssue = async () => {
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

      <form style={{ opacity: props.addingIssue ? 0.5 : 1 }} class="new-issue-page" onSubmit={e => {
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
            {props.addingIssue ? 'Adding...' : 'Add issue'}
          </button>
        </div>
      </form>
    </section>
  )
}
