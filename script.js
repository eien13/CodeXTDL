// PROTOTYPE DATA ONLY!!

'use strict';
// THIS IS ONLY UI PROTOTYPE PARA MAY DATA UI NATIN. 
// Data exists in memory and resets on reload.
// Replace these sample tasks and client-side mutations with PHP session CRUD



// 1. DEMO STATE
// Each task has a unique ID, its displayed text, and a completion flag(done or nah).
let tasks = [
  { id: 1, text: 'Review web development notes', completed: false },
  { id: 2, text: 'Design the task manager interface', completed: false },
  { id: 3, text: 'Prepare collaboration screenshots', completed: false },
  { id: 4, text: 'Read the Lab Activity 4 instructions', completed: true }
];
let nextId = 5;
let filter = 'all';
let editingId = null;
let deletingId = null;

// 2. PAGE REFERENCES
// Small helper to find an HTML element by its unique id attribute.
const getElement = (id) => document.getElementById(id);
const form = getElement('task-form');
const input = getElement('task-input');
const list = getElement('task-list');
const dialog = getElement('delete-dialog');

// Trusted SVG markup for the two action icons. Never insert user input here.
const icons = {
  edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5 5 5M4 20l5-1L20 8a2 2 0 0 0-5-5L4 14z"/></svg>',
  delete: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/></svg>'
};

// 3. SHARED HELPERS
// The hidden live region reads this message aloud for screen-reader users.
function announce(message) {
  getElement('announcement').textContent = message;
}

// Keep the input's character counter in sync with what the user types.
function updateCount() {
  getElement('char-count').textContent = `${input.value.length}/120`;
}

// Return the shared add/edit form to its initial Add task state.
function resetForm() {
  editingId = null;
  form.reset();
  getElement('task-id').value = '';
  getElement('form-action').value = 'create';
  getElement('composer-title').textContent = 'What’s next?';
  getElement('submit-button').innerHTML = '<span aria-hidden="true">＋</span> Add task';
  getElement('cancel-edit').hidden = true;
  getElement('form-error').textContent = '';
  input.removeAttribute('aria-invalid');
  updateCount();
}

// 4. RENDER THE INTERFACE
// Rebuild the visible list and refresh every count from the current task array.
function render() {
  // Count all tasks, even when a filter hides some rows.
  const completed = tasks.filter(task => task.completed).length;
  const active = tasks.length - completed;
  getElement('total-badge').textContent = tasks.length;
  getElement('all-count').textContent = tasks.length;
  getElement('active-count').textContent = active;
  getElement('completed-count').textContent = completed;
  getElement('remaining-count').textContent = `${active} ${active === 1 ? 'task' : 'tasks'} left to do`;

  // Avoid division by zero when the user deletes every task.
  const percent = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  getElement('progress-percent').textContent = `${percent}%`;
  getElement('progress-bar').max = tasks.length || 1;
  getElement('progress-bar').value = completed;
  getElement('progress-bar').textContent = `${percent}%`;
  getElement('progress-caption').textContent = tasks.length ? `${completed} of ${tasks.length} tasks completed. ${active ? 'Keep going!' : 'Enjoy your little win!'}` : 'A fresh start. Add a task whenever you’re ready.';

  // Apply the selected filter before creating the task rows.
  const visible = tasks.filter(task => filter === 'all' || (filter === 'completed' ? task.completed : !task.completed));
  // Clear old rows so tasks do not get duplicated on each refresh.
  list.replaceChildren();
  visible.forEach(task => {
    const row = document.createElement('li');
    row.className = `task-row${task.completed ? ' is-complete' : ''}`;

    // Checkbox: toggles this task between active and completed.
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-check';
    checkbox.id = `task-${task.id}`;
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      render();
      // Rendering replaces the checkbox; restore keyboard focus afterward.
      const replacement = document.getElementById(`task-${task.id}`);
      (replacement || document.querySelector('[data-filter][aria-pressed="true"]')).focus();
      announce(task.completed ? 'Task completed.' : 'Task marked active.');
    });

    // The label links to its checkbox, so clicking the task text also toggles it.
    const label = document.createElement('label');
    label.className = 'task-text';
    label.htmlFor = checkbox.id;
    label.textContent = task.text; // User text must never be inserted as HTML.

    // Build Edit and Delete buttons with descriptive accessible names.
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    ['edit', 'delete'].forEach(action => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'icon-button';
      button.innerHTML = icons[action];
      button.setAttribute('aria-label', `${action === 'edit' ? 'Edit' : 'Delete'} task: ${task.text}`);
      button.title = action === 'edit' ? 'Edit task' : 'Delete task';
      button.addEventListener('click', () => action === 'edit' ? editTask(task) : requestDelete(task));
      actions.append(button);
    });
    row.append(checkbox, label, actions);
    list.append(row);
  });

  // Show helpful guidance when the current filter has no matching tasks.
  getElement('empty-state').hidden = visible.length > 0;
  getElement('empty-message').textContent = !tasks.length ? 'Add your first task to get started.' : filter === 'completed' ? 'Your completed tasks will appear here.' : 'You’ve finished all your active tasks.';
}

