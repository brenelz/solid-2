import { DetailPanel } from "./components/DetailPanel"
import { IssueColumn } from "./components/IssueColumn"
import { LoadingState } from "./components/LoadingState"
import { addComment, getIssues } from "./api"
import "./App.css"
import { action, createOptimistic, createSignal, createStore, latest, Loading } from "solid-js"
import type { Comment, Issue } from "./data"

export default function App() {
  const [issues, setIssues] = createStore(getIssues, []);
  const [selectedIssue, setSelectedIssue] = createSignal(() => issues[0]);
  const [optimisticCommentCount, setOptimisticCommentCount] = createOptimistic(() => selectedIssue().comments);

  const selectIssue = (issue: Issue) => {
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

  return (
    <main class="app-shell">
      <IssueColumn issues={issues} selectedIssue={latest(selectedIssue)} selectIssue={selectIssue} getCommentCount={getCommentCount} />
      <Loading fallback={<LoadingState label="Loading issue" detail="Opening the selected issue." />}>
        <DetailPanel issue={selectedIssue()} saveCommentAction={saveCommentAction} />
      </Loading>
    </main>
  )
}
