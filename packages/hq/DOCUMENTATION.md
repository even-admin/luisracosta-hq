# Mission Control HQ — Documentation

Last updated: 2026-04-08

## What This Is

Mission Control is a password-gated operational dashboard for Luis Ramírez Acosta's solo operation at EVEN Venture Studio. It is the visual representation of the entire business — sprint blocks, pipeline, content, finances, security, and agent activity — all in one static HTML interface deployed to `hq.luisracosta.com` via GitHub Pages.

It is designed to be the two-way bridge between Luis and his AI agent team (the Ghost Executive Team, running as Claude Code subagents). Agents update `state.json`, push to git, GitHub Pages deploys, Luis clicks Sync — the dashboard reflects the current state of the operation.

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Claude Code (local)                             │
│                                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ Eve  │ │Ghost │ │ Onyx │ │ Dex  │ │ Luca │  │
│  │ COO  │ │ CTO  │ │ CMO  │ │ Sec  │ │ CFO  │  │
│  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘  │
│     │        │        │        │        │       │
│     └────────┴────────┴────────┴────────┘       │
│                      │                           │
│              state.json (write)                   │
│                      │                           │
│              git commit + push                    │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
              GitHub (main branch)
                       │
                       ▼
              GitHub Pages (auto-deploy)
                       │
                       ▼
              hq.luisracosta.com
                       │
                       ▼
              Luis clicks [Sync] button
                       │
                       ▼
              Dashboard re-renders from state.json
