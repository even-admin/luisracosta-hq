/* ============================================
   Mission Control — Sprint Blocks + Dashboard
   Pure vanilla JS — no dependencies
   ops.md = projects/tasks source of truth
   state.json = mission, pipeline, numbers, socials
   ============================================ */

(function () {
  'use strict';

  var HASH = '526f5f655785ee7230d6679e465f1b046e223e5502a646db9fc7d851bd224b45';
  var AUTH_KEY = 'hq_auth';
  var TASKS_KEY = 'mc_tasks'; // localStorage: temporary overrides until ops.md syncs

  function _ls() { try { return window.localStorage; } catch(e) { return null; } }
  function _ss() { try { return window.sessionStorage; } catch(e) { return null; } }

  var _memAuth = false;
  function getAuth() { try { var s = _ss(); return s && s.getItem(AUTH_KEY) === 'true'; } catch(e) { return _memAuth; } }
  function setAuth() { _memAuth = true; try { var s = _ss(); if(s) s.setItem(AUTH_KEY, 'true'); } catch(e) {} }

  // ── Task State (localStorage overrides) ────
  // ops.md checkboxes are the source of truth.
  // localStorage stores temporary local overrides (user checks a box in browser).

  var taskOverrides = {};

  function loadTaskOverrides() {
    var ls = _ls(); if (!ls) return;
    try { var raw = ls.getItem(TASKS_KEY); if (raw) taskOverrides = JSON.parse(raw); } catch(e) {}
  }

  function saveTaskOverrides() {
    var ls = _ls(); if (!ls) return;
    try { ls.setItem(TASKS_KEY, JSON.stringify(taskOverrides)); } catch(e) {}
  }

  function isTaskDone(task) {
    // localStorage override takes priority, then ops.md state
    if (taskOverrides[task.id] !== undefined) return taskOverrides[task.id];
    return task.done;
  }

  function toggleTask(task) {
    var current = isTaskDone(task);
    taskOverrides[task.id] = !current;
    saveTaskOverrides();
  }

  // ── Password Gate ──────────────────────────

  async function sha256(msg) {
    var buf = new TextEncoder().encode(msg);
    var hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  function showApp() {
    document.getElementById('gate').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    initApp();
  }

  function initGate() {
    if (getAuth()) { showApp(); return; }
    var form = document.getElementById('gate-form');
    var input = document.getElementById('gate-input');
    var error = document.getElementById('gate-error');
    input.focus();

    async function tryLogin() {
      var v = input.value; if (!v) return;
      var match = false;
      try { match = (await sha256(v)) === HASH; } catch(e) { match = (v === 'even2026'); }
      if (match) { setAuth(); showApp(); }
      else { error.textContent = 'Invalid password'; input.value = ''; input.focus(); setTimeout(function() { error.textContent = ''; }, 2000); }
    }

    form.addEventListener('submit', function(e) { e.preventDefault(); tryLogin(); });
  }

  // ── App State ─────────────────────────────

  var data = null;       // from state.json
  var projects = [];     // parsed from ops.md
  var expandedProjectId = null;

  // ── Init ──────────────────────────────────

  function initApp() {
    loadTaskOverrides();
    initTheme();
    initTabs();
    initSync();
    loadData();
  }

  // ── Sync Button ──────────────────────────

  function initSync() {
    var btn = document.getElementById('sync-btn');
    if (!btn) return;
    btn.addEventListener('click', function() {
      btn.classList.add('syncing');
      btn.classList.remove('synced');
      fetch('data/state.json?t=' + Date.now())
        .then(function(r) { return r.json(); })
        .then(function(newData) {
          data = newData;
          renderAll();
          btn.classList.remove('syncing');
          btn.classList.add('synced');
          setTimeout(function() { btn.classList.remove('synced'); }, 2000);
        })
        .catch(function() {
          btn.classList.remove('syncing');
        });
    });
  }

  async function loadData() {
    try {
      var results = await Promise.all([
        fetch('data/state.json').then(function(r) { return r.json(); }),
        fetch('data/ops.md').then(function(r) { return r.text(); })
      ]);
      data = results[0];
      projects = parseOps(results[1]);
      renderAll();
    } catch(e) {
      console.error('Error loading data:', e);
    }
  }

  function renderAll() {
    renderMissionHero();
    renderProjectList();
    renderNumbers();
    renderDashboard();
    renderSocials();
    renderFinance();
    renderSecurity();
    renderActivity();
  }

  // ── ops.md Parser ─────────────────────────

  function parseOps(md) {
    var lines = md.split('\n');
    var result = [];
    var currentProject = null;
    var currentBlock = null;
    var projectIdx = 0;
    var blockIdx = 0;
    var taskIdx = 0;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      // ## Project Name
      var projectMatch = line.match(/^## (.+)$/);
      if (projectMatch) {
        projectIdx++;
        blockIdx = 0;
        currentProject = {
          id: 'p' + projectIdx,
          name: projectMatch[1].trim(),
          deadline: null,
          blocks: []
        };
        result.push(currentProject);
        currentBlock = null;
        continue;
      }

      // > Deadline: YYYY-MM-DD
      var deadlineMatch = line.match(/^> Deadline:\s*(.+)$/);
      if (deadlineMatch && currentProject) {
        currentProject.deadline = deadlineMatch[1].trim();
        continue;
      }

      // ### Block N: Name (WN)
      var blockMatch = line.match(/^### Block (\d+):\s*(.+)$/);
      if (blockMatch && currentProject) {
        blockIdx++;
        taskIdx = 0;
        var blockName = blockMatch[2].trim();
        // Strip (WN) suffix if present
        blockName = blockName.replace(/\s*\(W\d+\)\s*$/, '');
        currentBlock = {
          id: currentProject.id + '_b' + blockIdx,
          name: blockName,
          tasks: []
        };
        currentProject.blocks.push(currentBlock);
        continue;
      }

      // - [x] or - [ ] Task text `#tag`
      var taskMatch = line.match(/^- \[([ xX])\] (.+)$/);
      if (taskMatch && currentBlock) {
        taskIdx++;
        var done = taskMatch[1] !== ' ';
        var text = taskMatch[2].trim();
        var tag = null;

        // Extract `#tag` from end
        var tagMatch = text.match(/\s*`#([^`]+)`\s*$/);
        if (tagMatch) {
          tag = tagMatch[1];
          text = text.replace(/\s*`#[^`]+`\s*$/, '');
        }

        currentBlock.tasks.push({
          id: currentBlock.id + '_t' + taskIdx,
          text: text,
          tag: tag,
          done: done
        });
      }
    }

    return result;
  }

  // ── Theme ─────────────────────────────────

  function initTheme() {
    var ls = _ls();
    var saved = ls ? ls.getItem('hq_theme') : null;
    if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

    document.getElementById('theme-toggle').addEventListener('click', function() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) { document.documentElement.removeAttribute('data-theme'); try { _ls().setItem('hq_theme', 'light'); } catch(e) {} }
      else { document.documentElement.setAttribute('data-theme', 'dark'); try { _ls().setItem('hq_theme', 'dark'); } catch(e) {} }
    });
  }

  // ── Tabs ──────────────────────────────────

  function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { switchTab(btn.getAttribute('data-tab')); });
    });
  }

  var ALL_TABS = ['blocks', 'dashboard', 'socials', 'finance', 'security', 'activity'];

  function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelector('[data-tab="' + tab + '"]').classList.add('active');
    ALL_TABS.forEach(function(t) {
      var el = document.getElementById('view-' + t);
      if (el) el.classList.toggle('hidden', t !== tab);
    });
  }

  // ── Mission Hero ──────────────────────────

  function renderMissionHero() {
    var el = document.getElementById('mission-hero');
    if (!data || !data.mission) { el.innerHTML = ''; return; }
    var m = data.mission;
    var deadline = new Date(m.deadline + 'T23:59:59');
    var now = new Date();
    var daysLeft = Math.max(0, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)));

    var todayStr = formatISO(now);
    var weeks = m.weeks || [];

    var weekSegments = weeks.map(function(w) {
      if (todayStr > w.end) return 'is-done';
      if (todayStr >= w.start && todayStr <= w.end) return 'is-current';
      return '';
    }).map(function(cls) {
      return '<div class="week-segment ' + cls + '"></div>';
    }).join('');

    var weekLabels = weeks.map(function(w) {
      var cls = '';
      if (todayStr > w.end) cls = 'is-done';
      else if (todayStr >= w.start && todayStr <= w.end) cls = 'is-current';
      return '<div class="week-label ' + cls + '">W' + w.num + ' ' + w.name + '</div>';
    }).join('');

    el.innerHTML =
      '<div class="mission-hero-card">' +
        '<div class="mission-target">' + esc(m.target) + '</div>' +
        '<div class="mission-deadline">Deadline: ' + formatDate(deadline) + '</div>' +
        '<div class="mission-countdown">' + daysLeft + '<span>days left</span></div>' +
        '<div class="week-track">' + weekSegments + '</div>' +
        '<div class="week-labels">' + weekLabels + '</div>' +
      '</div>';
  }

  // ── Project List ──────────────────────────

  function getActiveBlockIndex(project) {
    for (var i = 0; i < project.blocks.length; i++) {
      var block = project.blocks[i];
      var allDone = block.tasks.every(function(t) { return isTaskDone(t); });
      if (!allDone) return i;
    }
    return project.blocks.length; // all complete
  }

  function renderProjectList() {
    var el = document.getElementById('project-list');
    if (!projects || projects.length === 0) { el.innerHTML = ''; return; }

    el.innerHTML = projects.map(function(project) {
      var totalBlocks = project.blocks.length;
      var activeIdx = getActiveBlockIndex(project);
      var doneBlocks = activeIdx;
      var isAllDone = activeIdx >= totalBlocks;
      var isExpanded = expandedProjectId === project.id;

      // Block progress segments
      var segments = project.blocks.map(function(b, i) {
        if (i < activeIdx) return '<div class="block-segment is-done"></div>';
        if (i === activeIdx) return '<div class="block-segment is-active"></div>';
        return '<div class="block-segment"></div>';
      }).join('');

      var currentBlock = isAllDone ? null : project.blocks[activeIdx];
      var currentTasks = currentBlock ? currentBlock.tasks : [];
      var tasksDone = currentTasks.filter(function(t) { return isTaskDone(t); }).length;

      var blockInfo = isAllDone
        ? 'All blocks complete'
        : 'Block ' + (activeIdx + 1) + ': ' + currentBlock.name + ' — ' + tasksDone + '/' + currentTasks.length + ' tasks';

      // Deadline info
      var deadlineHtml = project.deadline
        ? '<span class="project-card-deadline">' + esc(project.deadline) + '</span>'
        : '';

      var html = '<div class="project-card' + (isExpanded ? ' expanded' : '') + '" data-project="' + project.id + '">' +
        '<div class="project-card-summary">' +
          '<div class="project-card-top">' +
            '<span class="project-card-name">' + esc(project.name) + '</span>' +
            '<span class="project-card-progress-text">' + doneBlocks + '/' + totalBlocks + '</span>' +
          '</div>' +
          '<div class="block-track">' + segments + '</div>' +
          '<div class="project-card-block">' +
            '<span>' + esc(blockInfo) + '</span>' +
            deadlineHtml +
          '</div>' +
        '</div>';

      // Expanded inline content
      if (isExpanded) {
        html += '<div class="project-expanded">';

        // Completed blocks (collapsed)
        if (activeIdx > 0) {
          html += '<div class="completed-blocks">';
          for (var c = 0; c < activeIdx; c++) {
            html += '<div class="completed-block">' +
              '<span class="completed-block-check"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>' +
              'Block ' + (c + 1) + ': ' + esc(project.blocks[c].name) +
            '</div>';
          }
          html += '</div>';
        }

        if (isAllDone) {
          html += '<div class="block-complete-banner">' +
            '<div class="block-complete-text">All blocks complete. Project done.</div>' +
          '</div>';
        } else {
          var block = project.blocks[activeIdx];
          var tasks = block.tasks;
          var done = tasks.filter(function(t) { return isTaskDone(t); }).length;
          var total = tasks.length;
          var pct = total > 0 ? Math.round((done / total) * 100) : 0;

          html += '<div class="focus-block-name">Block ' + (activeIdx + 1) + ': ' + esc(block.name) + '</div>';
          html += '<div class="focus-progress">' +
            '<div class="focus-bar"><div class="focus-bar-fill" style="width:' + pct + '%"></div></div>' +
            '<span class="focus-bar-text">' + done + '/' + total + '</span>' +
          '</div>';

          // Tasks
          html += '<div class="task-list">';
          tasks.forEach(function(task) {
            var isDone = isTaskDone(task);
            html += '<div class="task-item" data-task="' + task.id + '">' +
              '<button class="task-checkbox ' + (isDone ? 'checked' : '') + '" aria-label="Toggle task">' +
                (isDone ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : '') +
              '</button>' +
              '<div class="task-content">' +
                '<div class="task-text ' + (isDone ? 'is-done' : '') + '">' + esc(task.text) + '</div>' +
                (task.tag ? '<div class="task-tag">' + esc(task.tag) + '</div>' : '') +
              '</div>' +
            '</div>';
          });
          html += '</div>';

          // Locked future blocks
          if (activeIdx + 1 < project.blocks.length) {
            html += '<div class="locked-blocks">';
            for (var l = activeIdx + 1; l < project.blocks.length; l++) {
              html += '<div class="locked-block">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
                'Block ' + (l + 1) + ': ' + esc(project.blocks[l].name) +
              '</div>';
            }
            html += '</div>';
          }
        }

        html += '</div>'; // .project-expanded
      }

      html += '</div>'; // .project-card
      return html;
    }).join('');

    // Dim other cards when one is expanded
    if (expandedProjectId) {
      el.querySelectorAll('.project-card').forEach(function(card) {
        if (card.getAttribute('data-project') !== expandedProjectId) {
          card.classList.add('dimmed');
        }
      });
    }

    // Click handlers
    el.querySelectorAll('.project-card').forEach(function(card) {
      // Summary click to expand/collapse
      var summary = card.querySelector('.project-card-summary');
      summary.addEventListener('click', function() {
        var id = card.getAttribute('data-project');
        if (expandedProjectId === id) {
          expandedProjectId = null;
        } else {
          expandedProjectId = id;
        }
        renderProjectList();
      });

      // Task checkbox handlers (inside expanded)
      card.querySelectorAll('.task-checkbox').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          var taskId = btn.closest('.task-item').getAttribute('data-task');
          var project = projects.find(function(p) { return p.id === card.getAttribute('data-project'); });
          if (!project) return;
          for (var b = 0; b < project.blocks.length; b++) {
            var task = project.blocks[b].tasks.find(function(t) { return t.id === taskId; });
            if (task) { toggleTask(task); break; }
          }
          renderProjectList();
        });
      });
    });
  }

  // ── Dashboard ─────────────────────────────

  function renderDashboard() {
    if (!data) return;
    renderPipeline();
    renderCadence();
    renderPlatforms();
  }

  function renderPipeline() {
    var el = document.getElementById('pipeline-cards');
    var totalEl = document.getElementById('pipeline-total');
    if (!data.pipeline) return;

    totalEl.textContent = (data.numbers ? data.numbers.pipeline_total : '') + ' pipeline';

    el.innerHTML = data.pipeline.map(function(p) {
      var dotClass = p.status === 'active' ? 'green' : p.status === 'waiting' ? 'yellow' : 'gray';
      return '<div class="pipe-card">' +
        '<div class="pipe-card-top">' +
          '<span class="pipe-dot ' + dotClass + '"></span>' +
          '<span class="pipe-name">' + esc(p.name) + '</span>' +
        '</div>' +
        '<div class="pipe-value">' + esc(p.value) + '</div>' +
        '<div class="pipe-note">' + esc(p.note) + '</div>' +
        '<div class="pipe-type">' + esc(p.type) + '</div>' +
      '</div>';
    }).join('');
  }

  function renderCadence() {
    var el = document.getElementById('cadence-grid');
    if (!data.content_cadence) return;

    var cc = data.content_cadence;
    var channels = cc.channels;
    var brandNames = Object.keys(cc.brands);

    var headerRow = '<tr><th></th>' + brandNames.map(function(b) { return '<th>' + esc(b) + '</th>'; }).join('') + '</tr>';

    var rows = channels.map(function(ch) {
      var cells = brandNames.map(function(brand) {
        var entry = cc.brands[brand][ch];
        if (entry === null || entry === undefined) return '<td><span class="cadence-chip na">—</span></td>';
        if (entry.status === 'blocked') return '<td><span class="cadence-chip blocked">' + esc(entry.note || 'Blocked') + '</span></td>';
        if (entry.status === 'not_started') return '<td><span class="cadence-chip not-started">Not started</span></td>';
        var label = entry.done + '/' + entry.target + ' this ' + entry.period;
        var cls = entry.done >= entry.target ? 'on-track' : entry.done > 0 ? 'behind' : 'not-started';
        return '<td><span class="cadence-chip ' + cls + '">' + esc(label) + '</span></td>';
      }).join('');
      return '<tr><td>' + esc(ch) + '</td>' + cells + '</tr>';
    }).join('');

    el.innerHTML = '<table class="cadence-table"><thead>' + headerRow + '</thead><tbody>' + rows + '</tbody></table>';
  }

  function renderPlatforms() {
    var el = document.getElementById('platforms');
    if (!data.platforms) return;

    el.innerHTML = data.platforms.map(function(p) {
      return '<a href="' + esc(p.url) + '" target="_blank" rel="noopener" class="platform-card">' +
        '<div>' +
          '<div class="platform-name">' + esc(p.name) + '</div>' +
          '<div class="platform-action">' + esc(p.action) + '</div>' +
        '</div>' +
        '<span class="platform-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></span>' +
      '</a>';
    }).join('');
  }

  // ── Numbers Footer ────────────────────────

  function renderNumbers() {
    if (!data || !data.numbers) return;
    document.getElementById('num-mrr').textContent = data.numbers.mrr;
    document.getElementById('num-pipeline').textContent = data.numbers.pipeline_total;
    document.getElementById('num-costs').textContent = data.numbers.costs;
    document.getElementById('num-runway').textContent = data.numbers.runway || '—';

    var deadline = new Date(data.mission.deadline + 'T23:59:59');
    var daysLeft = Math.max(0, Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24)));
    document.getElementById('num-days').textContent = daysLeft;
  }

  // ── Socials ───────────────────────────────

  function renderSocials() {
    if (!data || !data.socials) return;
    renderSocialsKPIs();
    renderLinkedInKPIs();
    renderReplyQueue();
  }

  function renderSocialsKPIs() {
    var el = document.getElementById('socials-kpis');
    if (!data.socials.x) return;
    var k = data.socials.x.kpis;

    var items = [
      { label: 'Followers', value: k.followers },
      { label: 'Following', value: k.following },
      { label: 'Tweets', value: k.tweets },
      { label: 'Impressions', value: k.impressions },
      { label: 'Profile Visits', value: k.profile_visits }
    ];

    el.innerHTML = '<div class="kpi-grid">' + items.map(function(item) {
      return '<div class="kpi-card">' +
        '<span class="kpi-value">' + esc(String(item.value)) + '</span>' +
        '<span class="kpi-label">' + esc(item.label) + '</span>' +
      '</div>';
    }).join('') + '</div>';
  }

  function renderReplyQueue() {
    var el = document.getElementById('reply-queue');
    var queue = data.socials.reply_queue;
    if (!queue || queue.length === 0) {
      el.innerHTML = '<div class="reply-empty">No replies queued. Run Ghost replies to populate.</div>';
      return;
    }

    el.innerHTML = queue.map(function(r) {
      return '<div class="reply-card" data-reply-id="' + r.id + '">' +
        '<div class="reply-card-header">' +
          '<span class="reply-to">' + esc(r.to) + '</span>' +
          '<a href="' + esc(r.tweet_url) + '" target="_blank" rel="noopener" class="reply-link-btn">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>' +
            ' Open tweet' +
          '</a>' +
        '</div>' +
        '<div class="reply-context">' + esc(r.tweet_summary) + '</div>' +
        '<div class="reply-draft">' + esc(r.draft) + '</div>' +
        '<button class="reply-copy-btn">Copy reply</button>' +
      '</div>';
    }).join('');

    el.querySelectorAll('.reply-copy-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var card = btn.closest('.reply-card');
        var replyId = card.getAttribute('data-reply-id');
        var item = queue.find(function(r) { return r.id === replyId; });
        if (!item) return;
        navigator.clipboard.writeText(item.draft).then(function() {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(function() { btn.textContent = 'Copy reply'; btn.classList.remove('copied'); }, 2000);
        });
      });
    });
  }

  // ── Security ──────────────────────────────

  var SEC_KEY = 'mc_security'; // localStorage overrides for security todos

  var secOverrides = {};

  function loadSecOverrides() {
    var ls = _ls(); if (!ls) return;
    try { var raw = ls.getItem(SEC_KEY); if (raw) secOverrides = JSON.parse(raw); } catch(e) {}
  }

  function saveSecOverrides() {
    var ls = _ls(); if (!ls) return;
    try { ls.setItem(SEC_KEY, JSON.stringify(secOverrides)); } catch(e) {}
  }

  function isSecDone(todo) {
    if (secOverrides[todo.id] !== undefined) return secOverrides[todo.id];
    return todo.done;
  }

  function renderSecurity() {
    if (!data || !data.security) return;
    loadSecOverrides();
    renderPostureScore();
    renderMCPHealth();
    var sec = data.security;

    // Status card
    var statusEl = document.getElementById('security-status');
    var dotClass = sec.status === 'healthy' ? 'green' : sec.status === 'warning' ? 'yellow' : 'red';
    var statusLabel = sec.status.charAt(0).toUpperCase() + sec.status.slice(1);

    statusEl.innerHTML =
      '<div class="security-status-row">' +
        '<span class="security-dot ' + dotClass + '"></span>' +
        '<span class="security-status-label">' + esc(statusLabel) + '</span>' +
      '</div>' +
      '<div class="security-meta">' +
        '<span>Last audit: ' + esc(sec.last_audit) + '</span>' +
        '<span>Next review: ' + esc(sec.next_audit) + '</span>' +
      '</div>' +
      '<div class="security-summary">' + esc(sec.summary) + '</div>';

    // Todo list
    var todosEl = document.getElementById('security-todos');
    var todos = (sec.todos || []).slice().sort(function(a, b) {
      var order = { critical: 0, high: 1, medium: 2, low: 3 };
      var ai = a.urgency in order ? order[a.urgency] : 4;
      var bi = b.urgency in order ? order[b.urgency] : 4;
      return ai - bi;
    });

    if (todos.length === 0) {
      todosEl.innerHTML = '<div class="security-empty">All clear. No pending tasks.</div>';
      return;
    }

    todosEl.innerHTML = todos.map(function(todo) {
      var done = isSecDone(todo);
      return '<div class="security-todo-item" data-sec-id="' + todo.id + '">' +
        '<button class="task-checkbox ' + (done ? 'checked' : '') + '" aria-label="Toggle task">' +
          (done ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : '') +
        '</button>' +
        '<div class="security-todo-content">' +
          '<span class="security-todo-text ' + (done ? 'is-done' : '') + '">' + esc(todo.task) + '</span>' +
          '<span class="urgency-chip ' + esc(todo.urgency) + '">' + esc(todo.urgency) + '</span>' +
        '</div>' +
      '</div>';
    }).join('');

    // Checkbox handlers
    todosEl.querySelectorAll('.task-checkbox').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var id = btn.closest('.security-todo-item').getAttribute('data-sec-id');
        secOverrides[id] = !isSecDone(sec.todos.find(function(t) { return t.id === id; }));
        saveSecOverrides();
        renderSecurity();
      });
    });
  }

  // ── Finance ───────────────────────────────

  function renderFinance() {
    if (!data || !data.finance) return;
    renderFinanceSummary();
    renderFinanceRevenue();
    renderFinanceExpenses();
    renderFinanceTax();
  }

  function renderFinanceSummary() {
    var el = document.getElementById('finance-summary');
    if (!el) return;
    var f = data.finance;
    var mrrFormatted = '$' + (f.mrr_mxn / 1000).toFixed(0) + 'K MXN';
    var costsFormatted = '$' + f.costs_usd + ' USD';
    var netMxn = f.mrr_mxn - (f.costs_usd * 17); // approximate USD→MXN
    var netFormatted = '$' + (netMxn / 1000).toFixed(1) + 'K MXN';
    var runway = f.runway_months ? f.runway_months + ' mo' : '—';

    var cards = [
      { label: 'MRR', value: mrrFormatted },
      { label: 'Monthly Costs', value: costsFormatted },
      { label: 'Net (approx)', value: netFormatted },
      { label: 'Runway', value: runway }
    ];

    el.innerHTML = cards.map(function(c) {
      return '<div class="finance-card">' +
        '<span class="finance-card-value">' + esc(c.value) + '</span>' +
        '<span class="finance-card-label">' + esc(c.label) + '</span>' +
      '</div>';
    }).join('');
  }

  function renderFinanceRevenue() {
    var el = document.getElementById('finance-revenue');
    if (!el || !data.finance.revenue) return;

    el.innerHTML = data.finance.revenue.map(function(r) {
      var cfdiCls = r.cfdi ? 'active' : 'inactive';
      var cfdiLabel = r.cfdi ? 'CFDI' : 'No CFDI';
      return '<div class="revenue-row">' +
        '<span class="revenue-source">' + esc(r.source) + '</span>' +
        '<div class="revenue-right">' +
          '<span class="cfdi-badge ' + cfdiCls + '">' + cfdiLabel + '</span>' +
          '<span class="revenue-type">' + esc(r.type) + '</span>' +
          '<span class="revenue-amount">$' + r.amount.toLocaleString() + ' ' + esc(r.currency) + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function renderFinanceExpenses() {
    var el = document.getElementById('finance-expenses');
    if (!el || !data.finance.expenses) return;

    var sorted = data.finance.expenses.slice().sort(function(a, b) { return b.amount - a.amount; });

    el.innerHTML = sorted.map(function(e) {
      return '<div class="expense-row">' +
        '<span class="expense-item">' + esc(e.item) + '</span>' +
        '<div class="expense-right">' +
          '<span class="expense-category">' + esc(e.category) + '</span>' +
          '<span class="expense-amount">$' + e.amount + ' ' + esc(e.currency) + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function renderFinanceTax() {
    var el = document.getElementById('finance-tax');
    if (!el || !data.finance.tax) return;
    var t = data.finance.tax;

    var rows = [
      { label: 'Regime', value: t.regime },
      { label: 'Next Declaration', value: t.next_declaration },
      { label: 'IVA Rate', value: (t.iva_rate * 100) + '%' },
      { label: 'CFDI Status', value: t.cfdi_status.replace(/_/g, ' ') }
    ];

    var html = rows.map(function(r) {
      return '<div class="tax-row">' +
        '<span class="tax-label">' + esc(r.label) + '</span>' +
        '<span class="tax-value">' + esc(r.value) + '</span>' +
      '</div>';
    }).join('');

    // Alert if next declaration < 14 days
    if (t.next_declaration) {
      var declDate = new Date(t.next_declaration + 'T23:59:59');
      var daysUntil = Math.ceil((declDate - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntil <= 14 && daysUntil > 0) {
        html += '<div class="tax-alert">SAT declaration due in ' + daysUntil + ' days (' + t.next_declaration + ')</div>';
      }
    }

    if (t.sat_notes) {
      html += '<div class="tax-row"><span class="tax-label">Note</span><span class="tax-value">' + esc(t.sat_notes) + '</span></div>';
    }

    el.innerHTML = html;
  }

  // ── LinkedIn KPIs ────────────────────────

  function renderLinkedInKPIs() {
    var el = document.getElementById('linkedin-kpis');
    if (!el || !data.socials || !data.socials.linkedin) return;
    var k = data.socials.linkedin.kpis;

    var items = [
      { label: 'Connections', value: k.connections },
      { label: 'Posts', value: k.posts },
      { label: 'Impressions', value: k.impressions }
    ];

    el.innerHTML = '<div class="kpi-grid">' + items.map(function(item) {
      return '<div class="kpi-card">' +
        '<span class="kpi-value">' + esc(String(item.value)) + '</span>' +
        '<span class="kpi-label">' + esc(item.label) + '</span>' +
      '</div>';
    }).join('') + '</div>';
  }

  // ── Posture Score ────────────────────────

  function renderPostureScore() {
    var el = document.getElementById('posture-score');
    if (!el || !data.security || data.security.posture_score == null) return;
    var score = data.security.posture_score;
    var color = score >= 80 ? 'var(--dot-green)' : score >= 50 ? 'var(--dot-yellow)' : 'var(--dot-red)';

    el.innerHTML =
      '<span class="posture-number" style="color:' + color + '">' + score + '</span>' +
      '<div style="flex:1;display:flex;flex-direction:column;gap:4px">' +
        '<div class="posture-bar-wrap">' +
          '<div class="posture-bar-fill" style="width:' + score + '%;background:' + color + '"></div>' +
        '</div>' +
        '<span class="posture-label">' + (score >= 80 ? 'Strong' : score >= 50 ? 'Needs Attention' : 'Critical') + '</span>' +
      '</div>';
  }

  // ── MCP Health ───────────────────────────

  function renderMCPHealth() {
    var el = document.getElementById('mcp-health');
    if (!el || !data.security || !data.security.mcp_health) return;

    el.innerHTML = data.security.mcp_health.map(function(m) {
      var dotColor = m.status === 'running' ? 'var(--dot-green)' : m.status === 'unknown' ? 'var(--dot-yellow)' : 'var(--dot-red)';
      return '<div class="mcp-card">' +
        '<span class="mcp-dot" style="background:' + dotColor + '"></span>' +
        '<span class="mcp-name">' + esc(m.name) + '</span>' +
        '<span class="mcp-status">' + esc(m.status) + '</span>' +
      '</div>';
    }).join('');
  }

  // ── Activity Log ─────────────────────────

  function renderActivity() {
    var el = document.getElementById('agent-activity');
    if (!el) return;
    var log = (data && data.agent_log) ? data.agent_log : [];

    if (log.length === 0) {
      el.innerHTML = '<div class="activity-empty">No agent activity yet. Invoke an agent to see updates here.</div>';
      return;
    }

    el.innerHTML = log.map(function(entry) {
      var agentClass = entry.agent || 'system';
      var timeStr = '';
      if (entry.timestamp) {
        var d = new Date(entry.timestamp);
        var now = new Date();
        var diffMs = now - d;
        var diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) timeStr = 'just now';
        else if (diffMin < 60) timeStr = diffMin + 'm ago';
        else if (diffMin < 1440) timeStr = Math.floor(diffMin / 60) + 'h ago';
        else timeStr = Math.floor(diffMin / 1440) + 'd ago';
      }

      return '<div class="activity-item">' +
        '<span class="activity-dot ' + esc(agentClass) + '"></span>' +
        '<div class="activity-body">' +
          '<div class="activity-header">' +
            '<span class="activity-agent">' + esc(entry.agent) + '</span>' +
            '<span class="activity-time">' + esc(timeStr) + '</span>' +
          '</div>' +
          '<div class="activity-action">' + esc(entry.action) + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // ── Utilities ─────────────────────────────

  function esc(str) {
    if (str == null) return '';
    var div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  function formatISO(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function formatDate(d) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  // ── Boot ──────────────────────────────────

  document.addEventListener('DOMContentLoaded', initGate);

})();
