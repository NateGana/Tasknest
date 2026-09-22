/* ==========================================================================
   TaskNest — Application Logic
   All data is persisted to localStorage. No backend required.
   ========================================================================== */

const STORAGE_KEY = 'tasknest_data_v1';

function buildDemoData() {
  const today = new Date();
  const addDays = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

  const projects = [
    { id: 'PRJ-001', name: 'Website Redesign', description: 'Full overhaul of the corporate marketing site, including a new design system and CMS migration.', client: 'Horizon Retail Group', start: addDays(-30), due: addDays(10), priority: 'High', status: 'In Progress', progress: 65 },
    { id: 'PRJ-002', name: 'Mobile App Launch', description: 'Design and ship the first version of the customer loyalty mobile app for iOS and Android.', client: 'Brewhouse Coffee Co.', start: addDays(-15), due: addDays(45), priority: 'High', status: 'In Progress', progress: 30 },
    { id: 'PRJ-003', name: 'Internal HR Portal', description: 'Self-service portal for leave requests, payslips, and onboarding documents.', client: 'Internal — People Team', start: addDays(-60), due: addDays(-5), priority: 'Medium', status: 'Completed', progress: 100 },
    { id: 'PRJ-004', name: 'Q3 Marketing Campaign', description: 'Cross-channel campaign covering paid social, email, and landing page experiments.', client: 'Verde Wellness', start: addDays(5), due: addDays(60), priority: 'Medium', status: 'Planning', progress: 5 },
    { id: 'PRJ-005', name: 'API Platform Migration', description: 'Migrate legacy REST services to the new gateway with improved auth and rate limiting.', client: 'Internal — Engineering', start: addDays(-20), due: addDays(20), priority: 'High', status: 'On Hold', progress: 40 },
  ];

  const tasks = [
    { id: 'TSK-001', name: 'Design homepage hero section', project: 'PRJ-001', assignee: 'Miguel Santos', priority: 'High', status: 'Review', due: addDays(2), description: 'Explore two layout directions for the new hero.' },
    { id: 'TSK-002', name: 'Set up CMS content models', project: 'PRJ-001', assignee: 'Ella Fernandez', priority: 'Medium', status: 'In Progress', due: addDays(4), description: 'Define schemas for pages, posts, and product entries.' },
    { id: 'TSK-003', name: 'Migrate blog content', project: 'PRJ-001', assignee: 'Ella Fernandez', priority: 'Low', status: 'To Do', due: addDays(9), description: 'Move 120+ legacy blog posts into the new CMS.' },
    { id: 'TSK-004', name: 'QA cross-browser testing', project: 'PRJ-001', assignee: 'Miguel Santos', priority: 'Medium', status: 'To Do', due: addDays(-1), description: 'Test on Safari, Firefox, and Edge.' },
    { id: 'TSK-005', name: 'Wireframe onboarding flow', project: 'PRJ-002', assignee: 'Carla Domingo', priority: 'High', status: 'Completed', due: addDays(-10), description: 'First-run experience for new app users.' },
    { id: 'TSK-006', name: 'Build push notification service', project: 'PRJ-002', assignee: 'Marco Villareal', priority: 'High', status: 'In Progress', due: addDays(6), description: 'Integrate with Firebase Cloud Messaging.' },
    { id: 'TSK-007', name: 'Loyalty points redemption UI', project: 'PRJ-002', assignee: 'Carla Domingo', priority: 'Medium', status: 'To Do', due: addDays(12), description: '' },
    { id: 'TSK-008', name: 'Finalize brand messaging', project: 'PRJ-004', assignee: 'Jasmine Cruz', priority: 'Medium', status: 'To Do', due: addDays(8), description: 'Align on campaign tone with the client.' },
    { id: 'TSK-009', name: 'Draft email sequence', project: 'PRJ-004', assignee: 'Jasmine Cruz', priority: 'Low', status: 'To Do', due: addDays(15), description: '' },
    { id: 'TSK-010', name: 'Audit legacy endpoints', project: 'PRJ-005', assignee: 'Marco Villareal', priority: 'High', status: 'Review', due: addDays(1), description: 'List all endpoints currently in production use.' },
    { id: 'TSK-011', name: 'Implement new auth gateway', project: 'PRJ-005', assignee: 'Marco Villareal', priority: 'High', status: 'In Progress', due: addDays(-3), description: '' },
    { id: 'TSK-012', name: 'Write onboarding docs', project: 'PRJ-003', assignee: 'Ella Fernandez', priority: 'Low', status: 'Completed', due: addDays(-8), description: '' },
  ];

  return { projects, tasks };
}

