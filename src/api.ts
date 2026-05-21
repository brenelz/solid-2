import { commentsByIssueId, issues, labels } from "./data"

export const getIssues = async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return issues;
}
export const getComments = async (issueId: number) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return commentsByIssueId[issueId] ?? [];
}
export const getLabels = async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return labels;
}
