import { commentsByIssueId, issues, type Comment } from "./data"

export const getIssues = async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return structuredClone(issues);
}
export const getComments = async (issueId: number) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return structuredClone(commentsByIssueId[issueId] ?? []);
}

export const addComment = async (issueId: number, comment: Comment) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    if (Math.random() < 0.5) {
        throw new Error("Failed to add comment");
    }
    commentsByIssueId[issueId].push({ ...comment, time: "Just now" });
    return commentsByIssueId[issueId];
}