let db = loadData();

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) { try { return JSON.parse(raw); } catch (e) {} }
  const demo = buildDemoData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
  return demo;
}
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }

/* ---------------------------------------------------------------------- *
 * Utilities
 * ---------------------------------------------------------------------- */
function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function isOverdue(iso, status) {
  if (!iso || status === 'Completed') return false;
  const today = new Date(); today.setHours(0,0,0,0);
  return new Date(iso + 'T00:00:00') < today;
}
function daysUntil(iso) {
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(iso + 'T00:00:00');
  return Math.round((target - today) / 86400000);
}
function generateId(prefix, list) {
  let max = 0;
  list.forEach(item => { const n = parseInt(item.id.split('-')[1], 10); if (!isNaN(n) && n > max) max = n; });
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}
function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}
function projectById(id) { return db.projects.find(p => p.id === id); }
function taskById(id) { return db.tasks.find(t => t.id === id); }
function priorityBadgeClass(p) { return p === 'High' ? 'badge-red' : p === 'Medium' ? 'badge-amber' : 'badge-green'; }
function statusBadgeClass(s) {
  if (s === 'Completed') return 'badge-green';
  if (s === 'In Progress') return 'badge-blue';
  if (s === 'Review') return 'badge-amber';
  if (s === 'On Hold') return 'badge-slate';
  if (s === 'Planning') return 'badge-indigo';
  return 'badge-slate';
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = {
    success: '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
    error: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5m0 3h.01"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5m0-3h.01"/></svg>'
  };
  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('hide'); setTimeout(() => toast.remove(), 200); }, 3200);
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', () => closeModal(btn.dataset.closeModal)));
document.querySelectorAll('.modal-overlay').forEach(overlay => overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); }));

let confirmAction = null;
function askConfirm(title, text, actionLabel, onConfirm) {
  document.getElementById('confirmModalTitle').textContent = title;
  document.getElementById('confirmModalText').textContent = text;
  document.getElementById('confirmModalActionBtn').textContent = actionLabel;
  confirmAction = onConfirm;
  openModal('confirmModalOverlay');
}
document.getElementById('confirmModalActionBtn').addEventListener('click', () => { if (confirmAction) confirmAction(); closeModal('confirmModalOverlay'); });

/* ---------------------------------------------------------------------- *
 * Navigation
 * ---------------------------------------------------------------------- */
const pageMeta = {
  dashboard: ['Dashboard', "Your team's progress at a glance"],
  projects: ['Projects', 'Manage active and past projects'],
  board: ['Task Board', 'Drag tasks between columns to update their status'],
};
function switchView(view) {
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === `view-${view}`));
  document.getElementById('pageTitle').textContent = pageMeta[view][0];
  document.getElementById('pageSubtitle').textContent = pageMeta[view][1];
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('scrim').classList.remove('open');
  renderAll();
}
document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.view)));
document.getElementById('goBoard').addEventListener('click', () => switchView('board'));
document.getElementById('menuToggle').addEventListener('click', () => { document.getElementById('sidebar').classList.add('open'); document.getElementById('scrim').classList.add('open'); });
document.getElementById('scrim').addEventListener('click', () => { document.getElementById('sidebar').classList.remove('open'); document.getElementById('scrim').classList.remove('open'); });

/* ---------------------------------------------------------------------- *
 * Dashboard
 * ---------------------------------------------------------------------- */
