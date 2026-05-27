import { commentsByIssueId, issues, type Comment, type NewIssueInput } from "./data"

export const getIssues = async () => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return structuredClone(issues);
}

export const searchIssues = async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const search = query.trim().toLowerCase();
    if (!search) return structuredClone(issues);

    return structuredClone(issues.filter(issue => [
        issue.title,
        issue.area,
        issue.status,
        issue.author,
        issue.assignee,
        issue.milestone,
        issue.priority,
        issue.description,
    ].some(value => value?.toLowerCase().includes(search))));
}

export const getComments = async (issueId: number) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return structuredClone(commentsByIssueId[issueId] ?? []);
}

export const addIssue = async (input: NewIssueInput) => {
    await new Promise(resolve => setTimeout(resolve, 600))
    const nextId = Math.max(...issues.map(issue => issue.id)) + 1;
    const issue = {
        id: nextId,
        title: input.title,
        area: input.area,
        status: "Open",
        author: "Brenley Dueck",
        updated: "Just now",
        comments: 0,
        reactions: 0,
        active: true,
        assignee: "Unassigned",
        milestone: "Backlog",
        priority: "Medium",
        description: input.description,
    };

    issues.unshift(issue);
    commentsByIssueId[issue.id] = [];
    return structuredClone(issue);
}

export const updateIssueStatus = async (issueId: number, status: string) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const issue = issues.find(issue => issue.id === issueId);
    if (!issue) {
        throw new Error("Issue not found");
    }

    issue.status = status;
    issue.updated = "Just now";
    return structuredClone(issue);
}

export const addComment = async (issueId: number, comment: Comment) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    if (Math.random() < 0.5) {
        throw new Error("Failed to add comment");
    }
    commentsByIssueId[issueId].push({ ...comment, time: "Just now" });
    return commentsByIssueId[issueId];
}
