import { For } from "solid-js"

type SidebarProps = {
  labels: string[]
}

export function Sidebar(props: SidebarProps) {
  return (
    <aside class="sidebar" aria-label="Project navigation">
      <div class="brand">
        <div class="brand-mark">S2</div>
        <div>
          <p class="eyebrow">Solid Labs</p>
          <h1>Issue Tracker</h1>
        </div>
      </div>

      <nav class="nav-list" aria-label="Views">
        <a class="nav-item active" href="#">
          Inbox <span>18</span>
        </a>
        <a class="nav-item" href="#">
          Assigned <span>6</span>
        </a>
        <a class="nav-item" href="#">
          Review <span>3</span>
        </a>
        <a class="nav-item" href="#">
          Closed <span>124</span>
        </a>
      </nav>

      <section class="label-card" aria-labelledby="labels-heading">
        <h2 id="labels-heading">Labels</h2>
        <div class="label-list">
          <For each={props.labels}>{label => <span class="label-chip">{label}</span>}</For>
        </div>
      </section>
    </aside>
  )
}