// 5. EDITING AND DELETE CONFIRMATION
// Fill the existing form instead of creating a second editing interface.
function editTask(task) {
  editingId = task.id;
  getElement('task-id').value = task.id;
  getElement('form-action').value = 'update';
  getElement('composer-title').textContent = 'A little adjustment.';
  input.value = task.text;
  getElement('submit-button').textContent = 'Save changes';
  getElement('cancel-edit').hidden = false;
  getElement('form-error').textContent = '';
  input.removeAttribute('aria-invalid');
  updateCount();
  input.focus();
}

// Remember the selected task, then open the modal before making any changes.
function requestDelete(task) {
  deletingId = task.id;
  getElement('delete-description').textContent = `“${task.text}” will be removed from your list.`;
  dialog.showModal();
  getElement('keep-task').focus();
}

// 6. EVENT LISTENERS
// This UI demo handles submissions in memory; it does not call a PHP backend.
form.addEventListener('submit', event => {
  event.preventDefault(); // Remove when connecting actual self-submitting PHP POST handling.
  // Trim leading/trailing spaces and reject whitespace-only task names.
  const text = input.value.trim();
  if (!text || text.length > 120) {
    getElement('form-error').textContent = 'Enter a task between 1 and 120 characters.';
    input.setAttribute('aria-invalid', 'true');
    input.focus();
    return;
  }

  // An editing ID means update; otherwise create a task with a new unique ID.
  const wasEditing = editingId !== null;
  if (wasEditing) {
    const task = tasks.find(item => item.id === editingId);
    if (task) {
      task.text = text;
    }
  } else {
    tasks.push({ id: nextId++, text, completed: false });
    filter = 'all';
    document.querySelectorAll('[data-filter]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
    });
  }
  resetForm();
  render();
  input.focus();
  announce(wasEditing ? 'Task updated.' : 'Task added.');
});
input.addEventListener('input', () => {
  updateCount();
  input.removeAttribute('aria-invalid');
  getElement('form-error').textContent = '';
});
getElement('cancel-edit').addEventListener('click', () => {
  resetForm();
  input.focus();
});
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    render();
  });
});
getElement('keep-task').addEventListener('click', () => dialog.close());
getElement('confirm-delete').addEventListener('click', () => {
  tasks = tasks.filter(task => task.id !== deletingId);
  // If the removed task was being edited, discard that stale edit state.
  if (editingId === deletingId) {
    resetForm();
  }
  dialog.close();
  render();
  input.focus();
  announce('Task deleted.');
});
// Also clear the pending ID when the modal closes with Escape or Keep task.
dialog.addEventListener('close', () => {
  deletingId = null;
});

// 7. INITIAL DISPLAY
// Populate the page with the four example tasks when the script loads.
render();
