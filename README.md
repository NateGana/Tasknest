# TaskNest

A modern project and task management system for small teams. TaskNest combines a project overview, a Kanban-style task board, and a live progress dashboard in one lightweight, browser-based tool.

## Description

TaskNest helps a small team plan projects, break them into tasks, and track progress without any external project-management software. Everything — projects, tasks, deadlines, priorities, and progress — lives in the browser via `localStorage`, so the app is ready to use the moment you open it.

## Main Features

- **Dashboard** — total/active/completed projects, pending and overdue task counts, and an overall progress figure calculated from all projects
- **Projects** — add, edit, delete, search, and filter projects by status; click any project card to view full details and its associated tasks
- **Kanban task board** — drag and drop tasks between **To Do**, **In Progress**, **Review**, and **Completed** columns; status updates are saved instantly
- **Task management** — add, edit, delete tasks with project assignment, assignee, priority, status, and due date
- **Smart indicators** — automatic overdue detection, color-coded priority badges, and status badges throughout the app
- **Filtering & sorting** — filter the board by project or priority, and sort by deadline
- **Polished UX** — modal forms, confirmation dialogs, toast notifications, and empty states across every view

## Technologies Used

- HTML5
- CSS3 (custom properties, CSS Grid & Flexbox, no framework)
- Vanilla JavaScript (ES6+), including the native HTML5 Drag and Drop API
- Browser `localStorage` for persistence
- Google Fonts (Manrope) via CDN — functions normally if the font fails to load
- Inline SVG icons (no icon library)

No backend, server, database, or build tools are required.

## How to Run

1. Download or clone this repository.
2. Open `index.html` directly in any modern web browser.
3. No installation or build step is required.

Sample projects and tasks are generated automatically on first load. Everything you create or change is saved to `localStorage` and persists across page refreshes.

## Project Structure

```
tasknest/
├── index.html      # Application markup, kanban structure, and modal templates
├── style.css       # Styling, layout, kanban board, and responsive rules
├── script.js       # State management, rendering, drag-and-drop, and events
└── README.md       # This file
```

## Key Functionality

| Area | What it does |
|---|---|
| Dashboard | Recalculates every statistic live from the current project/task data |
| Projects | Full CRUD with search + status filtering; deleting a project keeps its tasks (shown as unassigned) |
| Kanban board | Tasks are draggable `<div>` cards; dropping on a column updates the task's status and persists it |
| Task modal | Validates required fields and links every task to an existing project |
| Overdue detection | Any task past its due date (and not completed) is flagged in red throughout the UI |

## Screenshots

> _Add screenshots of your running application here._

- `screenshots/dashboard.png` — Dashboard overview
- `screenshots/projects.png` — Project grid
- `screenshots/board.png` — Kanban task board
- `screenshots/project-details.png` — Project detail modal

## Future Improvements

- Multi-user collaboration with real-time sync (would require a backend)
- File attachments and comments on tasks
- Calendar view of deadlines across all projects
- Time tracking per task
- Custom, user-defined board columns
