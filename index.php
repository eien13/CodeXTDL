<!-- pag irrun "http://localhost/CodeXTDL/index.php"-->

<!DOCTYPE html>
<html lang="en">
  <!-- external CSS / JavaScript files. -->
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="A simple, pink task manager. One thing at a time."
    />
    <title>Petal — My tasks</title>
    <link rel="stylesheet" href="style.css" />
    <script src="script.js" defer></script>
  </head>

  <body>
    <!-- Header: the brand link jumps to the page heading. -->
    <header class="site-header">
      <a class="brand" href="#page-title" aria-label="Petal home">
        <img class="brand-icon" src="asset/icon.svg" alt="" width="35" height="35" />
        petal<span class="brand-dot">.</span>
      </a>
      <span class="header-caption">A little space to get things done.</span>
    </header>


    <main class="workspace">
      <!-- Introductory heading and short description. -->
      <section class="intro" aria-labelledby="page-title">
        <p class="eyebrow">YOUR EVERYDAY TASK MANAGER</p>
        <h1 id="page-title">Small steps.<br /><em>A clearer day.</em></h1>
        <p>
          Make a list, take your time, and check things off.<br class="desktop-break" />
          One task at a time is enough.
        </p>
      </section>

      <!-- Desktop: two columns. Mobile: the form appears above the task list. -->
      <div class="workspace-grid">
        <!-- Task composer: the same form is used to add and edit tasks. -->
        <aside class="composer panel" aria-labelledby="composer-title">
          <span class="section-number">MAKE A LITTLE PLAN</span>
          <h2 id="composer-title">What’s next?</h2>
          <p class="muted">Give your next task a place to start.</p>

          <!-- UI-only: JavaScript previews the form. Add PHP POST processing separately. -->
          <form id="task-form" method="POST" action="">
            <!-- These fields provide action and task ID hooks for future PHP handling. -->
            <input type="hidden" name="action" id="form-action" value="create" />
            <input type="hidden" name="task_id" id="task-id" value="" />

            <label for="task-input">Task name <span aria-hidden="true">*</span></label>
            <input
              type="text"
              id="task-input"
              name="task"
              placeholder="e.g. Review web development notes"
              maxlength="120"
              required
              aria-describedby="input-help form-error"
              autocomplete="off"
            />

            <div class="input-meta">
              <span id="input-help">Keep it simple and specific.</span>
              <span id="char-count">0/120</span>
            </div>

            <p id="form-error" class="error" role="alert"></p>

            <button type="submit" class="primary" id="submit-button">
              <span aria-hidden="true">＋</span> Add task
            </button>
            <button type="button" class="cancel" id="cancel-edit" hidden>
              Cancel editing
            </button>
          </form>

          <div class="gentle-note">
            <img class="note-flower" src="asset/icon.svg" alt="" width="32" height="32" />

            <p>
              You don’t have to do it all.<br />
              <strong>Just start with one thing.</strong>
            </p>
          </div>
        </aside>

        <!-- Task board: JavaScript renders sample task rows into the empty list. -->
        <section class="task-board panel" aria-labelledby="list-title">
          <div class="board-heading">
            <div>
              <span class="section-number">ONE THING AT A TIME</span>
              <h2 id="list-title">My tasks <span id="total-badge" class="badge">4</span></h2>
            </div>

            <img class="small-flower" src="asset/icon.svg" alt="" width="39" height="39" />
          </div>

          <div class="list-toolbar">
            <div class="filters" role="group" aria-label="Filter tasks">
              <button type="button" data-filter="all" aria-pressed="true">
                All <span id="all-count">4</span>
              </button>
              <button type="button" data-filter="active" aria-pressed="false">
                Active <span id="active-count">3</span>
              </button>
              <button type="button" data-filter="completed" aria-pressed="false">
                Completed <span id="completed-count">1</span>
              </button>
            </div>
          </div>

          <ul id="task-list" class="task-list" aria-label="Tasks"></ul>

          <div id="empty-state" class="empty-state" hidden>
            <img class="empty-flower" src="asset/icon.svg" alt="" width="34" height="34" />

            <h3>A little breathing room.</h3>
            <p id="empty-message">Add your first task to get started.</p>
          </div>

          <div class="board-footer">
            <span id="remaining-count">3 tasks left to do</span>
            <span>Little by little.</span>
          </div>
        </section>
      </div>

      <!-- Summary values are recalculated after each task change. -->
      <section class="progress-panel" aria-label="Task progress">
        <span class="progress-icon" aria-hidden="true">✓</span>

        <div class="progress-copy">
          <h2>Your progress, at a glance</h2>
          <p id="progress-caption">1 of 4 tasks completed. Keep going!</p>
        </div>

        <div class="progress-meter">
          <div class="progress-meta">
            <span>Today’s little wins</span>
            <strong id="progress-percent">25%</strong>
          </div>
          <progress id="progress-bar" value="1" max="4">25%</progress>
        </div>
      </section>

      <!-- Announce changes to assistive technology without adding visible text. -->
      <p id="announcement" class="sr-only" role="status" aria-live="polite"></p>

      <noscript>
        <p class="noscript">Enable JavaScript to try this UI preview. PHP processing has not been connected.</p>
      </noscript>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <span>© 2026 petal. <span class="footer-divider">/</span> Simple tasks. Softer days.</span>
    </footer>

    <!-- Native modal: confirmation before removing a task; Escape closes it. -->
    <dialog id="delete-dialog" aria-labelledby="delete-title" aria-describedby="delete-description">
      <h2 id="delete-title">Delete this task?</h2>
      <p id="delete-description"></p>

      <div class="dialog-actions">
        <button type="button" id="keep-task" class="secondary">Keep task</button>
        <button type="button" id="confirm-delete" class="primary">Delete task</button>
      </div>
    </dialog>
  </body>
</html>
