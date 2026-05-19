export type Issue = {
  id: number
  title: string
  area: string
  status: string
  author: string
  updated: string
  comments: number
  reactions: number
  active: boolean
}

export type Comment = {
  author: string
  time: string
  body: string
}

export const issues: Issue[] = [
  {
    id: 42,
    title: "Comment timeline duplicates after reconnect",
    area: "sync",
    status: "Open",
    author: "Maya Chen",
    updated: "8 min ago",
    comments: 14,
    reactions: 27,
    active: true,
  },
  {
    id: 39,
    title: "Label filter should preserve selected issue",
    area: "routing",
    status: "Open",
    author: "Jon Bell",
    updated: "32 min ago",
    comments: 6,
    reactions: 9,
    active: false,
  },
  {
    id: 37,
    title: "New assignee menu needs keyboard focus states",
    area: "accessibility",
    status: "Review",
    author: "Priya Shah",
    updated: "1 hr ago",
    comments: 3,
    reactions: 12,
    active: false,
  },
  {
    id: 31,
    title: "Milestone progress card overflows on mobile",
    area: "design",
    status: "Open",
    author: "Alex Kim",
    updated: "Yesterday",
    comments: 8,
    reactions: 5,
    active: false,
  },
]

export const comments: Comment[] = [
  {
    author: "Maya Chen",
    time: "8 min ago",
    body: "The reconnect path is replaying the latest server event after the local cache has already applied it.",
  },
  {
    author: "Eli Park",
    time: "5 min ago",
    body: "I can reproduce this with two tabs open. It only happens when the second tab regains focus first.",
  },
  {
    author: "Noah Reed",
    time: "Just now",
    body: "Let's keep the detail panel and comments panel separate so each can get its own data path later.",
  },
]

export const labels = ["bug", "sync", "frontend", "accessibility", "design"]
