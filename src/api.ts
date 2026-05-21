import { commentsByIssueId, issues, labels } from "./data"

export const getIssues = async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return issues;
}
export const getComments = async (issueId: number) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return structuredClone(commentsByIssueId[issueId] ?? []);
}
export const getLabels = async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return labels;
}

export const addComment = async (issueId: number, comment: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    commentsByIssueId[issueId].push({
        author: "Brenley Dueck",
        time: new Date().toISOString(),
        body: comment,
    });
    return commentsByIssueId[issueId];
}