```

### Tech Stack

- **Static HTML/CSS/JS** — no frameworks, no build tools, no dependencies
- **Vanilla JS** (689→1100+ lines) — all rendering, state management, forms
- **GitHub Pages** — auto-deploys from `main` branch on push to `packages/hq/**`
- **localStorage** — persists interactive data (finance transactions, task overrides)
- **state.json** — single source of truth for agent-managed data
- **ops.md** — markdown source of truth for sprint blocks/tasks

### File Map

```
packages/hq/
├── index.html          ← Page structure, all 6 tab views
├── app.js              ← All logic: auth, parsing, rendering, forms, sync
├── style.css           ← Full design system: B&W, Instrument Serif + Satoshi
├── data/
│   ├── state.json      ← Agent-managed operational state (schema v3)
│   └── ops.md          ← Sprint blocks in markdown format
└── DOCUMENTATION.md    ← This file
```

---

## Data Flow

### Two Data Sources

1. **state.json** — JSON file managed by agents. Contains mission, pipeline, finances, socials, security, and the agent activity log. Agents read it, modify their owned sections, commit, and push. The dashboard fetches it on load and on Sync.

2. **ops.md** — Markdown file containing sprint blocks. Parsed by `app.js` into a hierarchy of projects → blocks → tasks. This is the source of truth for the Blocks tab.

### Two Persistence Layers

1. **state.json** (server-side via git) — shared between agents and dashboard. Agents write, dashboard reads. Changes propagate through: agent writes → git push → GitHub Pages deploy → Sync button fetches.

2. **localStorage** (client-side in browser) — used for interactive data that the user manages directly in the dashboard:
   - `hq_income` — income transactions (Finance tab)
   - `hq_expenses` — expense transactions (Finance tab)
   - `hq_trials` — free trial watchlist (Finance tab)
   - `mc_tasks` — task checkbox overrides (Blocks tab)
   - `mc_security` — security todo checkbox overrides (Security tab)
   - `hq_finance_seed_v` — seed version tracker (triggers re-seed when state.json data changes)
   - `hq_theme` — dark/light mode preference
   - `hq_auth` (sessionStorage) — authentication state

### Seed Versioning

The finance data in localStorage is initially seeded from `state.json`. When the `seed_version` field in `state.json.finance` is incremented, the dashboard wipes localStorage finance data and re-seeds from state.json. This allows agents (via Luca) to push corrected baseline data that overrides whatever the user had locally.

Current seed version: **3**

---

## Authentication

SHA-256 password gate. The hash is hardcoded in `app.js`. Fallback password: `even2026`. Session stored in `sessionStorage` (cleared when browser tab closes). No server-side auth — this is a static site.

---

## The 6 Tabs

### 1. Blocks (default)

**Purpose:** Focus-mode sprint management. One active block at a time per project.

**Data source:** `ops.md` (parsed) + `state.json.mission` (deadline/weeks)

**Sections:**
- **Mission Hero** — target ("Close a $50-100K MXN project"), deadline countdown, 4-week progress bar with labeled phases (Foundation → Visibility → Pipeline → Close)
- **Project List** — expandable project cards showing block progress bars. Click to expand and see tasks with checkboxes.

**Mechanics:**
- ops.md format: `## Project` → `### Block N: Name` → `- [ ] Task text`
- Blocks are sequential — locked blocks shown with lock icon, completed blocks shown with checkmark
- Task checkboxes persist to localStorage as overrides (ops.md remains source of truth)
- When all tasks in a block are done, next block unlocks

**Agent connection:** Eve (COO) owns `mission` in state.json. She updates the target, deadline, and weekly breakdown. ops.md is edited directly by whoever manages sprint planning.

### 2. Dashboard

**Purpose:** Pipeline visibility, content tracking, client acquisition.

**Data source:** `state.json.pipeline`, `state.json.content_cadence`, `state.json.platforms`

**Sections:**
- **Pipeline** — horizontal scrolling cards for each deal/client. Color-coded status dots: green (active), yellow (waiting), gray (paused). Shows value, note, type (project/retainer).
- **Content Cadence** — matrix table: 3 brands (luisracosta.com, fold.mx, Dr. Ramírez) × 6 channels (X, LinkedIn, Newsletter, Instagram, Blog, Reviews). Shows progress chips (done/target per period).
- **Client Hunting** — link cards to job platforms (Upwork, LinkedIn, vibecoding.work, Arc.dev, Fractional Jobs). Opens in new tab.

**Agent connections:**
- Eve owns `pipeline` and `platforms` — updates deal status, adds new prospects
- Onyx owns `content_cadence` — updates done counts after publishing content

### 3. Socials

**Purpose:** Social media KPIs and engagement queue.

**Data source:** `state.json.socials`

**Sections:**
- **X KPIs** — grid of metric cards: followers, following, tweets, impressions, profile visits
- **LinkedIn KPIs** — connections, posts, impressions
- **Reply Queue** — pre-drafted replies with tweet context, copy-to-clipboard functionality, and direct link to the original tweet

**Agent connection:** Onyx (CMO) owns the entire `socials` section. After running the Ghost Replies playbook (fetching tweets from target accounts, drafting replies, publishing), Onyx updates KPIs and the reply queue in state.json.

**Workflow:** Onyx drafts replies → Luis approves → Onyx publishes via X MCP → updates state.json → pushes. Luis can also use the Reply Queue manually: copy draft → open tweet link → paste → reply.

### 4. Finance

**Purpose:** Full interactive accounting ledger. Tracks every peso in and out.

**Data source:** localStorage (`hq_income`, `hq_expenses`, `hq_trials`), seeded from `state.json.finance`

**Sections:**
- **Summary Cards** — 4 cards: Income this month (MXN), Expenses this month (MXN), Net (green if positive, red if negative), Transaction count
- **Income** — full CRUD table. Add/edit/delete income entries. Fields: date, source, description, amount, currency (MXN/USD), category (retainer/project/one-time), status (received/pending/overdue). Edit via pencil icon, delete via x.
- **Expenses** — full CRUD table. Fields: date, vendor, description, amount, currency, category (tools/business/personal/travel), deductible flag. Sorted by date descending.
- **Monthly Summary** — auto-calculated table grouped by YYYY-MM. Columns: income, expenses, net, IVA (16%). Total row at bottom.
- **Free Trials Watchlist** — add/delete list of $0.00 charges to monitor. Yellow dot indicators. Fields: vendor, since date, note.
- **Tax Calendar** — SAT monthly declaration deadlines (17th of each month), annual declaration, CFDI status. Alert banner when a deadline is < 14 days away. Shows regime (Persona Física con Actividad Empresarial), IVA rate (16%).

**Agent connection:** Luca (CFO) owns `finance` and `numbers` in state.json. Luca provides the seed data (baseline revenue, expenses, free trials). When Luca updates state.json and bumps `seed_version`, the dashboard re-seeds localStorage with fresh data. The user can then modify locally (add transactions, delete trials, etc.).

**Design decision:** Finance transactions live in localStorage (not state.json) because they're high-frequency user interactions. An agent shouldn't overwrite what the user just entered. state.json provides the baseline; localStorage provides the working copy.

### 5. Security

**Purpose:** Security posture monitoring, vulnerability tracking, MCP infrastructure health.

**Data source:** `state.json.security`

**Sections:**
- **Posture Score** — numeric score (0-100) with color-coded progress bar. Green (80+), yellow (50-79), red (<50). Label: Strong / Needs Attention / Critical.
- **Security Status** — card showing status (Healthy/Warning/Critical), last audit date, next review date, summary of findings.
- **MCP Health** — grid of cards for each MCP server (xmcp, linkedin, slack). Color-coded dots: green (running), yellow (unknown), red (down).
- **Remaining Tasks** — urgency-sorted todo list with checkboxes. Tags: critical (red), high (orange), medium, low. Checkboxes persist to localStorage.

**Agent connection:** Dex (Security) owns the entire `security` section. After running audits, Dex updates posture_score, mcp_health status, and the todo list. Dex also monitors credential file permissions, settings.local.json allowlist, and MCP service health.

### 6. Activity

**Purpose:** Agent activity feed — what each agent did and when.

**Data source:** `state.json.agent_log`

**Sections:**
- **Agent Log** — reverse chronological feed. Each entry shows: color-coded dot (matches agent color), agent name, action description, relative timestamp (Xm/Xh/Xd ago).

**Agent colors:**
| Agent | Color | Dot |
|-------|-------|-----|
| Eve | Purple | `#A855F7` |
| Ghost | Green | `#22C55E` |
| Onyx | Orange | `#F97316` |
| Dex | Red | `#EF4444` |
| Luca | Cyan | `#06B6D4` |
| system | Gray | `var(--text-muted)` |

**Agent connection:** ALL agents append to `agent_log` as part of their update protocol. The log is capped at 50 entries (newest first). This creates a unified audit trail of everything the team has done.

---

## Global Elements

### Sync Button

The refresh icon button in the header. Fetches `state.json` with a cache-busting query parameter (`?t=timestamp`), re-renders all sections. Visual feedback: spinning animation while fetching, green border flash on success.

**Why manual, not auto-polling:** GitHub Pages has a CDN cache (up to 10 minutes). Auto-polling would mostly hit stale cache. Manual sync is intentional — Luis clicks it when he knows an agent just ran. Zero wasted requests.

### Dark Mode Toggle

Persists preference to `localStorage.hq_theme`. Uses CSS `data-theme="dark"` attribute on `<html>`. Full dark palette defined in CSS variables.

### Numbers Footer

Fixed strip at the bottom of every tab. Shows: MRR, Pipeline total, Monthly costs, Runway, Days left (countdown to mission deadline). Data from `state.json.numbers` (owned by Luca) and computed days from `state.json.mission.deadline`.

---

## The Ghost Executive Team

5 Claude Code subagents at `~/.claude/agents/`. Each owns specific sections of state.json.

### Ownership Map (state.json)

```
state.json
├── schema_version ........... system
├── last_updated ............. all agents (on every write)
├── mission .................. Eve (COO)
├── pipeline ................. Eve (COO)
├── platforms ................ Eve (COO)
├── content_cadence .......... Onyx (CMO)
├── socials .................. Onyx (CMO)
├── numbers .................. Luca (CFO)
├── finance .................. Luca (CFO)
├── security ................. Dex (Security)
├── agent_log ................ all agents (append only)
└── [code changes] ........... Ghost (CTO) — builds the dashboard itself
```

### Update Protocol (every agent follows this)

```
1. Read  state.json
2. Modify ONLY owned sections
3. Update root last_updated timestamp
4. Append entry to agent_log (cap at 50)
5. Write state.json
6. git add packages/hq/data/state.json
7. git commit -m "[hq] <agent>: <description>"
8. git push
```

### Agent Profiles

| Agent | Model | Memory | MCPs | Domain |
|-------|-------|--------|------|--------|
| **Eve** | Sonnet | user | — | Orchestration, pipeline, knowledge base, client docs, delegation |
| **Ghost** | Opus | project | Claude Preview | All code: dashboard, websites, apps, infrastructure |
| **Onyx** | Opus | user | xmcp, linkedin | Content, X engagement, LinkedIn, articles, SEO |
| **Dex** | Sonnet | project | — | Security audits, MCP management, credential hardening |
| **Luca** | Sonnet | project | — | Bookkeeping, cash flow, tax compliance, expense tracking |

### Model Selection Reasoning

- **Opus** for Ghost and Onyx — they do the hardest work (code architecture, voice-accurate ghostwriting in Luis's Spanish). Quality matters more than speed here.
- **Sonnet** for Eve, Dex, Luca — operational/analytical work where speed matters. Audits, state updates, financial calculations don't need Opus-level reasoning.

### Memory Scope Reasoning

- **user** memory (Eve, Onyx) — learnings about Luis's preferences, voice, and client patterns carry across all projects.
- **project** memory (Ghost, Dex, Luca) — technical patterns, security posture, and financial data are specific to this project/operation.

---

## state.json Schema (v3)

```json
{
  "schema_version": 3,
  "last_updated": "ISO-8601 with CST offset",

  "mission": {
    "target": "string",
    "deadline": "YYYY-MM-DD",
    "weeks": [{ "num": 1, "name": "Phase", "start": "date", "end": "date" }]
  },

  "pipeline": [
    { "name": "", "value": "", "status": "active|waiting|paused", "note": "", "type": "project|retainer" }
  ],

  "content_cadence": {
    "channels": ["X/Twitter", "LinkedIn", ...],
    "brands": {
      "brand_name": {
        "channel": { "target": N, "done": N, "period": "week|month", "status": "..." } | null
      }
    }
  },

  "platforms": [{ "name": "", "action": "", "url": "" }],

  "numbers": { "mrr": "", "pipeline_total": "", "costs": "", "runway": "" },

  "finance": {
    "seed_version": 3,
    "revenue": [{ "source": "", "amount": N, "currency": "MXN|USD", "type": "", "cfdi": bool }],
    "expenses": [{ "item": "", "amount": N, "currency": "", "date": "", "category": "" }],
    "free_trials": [{ "vendor": "", "since": "date", "note": "" }],
    "mrr_mxn": N,
    "costs_mxn": N,
    "tax": { "regime": "", "next_declaration": "date", "iva_rate": 0.16, "cfdi_status": "", "sat_notes": "" },
    "last_reconciled": "date|null"
  },

  "socials": {
    "x": { "handle": "", "kpis": { "followers": N, "following": N, "tweets": N, "impressions": "", "profile_visits": "" } },
    "linkedin": { "handle": "", "kpis": { "connections": "", "posts": "", "impressions": "" } },
    "reply_queue": [{ "id": "", "to": "", "tweet_summary": "", "tweet_url": "", "draft": "" }]
  },

  "security": {
    "posture_score": 0-100,
    "last_audit": "date",
    "next_audit": "date",
    "status": "healthy|warning|critical",
    "summary": "",
    "mcp_health": [{ "name": "", "status": "running|unknown|down", "checked": "timestamp|null" }],
    "todos": [{ "id": "", "task": "", "urgency": "critical|high|medium|low", "done": bool }]
  },

  "agent_log": [
    { "agent": "eve|ghost|onyx|dex|luca|system", "action": "", "timestamp": "ISO-8601" }
  ]
}
```

---

## Design System

- **Fonts:** Instrument Serif (headings, italic), Satoshi (body, UI)
- **Colors:** B&W monochromatic. No shadows, no gradients. Status dots use semantic colors (green/yellow/red).
- **Border radius:** 16px on cards, 8px on inputs, 4px on tags
- **Transitions:** 180ms `cubic-bezier(0.16, 1, 0.3, 1)` on all interactive elements
- **Dark mode:** Full dark palette via CSS custom properties on `[data-theme="dark"]`
- **Responsive:** Stacks at 768px. Finance summary goes 2×2 on mobile.

---

## Deployment

- **Trigger:** Push to `main` branch touching `packages/hq/**`
- **Workflow:** `.github/workflows/deploy-hq.yml` → GitHub Pages artifact upload → live at `hq.luisracosta.com`
- **Local dev:** `python3 -m http.server 8090 -d packages/hq` or Claude Preview via launch.json

---

## How to Invoke Agents

After restarting Claude Code or running `/agents`:

```
@eve status update          → operational state across all projects
@eve update pipeline        → modify pipeline deals in state.json
@ghost fix the hero         → code changes to dashboard
@onyx ghost replies         → daily X engagement cycle
@onyx tweet about [topic]   → draft + publish tweet
@dex audit                  → security review, update posture score
@luca financial status      → report on current finances
@luca add expense [details] → update finance baseline in state.json
```

Or describe what you need in natural language — Claude routes to the right agent based on the description field in each agent's frontmatter.
