/* ============================================
   HQ — Mission Control Dashboard
   Pure vanilla JS — no dependencies
   ============================================ */

(function () {
  'use strict';

  // SHA-256 hash of "even2026"
  const HASH = '526f5f655785ee7230d6679e465f1b046e223e5502a646db9fc7d851bd224b45';
  const AUTH_KEY = 'hq_auth';

  // Session persistence with fallback for restricted contexts
  let _memAuth = false;
  const _ss = (function() { try { const k = 'session' + 'Storage'; return window[k]; } catch(e) { return null; } })();
  function getAuth() {
    try { return _ss && _ss.getItem(AUTH_KEY) === 'true'; } catch(e) { return _memAuth; }
  }
  function setAuth() {
    _memAuth = true;
    try { if (_ss) _ss.setItem(AUTH_KEY, 'true'); } catch(e) { /* ignore */ }
  }

  // ── Password Gate ──────────────────────────

  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function showDashboard() {
    document.getElementById('gate').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    loadData();
  }

  function initGate() {
    // Check session
    if (getAuth()) {
      showDashboard();
      return;
    }

    const form = document.getElementById('gate-form');
    const input = document.getElementById('gate-input');
    const error = document.getElementById('gate-error');

    input.focus();

    async function tryLogin() {
      const value = input.value;
      if (!value) return;

      let match = false;
      try {
        const hash = await sha256(value);
        match = (hash === HASH);
      } catch(e) {
        // crypto.subtle not available (HTTP context) — fallback
        match = (value === 'even2026');
      }

      if (match) {
        setAuth();
        showDashboard();
      } else {
        error.textContent = 'Invalid password';
        input.value = '';
        input.focus();
        setTimeout(() => { error.textContent = ''; }, 2000);
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      tryLogin();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        tryLogin();
      }
    });
  }

  // ── Data Loading ───────────────────────────

  async function loadData() {
    try {
      const res = await fetch('data/state.json');
      if (!res.ok) throw new Error('Failed to load state.json');
      const data = await res.json();
      render(data);
    } catch (err) {
      console.error('Error loading data:', err);
      document.querySelector('.main').innerHTML =
        '<p style="color:var(--text-muted);font-family:var(--font-mono);font-size:13px;">Error loading data.</p>';
    }
  }

  // ── Render ─────────────────────────────────

  function render(data) {
    renderHeader(data);
    renderProgressLog(data.progress_log);
    renderTimeline(data.key_dates);
    renderArticles(data.articles);
    renderContentQueue(data.content_queue);
    renderPipeline(data.pipeline);
    renderClients(data.clients);
    renderIdeas(data.ideas);
    renderTeam(data.team);
  }

  // ── Header ─────────────────────────────────

  function renderHeader(data) {
    const el = document.getElementById('last-updated');
    if (data.last_updated) {
      const d = new Date(data.last_updated);
      el.textContent = 'Updated ' + formatDateTime(d);
    }
  }

  // ── Timeline ───────────────────────────────

  function renderTimeline(dates) {
    const container = document.getElementById('timeline');
    if (!dates || dates.length === 0) {
      container.innerHTML = '<p class="empty-state">No upcoming dates.</p>';
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = formatISODate(today);

    container.innerHTML = dates.map(item => {
      const itemDate = new Date(item.date + 'T00:00:00');
      let cls = 'timeline-item';

      if (item.date === todayStr) {
        cls += ' is-today';
      } else if (itemDate < today) {
        cls += ' is-past';
      }

      // Find next upcoming
      const isNext = !dates.some(d => d.date === todayStr) &&
                     itemDate > today &&
                     !dates.filter(d => new Date(d.date + 'T00:00:00') > today && new Date(d.date + 'T00:00:00') < itemDate).length;

      if (isNext) cls += ' is-next';

      return `
        <div class="${cls}">
          <span class="timeline-date">${formatShortDate(itemDate)}</span>
          <span class="timeline-dot"></span>
          <span class="timeline-event">${esc(item.event)}</span>
        </div>
      `;
    }).join('');
  }

  // ── Articles ───────────────────────────────

  function renderArticles(articles) {
    const container = document.getElementById('articles');
    if (!articles || articles.length === 0) {
      container.innerHTML = '<p class="empty-state">No articles.</p>';
      return;
    }

    container.innerHTML = articles.map(article => {
      const badgeClass = article.status === 'published' ? 'badge-published' :
                         article.status === 'rewritten' ? 'badge-rewritten' :
                         article.status === 'rewriting' ? 'badge-rewriting' :
                         article.status === 'pending_review' ? 'badge-pending' :
                         article.status === 'approved' ? 'badge-approved' :
                         article.status === 'brief' ? 'badge-brief' : 'badge-draft';

      const statusLabel = article.status === 'pending_review' ? 'pending review' :
                          article.status.replace(/_/g, ' ');

      const previewUrl = article.preview_url || article.url || (article.file ? article.file : null);
      const titleContent = previewUrl
        ? `<a href="${esc(previewUrl)}" target="_blank" rel="noopener">${esc(article.title)}</a>`
        : esc(article.title);

      const subtitleHtml = article.subtitle
        ? `<div class="article-subtitle">${esc(article.subtitle)}</div>` : '';

      const reviewActions = article.status === 'pending_review'
        ? `<div class="review-actions">
             <button class="btn-approve" data-id="${article.id}" onclick="event.stopPropagation(); window._approveArticle(${article.id})">Approve</button>
             <button class="btn-reject" data-id="${article.id}" onclick="event.stopPropagation(); window._rejectArticle(${article.id})">Needs work</button>
           </div>` : '';

      const readLink = previewUrl
        ? `<a href="${esc(previewUrl)}" target="_blank" rel="noopener" class="article-read-link">Read &rarr;</a>`
        : '';

      const liveLink = article.url
        ? `<a href="${esc(article.url)}" target="_blank" rel="noopener" class="article-live-link">Live &uarr;</a>`
        : '';

      return `
        <div class="article-card ${article.status === 'pending_review' ? 'pending-review' : ''}" onclick="this.classList.toggle('expanded')">
          <div class="article-top">
            <span class="article-title">${titleContent}</span>
            <span class="badge ${badgeClass}">${esc(statusLabel)}</span>
          </div>
          ${subtitleHtml}
          <div class="article-meta">
            <span class="article-meta-item">${esc(article.version)}</span>
            ${article.words > 0 ? `<span class="article-meta-item">${article.words.toLocaleString()} words</span>` : ''}
            <span class="article-meta-item">#${article.id}</span>
            ${readLink}
            ${liveLink}
          </div>
          <div class="article-summary">${esc(article.summary)}</div>
          ${article.notes ? `<div class="article-notes">${esc(article.notes)}</div>` : ''}
          ${reviewActions}
        </div>
      `;
    }).join('');
  }

  // Article approval/rejection handlers (state is local-only)
  window._approveArticle = function(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    if (card) {
      const articleCard = card.closest('.article-card');
      const badge = articleCard.querySelector('.badge');
      badge.className = 'badge badge-approved';
      badge.textContent = 'approved';
      articleCard.classList.remove('pending-review');
      articleCard.classList.add('approved');
      const actions = articleCard.querySelector('.review-actions');
      if (actions) actions.innerHTML = '<span class="review-confirmed">Marked for publishing</span>';
    }
  };

  window._rejectArticle = function(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    if (card) {
      const articleCard = card.closest('.article-card');
      const badge = articleCard.querySelector('.badge');
      badge.className = 'badge badge-draft';
      badge.textContent = 'needs work';
      articleCard.classList.remove('pending-review');
      const actions = articleCard.querySelector('.review-actions');
      if (actions) actions.innerHTML = '<span class="review-confirmed">Flagged for revision</span>';
    }
  };

  // ── Content Queue ──────────────────────────

  function renderContentQueue(queue) {
    const container = document.getElementById('content-queue');
    if (!queue || queue.length === 0) {
      container.innerHTML = '<p class="empty-state">Queue empty.</p>';
      return;
    }

    container.innerHTML = queue.map(item => {
      const badgeClass = item.status === 'ready' ? 'badge-ready' :
                         item.status === 'done' ? 'badge-published' : 'badge-draft';

      let scheduledStr = '';
      if (item.scheduled) {
        const d = new Date(item.scheduled);
        scheduledStr = formatDateTime(d);
      }

      return `
        <div class="queue-card">
          <div class="queue-header">
            <span class="queue-title">${esc(item.title)}</span>
            <div style="display:flex;align-items:center;gap:8px;">
              <span class="badge ${badgeClass}">${esc(item.status)}</span>
              ${scheduledStr ? `<span class="queue-scheduled">${scheduledStr}</span>` : ''}
            </div>
          </div>
          <p class="queue-desc">${esc(item.description)}</p>
          <p class="queue-type">${esc(item.type)}</p>
        </div>
      `;
    }).join('');
  }

  // ── Pipeline ───────────────────────────────

  function renderPipeline(pipeline) {
    const container = document.getElementById('pipeline');
    if (!pipeline) {
      container.innerHTML = '<p class="empty-state">No pipeline data.</p>';
      return;
    }

    const rows = (pipeline.breakdown || []).map(deal => {
      const badgeClass = deal.status === 'awaiting_confirmation' ? 'badge-awaiting' :
                         deal.status === 'early_stage' ? 'badge-early' :
                         deal.status === 'active' ? 'badge-active' : 'badge-draft';
      const statusLabel = deal.status.replace(/_/g, ' ');

      return `
        <tr>
          <td class="pipeline-client">${esc(deal.client)}</td>
          <td class="pipeline-value">${esc(deal.value)}</td>
          <td><span class="badge ${badgeClass}">${esc(statusLabel)}</span></td>
          <td class="pipeline-notes">${esc(deal.notes)}</td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <div>
        <span class="pipeline-total-label">Total Pipeline</span>
        <div class="pipeline-total">${esc(pipeline.total_value)}</div>
      </div>
      <div class="pipeline-table-wrap">
        <table class="pipeline-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Value</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  // ── Clients ────────────────────────────────

  function renderClients(clients) {
    const container = document.getElementById('clients');
    if (!clients || clients.length === 0) {
      container.innerHTML = '<p class="empty-state">No active clients.</p>';
      return;
    }

    container.innerHTML = clients.map(client => {
      const badgeClass = client.status === 'active' ? 'badge-active' : 'badge-draft';

      return `
        <div class="client-card">
          <div class="client-header">
            <span class="client-name">${esc(client.name)}</span>
            <span class="badge ${badgeClass}">${esc(client.status)}</span>
          </div>
          <div class="client-details">
            <div>
              <span class="client-detail-label">Type</span>
              <span class="client-detail">${esc(client.type)}</span>
            </div>
            <div>
              <span class="client-detail-label">Value</span>
              <span class="client-value">${esc(client.value)}</span>
            </div>
            ${client.website ? `<a href="${esc(client.website)}" target="_blank" rel="noopener" class="client-link">${esc(client.website)}</a>` : ''}
          </div>
          ${client.notes ? `<div class="client-notes">${esc(client.notes)}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  // ── Ideas ──────────────────────────────────

  function renderIdeas(ideas) {
    const container = document.getElementById('ideas');
    if (!ideas || ideas.length === 0) {
      container.innerHTML = '<p class="empty-state">No ideas yet.</p>';
      return;
    }

    container.innerHTML = ideas.map(idea => {
      const badgeClass = idea.status === 'raw_idea' ? 'badge-raw' :
                         idea.status === 'developing' ? 'badge-developing' :
                         idea.status === 'ready' ? 'badge-ready' : 'badge-draft';
      const statusLabel = idea.status.replace(/_/g, ' ');

      const linkedArticle = idea.has_article
        ? `<span class="idea-linked">Linked to Article #${idea.article_id}</span>` : '';

      return `
        <div class="idea-card ${idea.status === 'developing' ? 'developing' : ''}">
          <div class="idea-header">
            <span class="idea-title">${esc(idea.title)}</span>
            <span class="badge ${badgeClass}">${esc(statusLabel)}</span>
          </div>
          <p class="idea-summary">${esc(idea.summary)}</p>
          <div class="idea-footer">
            ${idea.origin ? `<span class="idea-origin">${esc(idea.origin)}</span>` : ''}
            ${linkedArticle}
          </div>
        </div>
      `;
    }).join('');
  }

  // ── Team ───────────────────────────────────

  function renderTeam(team) {
    const container = document.getElementById('team');
    if (!team || !team.members) {
      container.innerHTML = '<p class="empty-state">No team data.</p>';
      return;
    }

    container.innerHTML = team.members.map(member => {
      return `
        <div class="team-card">
          <div class="team-tag">${esc(member.tag)}</div>
          <div class="team-info">
            <span class="team-name">${esc(member.name)}</span>
            <span class="team-role">${esc(member.role)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // ── Progress Log ──────────────────────────

  function renderProgressLog(log) {
    const container = document.getElementById('progress-log');
    if (!container) return;
    if (!log || log.length === 0) {
      container.innerHTML = '<p class="empty-state">No activity logged.</p>';
      return;
    }

    container.innerHTML = log.map(entry => {
      const items = entry.entries.map(e => `<li>${esc(e)}</li>`).join('');
      return `
        <div class="log-entry">
          <div class="log-header">
            <span class="log-date">${esc(entry.date)}</span>
            <span class="log-agent">${esc(entry.agent)}</span>
          </div>
          <ul class="log-list">${items}</ul>
        </div>
      `;
    }).join('');
  }

  // ── Utilities ──────────────────────────────

  function esc(str) {
    if (str == null) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  function formatISODate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function formatShortDate(d) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  }

  function formatDateTime(d) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${h12}:${m} ${ampm}`;
  }

  // ── Init ───────────────────────────────────

  // ── Theme Toggle ───────────────────────────

  let _themeState = 'light';
  function _ls() { try { return window.localStorage; } catch(e) { return null; } }

  function initTheme() {
    const ls = _ls();
    const saved = ls ? ls.getItem('hq_theme') : null;
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      _themeState = 'dark';
    }

    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
          document.documentElement.removeAttribute('data-theme');
          _themeState = 'light';
          try { var s = _ls(); if(s) s.setItem('hq_theme', 'light'); } catch(e) {}
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          _themeState = 'dark';
          try { var s = _ls(); if(s) s.setItem('hq_theme', 'dark'); } catch(e) {}
        }
      });
    }
  }

  // ── Prompt Bar ─────────────────────────────

  function initPromptBar() {
    const form = document.getElementById('prompt-form');
    const input = document.getElementById('prompt-input');
    if (!form || !input) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const msg = input.value.trim();
      if (!msg) return;

      // Build Perplexity Computer URL with the prompt pre-filled
      const baseUrl = 'https://www.perplexity.ai/search/new';
      const params = new URLSearchParams({ q: msg, mode: 'concierge' });
      const url = baseUrl + '?' + params.toString();

      // Open in new tab
      window.open(url, '_blank');

      // Clear input
      input.value = '';
    });
  }

  // ── Init ───────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initGate();
    initPromptBar();
  });

})();