function renderDashboard() {
  const projects = db.projects, tasks = db.tasks;
  document.getElementById('statTotalProjects').textContent = projects.length;
  document.getElementById('statActiveProjects').textContent = projects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;
  document.getElementById('statCompletedProjects').textContent = projects.filter(p => p.status === 'Completed').length;
  document.getElementById('statPendingTasks').textContent = tasks.filter(t => t.status !== 'Completed').length;
  document.getElementById('statOverdueTasks').textContent = tasks.filter(t => isOverdue(t.due, t.status)).length;
  const overall = projects.length ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0;
  document.getElementById('statOverallProgress').textContent = overall + '%';

  const activeProjects = projects.filter(p => p.status !== 'Completed').slice(0, 5);
  const list = document.getElementById('dashboardProjectsList');
  list.innerHTML = '';
  document.getElementById('dashboardProjectsEmpty').hidden = activeProjects.length > 0;
  activeProjects.forEach(p => {
    const row = document.createElement('div');
    row.className = 'dash-project-row';
    row.innerHTML = `
      <div class="info"><h4>${p.name}</h4><span>${p.client} · Due ${formatDate(p.due)}</span></div>
      <div class="mini-progress"><div class="mini-progress-fill" style="width:${p.progress}%"></div></div>
      <div class="mini-progress-pct">${p.progress}%</div>`;
    row.addEventListener('click', () => openProjectDetails(p.id));
    list.appendChild(row);
  });

  const dueSoon = [...tasks].filter(t => t.status !== 'Completed').sort((a, b) => new Date(a.due) - new Date(b.due)).slice(0, 6);
  const taskList = document.getElementById('dashboardTasksList');
  taskList.innerHTML = '';
  document.getElementById('dashboardTasksEmpty').hidden = dueSoon.length > 0;
  dueSoon.forEach(t => {
    const proj = projectById(t.project);
    const overdue = isOverdue(t.due, t.status);
    const row = document.createElement('div');
    row.className = 'dash-task-row';
    row.innerHTML = `
      <div class="task-avatar">${initials(t.assignee)}</div>
      <div class="info"><h4>${t.name}</h4><span>${proj ? proj.name : ''} · <span class="deadline ${overdue ? 'overdue' : ''}">${overdue ? 'Overdue' : formatDate(t.due)}</span></span></div>
      <span class="badge ${priorityBadgeClass(t.priority)}"><span class="badge-dot"></span>${t.priority}</span>`;
    taskList.appendChild(row);
  });
}

/* ---------------------------------------------------------------------- *
 * Projects view
 * ---------------------------------------------------------------------- */
function renderProjects() {
  const search = document.getElementById('projectSearch').value.trim().toLowerCase();
  const status = document.getElementById('projectStatusFilter').value;
  let list = db.projects.filter(p => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search) || p.client.toLowerCase().includes(search);
    const matchesStatus = !status || p.status === status;
    return matchesSearch && matchesStatus;
  });

  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '';
  document.getElementById('projectsEmpty').hidden = list.length > 0;

  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-card-head">
        <div><h3>${p.name}</h3><span class="client">${p.client}</span></div>
        <span class="badge ${statusBadgeClass(p.status)}"><span class="badge-dot"></span>${p.status}</span>
      </div>
      <p class="desc">${p.description}</p>
      <div class="project-card-meta">
        <span>Due ${formatDate(p.due)}</span>
        <span class="priority-${p.priority}">● ${p.priority} priority</span>
      </div>
      <div class="mini-progress" style="width:100%;"><div class="mini-progress-fill" style="width:${p.progress}%"></div></div>
      <div class="project-card-actions">
        <button class="icon-btn" title="Edit" data-action="edit-project" data-id="${p.id}"><svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>
        <button class="icon-btn danger" title="Delete" data-action="delete-project" data-id="${p.id}"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg></button>
      </div>`;
    card.addEventListener('click', (e) => { if (!e.target.closest('button')) openProjectDetails(p.id); });
    grid.appendChild(card);
  });
}
document.getElementById('projectSearch').addEventListener('input', renderProjects);
document.getElementById('projectStatusFilter').addEventListener('change', renderProjects);
document.getElementById('globalSearch').addEventListener('input', (e) => {
  const value = e.target.value;
  switchView('projects');
  document.getElementById('projectSearch').value = value;
  renderProjects();
});

document.getElementById('projectsGrid').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  const project = projectById(id);
  if (btn.dataset.action === 'edit-project') openProjectModal(project);
  if (btn.dataset.action === 'delete-project') {
    askConfirm('Delete project?', `"${project.name}" and its task associations will be removed. Tasks will remain but show as unassigned.`, 'Delete', () => {
      db.projects = db.projects.filter(p => p.id !== id);
      saveData(); renderAll();
      showToast('Project deleted', 'success');
    });
  }
});

function openProjectModal(project) {
  document.getElementById('projectForm').reset();
  const title = document.getElementById('projectModalTitle');
  const submitBtn = document.getElementById('projectSubmitBtn');
  if (project) {
    title.textContent = 'Edit Project'; submitBtn.textContent = 'Save Changes';
    document.getElementById('projectId').value = project.id;
    document.getElementById('projectName').value = project.name;
    document.getElementById('projectDescription').value = project.description;
    document.getElementById('projectClient').value = project.client;
    document.getElementById('projectStart').value = project.start;
    document.getElementById('projectDue').value = project.due;
    document.getElementById('projectPriority').value = project.priority;
    document.getElementById('projectStatus').value = project.status;
    document.getElementById('projectProgress').value = project.progress;
  } else {
    title.textContent = 'Add Project'; submitBtn.textContent = 'Add Project';
    document.getElementById('projectId').value = '';
  }
  openModal('projectModalOverlay');
}
document.getElementById('addProjectBtn').addEventListener('click', () => openProjectModal(null));

document.getElementById('projectForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('projectId').value;
  const start = document.getElementById('projectStart').value;
  const due = document.getElementById('projectDue').value;
  if (new Date(due) < new Date(start)) {
    showToast('Due date cannot be before the start date', 'error');
    return;
  }
  const data = {
    name: document.getElementById('projectName').value.trim(),
    description: document.getElementById('projectDescription').value.trim(),
    client: document.getElementById('projectClient').value.trim(),
    start, due,
    priority: document.getElementById('projectPriority').value,
    status: document.getElementById('projectStatus').value,
    progress: Math.max(0, Math.min(100, parseInt(document.getElementById('projectProgress').value, 10) || 0)),
  };
  if (id) { Object.assign(projectById(id), data); showToast('Project updated', 'success'); }
  else { db.projects.push({ id: generateId('PRJ', db.projects), ...data }); showToast('Project added', 'success'); }
  saveData(); closeModal('projectModalOverlay'); renderAll();
});

function openProjectDetails(id) {
  const p = projectById(id);
  if (!p) return;
  document.getElementById('detailsProjectName').textContent = p.name;
  document.getElementById('detailsProjectDesc').textContent = p.description;
  document.getElementById('detailsClient').textContent = p.client;
  document.getElementById('detailsPriority').textContent = p.priority;
  document.getElementById('detailsStart').textContent = formatDate(p.start);
  document.getElementById('detailsDue').textContent = formatDate(p.due);
  document.getElementById('detailsStatus').textContent = p.status;
  document.getElementById('detailsProgress').textContent = p.progress + '%';

  const tasks = db.tasks.filter(t => t.project === id);
  const list = document.getElementById('detailsTaskList');
  list.innerHTML = '';
  document.getElementById('detailsTaskEmpty').hidden = tasks.length > 0;
  tasks.forEach(t => {
    const overdue = isOverdue(t.due, t.status);
    const row = document.createElement('div');
    row.className = 'dash-task-row';
    row.innerHTML = `
      <div class="task-avatar">${initials(t.assignee)}</div>
      <div class="info"><h4>${t.name}</h4><span>${t.assignee} · <span class="deadline ${overdue ? 'overdue' : ''}">${overdue ? 'Overdue' : formatDate(t.due)}</span></span></div>
      <span class="badge ${statusBadgeClass(t.status)}"><span class="badge-dot"></span>${t.status}</span>`;
    list.appendChild(row);
  });
  openModal('projectDetailsOverlay');
}

/* ---------------------------------------------------------------------- *
 * Kanban board
 * ---------------------------------------------------------------------- */
function populateBoardProjectFilter() {
  const select = document.getElementById('boardProjectFilter');
  const current = select.value;
  select.innerHTML = '<option value="">All Projects</option>' + db.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  select.value = current;
}
function populateTaskProjectSelect() {
  document.getElementById('taskProject').innerHTML = db.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
}

const statusToColumn = { 'To Do': 'col-todo', 'In Progress': 'col-progress', 'Review': 'col-review', 'Completed': 'col-completed' };

function renderBoard() {
  populateBoardProjectFilter();
  const projectFilter = document.getElementById('boardProjectFilter').value;
  const priorityFilter = document.getElementById('boardPriorityFilter').value;
  const sort = document.getElementById('boardSort').value;

  let tasks = db.tasks.filter(t => {
    return (!projectFilter || t.project === projectFilter) && (!priorityFilter || t.priority === priorityFilter);
  });
  tasks.sort((a, b) => sort === 'deadline-asc' ? new Date(a.due) - new Date(b.due) : new Date(b.due) - new Date(a.due));

  Object.values(statusToColumn).forEach(colId => document.getElementById(colId).innerHTML = '');
  const counts = { 'To Do': 0, 'In Progress': 0, 'Review': 0, 'Completed': 0 };

  tasks.forEach(t => {
    counts[t.status] = (counts[t.status] || 0) + 1;
    const proj = projectById(t.project);
    const overdue = isOverdue(t.due, t.status);
    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.dataset.id = t.id;
    card.innerHTML = `
      <div class="task-card-top">
        <h4>${t.name}</h4>
        <span class="badge ${priorityBadgeClass(t.priority)}"><span class="badge-dot"></span>${t.priority}</span>
      </div>
      <div class="task-project">${proj ? proj.name : 'Unassigned'}</div>
      <div class="task-meta">
        <div class="assignee"><div class="task-avatar">${initials(t.assignee)}</div>${t.assignee}</div>
        <span class="deadline ${overdue ? 'overdue' : ''}">${overdue ? 'Overdue' : formatDate(t.due)}</span>
      </div>
      <div class="task-actions" style="margin-top:8px;justify-content:flex-end;display:flex;gap:4px;">
        <button class="icon-btn" title="Edit" data-action="edit-task" data-id="${t.id}"><svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>
        <button class="icon-btn danger" title="Delete" data-action="delete-task" data-id="${t.id}"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg></button>
      </div>`;
    document.getElementById(statusToColumn[t.status] || 'col-todo').appendChild(card);
  });

  document.getElementById('countTodo').textContent = counts['To Do'];
  document.getElementById('countProgress').textContent = counts['In Progress'];
  document.getElementById('countReview').textContent = counts['Review'];
  document.getElementById('countCompleted').textContent = counts['Completed'];

  attachDragEvents();
}

document.getElementById('boardProjectFilter').addEventListener('change', renderBoard);
document.getElementById('boardPriorityFilter').addEventListener('change', renderBoard);
document.getElementById('boardSort').addEventListener('change', renderBoard);

document.getElementById('kanbanBoard').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  const task = taskById(id);
  if (btn.dataset.action === 'edit-task') openTaskModal(task);
  if (btn.dataset.action === 'delete-task') {
    askConfirm('Delete task?', `"${task.name}" will be permanently removed.`, 'Delete', () => {
      db.tasks = db.tasks.filter(t => t.id !== id);
      saveData(); renderAll();
      showToast('Task deleted', 'success');
    });
  }
});

let draggedTaskId = null;
function attachDragEvents() {
  document.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('dragstart', () => { draggedTaskId = card.dataset.id; card.classList.add('dragging'); });
    card.addEventListener('dragend', () => { card.classList.remove('dragging'); draggedTaskId = null; });
  });
  document.querySelectorAll('.kanban-col-body').forEach(col => {
    col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('drag-over'); });
    col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');
      if (!draggedTaskId) return;
      const newStatus = col.closest('.kanban-col').dataset.status;
      const task = taskById(draggedTaskId);
      if (task && task.status !== newStatus) {
        task.status = newStatus;
        saveData();
        renderAll();
        showToast(`Task moved to ${newStatus}`, 'success');
      }
    });
  });
}

function openTaskModal(task) {
  populateTaskProjectSelect();
  document.getElementById('taskForm').reset();
  const title = document.getElementById('taskModalTitle');
  const submitBtn = document.getElementById('taskSubmitBtn');
  if (task) {
    title.textContent = 'Edit Task'; submitBtn.textContent = 'Save Changes';
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskName').value = task.name;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskProject').value = task.project;
    document.getElementById('taskAssignee').value = task.assignee;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskStatus').value = task.status;
    document.getElementById('taskDue').value = task.due;
  } else {
    title.textContent = 'Add Task'; submitBtn.textContent = 'Add Task';
    document.getElementById('taskId').value = '';
  }
  openModal('taskModalOverlay');
}
document.getElementById('addTaskBtn').addEventListener('click', () => {
  if (db.projects.length === 0) { showToast('Create a project first', 'error'); return; }
  openTaskModal(null);
});

document.getElementById('taskForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('taskId').value;
  const data = {
    name: document.getElementById('taskName').value.trim(),
    description: document.getElementById('taskDescription').value.trim(),
    project: document.getElementById('taskProject').value,
    assignee: document.getElementById('taskAssignee').value.trim(),
    priority: document.getElementById('taskPriority').value,
    status: document.getElementById('taskStatus').value,
    due: document.getElementById('taskDue').value,
  };
  if (id) { Object.assign(taskById(id), data); showToast('Task updated', 'success'); }
  else { db.tasks.push({ id: generateId('TSK', db.tasks), ...data }); showToast('Task added', 'success'); }
  saveData(); closeModal('taskModalOverlay'); renderAll();
});

/* ---------------------------------------------------------------------- *
 * Master render
 * ---------------------------------------------------------------------- */
function renderAll() {
  renderDashboard();
  renderProjects();
  renderBoard();
}
renderAll();
