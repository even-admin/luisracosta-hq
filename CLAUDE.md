# CLAUDE.md — luisracosta-hq

## What This Repo Is

This is the master ecosystem repository for Luis Alberto Ramírez Acosta. Everything that is "Luis-facing" lives here: personal website, Mission Control HQ, articles, newsletter, landing pages, knowledge base.

This is NOT a client project repo. Client projects (Terra58, Dr. Ramírez, etc.) live in their own repos. This is the operator's cockpit.

## Owner

**Luis Alberto Ramírez Acosta** — CEO, EVEN Venture Studio. Based in Mérida, Yucatán, Mexico.
- AI-native Technical Co-Founder as a Service (FIRMA23 model)
- One operator + AI leverage = output of a 5-8 person team
- Clients: capital-backed founders and business families in Mexico/LatAm

## Stack

- **Perplexity Computer** ($200/mo) — strategy, research, intelligence, deliverables (external to this repo)
- **Claude Code** ($100-200/mo) — build layer, this repo's CTO
- **Paperclip** (free, open-source) — project management + agent orchestration
- **GitHub Pages** — hosting for static sites (luisracosta.com, hq.luisracosta.com)

## Monorepo Structure

```
luisracosta-hq/
├── CLAUDE.md                    ← You are here
├── .paperclip/                  ← Paperclip agent configs (do not modify without board approval)
│   ├── company.json             ← Mission, goals, budget
│   ├── agents/                  ← Agent persona files
│   └── routines/                ← Scheduled recurring tasks
├── packages/
│   ├── website/                 ← luisracosta.com — personal site
│   │   ├── index.html           ← Homepage
│   │   ├── style.css            ← Main styles
│   │   ├── base.css             ← Reset/base styles
│   │   ├── *.html               ← Article pages
│   │   └── CNAME                ← Custom domain config
│   ├── hq/                      ← Mission Control HQ dashboard
│   │   ├── index.html           ← Dashboard UI
│   │   ├── app.js               ← Dashboard logic
│   │   ├── style.css            ← Dashboard styles
│   │   ├── data/state.json      ← Live state (articles, clients, pipeline)
│   │   ├── preview/             ← Internal article previews (not public)
│   │   └── drafts/              ← Draft markdown files
│   ├── articles/                ← Article source files (markdown)
│   │   ├── published/           ← Live on luisracosta.com
│   │   ├── drafts/              ← In progress or awaiting approval
│   │   └── research/            ← Research briefs, data, tone audits
│   ├── newsletter/              ← Newsletter templates and archives (future)
│   └── landing-pages/           ← Client-facing or campaign landing pages (future)
├── knowledge/                   ← Modular knowledge docs (one per domain)
│   ├── 00-index.md              ← Master index
│   ├── 01-identity.md           ← Who Luis is
│   ├── 02-family.md
│   ├── 03-health.md
│   ├── 04-travel.md
│   ├── 05-daily-rhythm.md
│   ├── 06-even.md               ← EVEN Venture Studio
│   ├── 07-clients.md            ← Active clients
│   ├── 08-pipeline.md           ← Sales pipeline
│   ├── 09-brand.md              ← Brand guidelines
│   ├── 10-tools.md              ← Tech stack
│   ├── 11-finances.md
│   └── luis-writing-guide.md    ← Article writing rules and voice
├── assets/
│   ├── logos/                   ← Logo files (SVG, PNG)
│   └── images/                  ← Shared images
└── data/                        ← Operational state and configs
```

## Conventions

### Code Style
- Static HTML/CSS/JS only (no frameworks for personal site and HQ)
- No build step required — files deploy as-is to GitHub Pages
- Black and white design language — matches luisracosta.com
- Same fonts, same styling across all packages
- NO AI-generated images. Real photos only.

### Articles
- Written in español mexicano
- Formula: Luis's lived experience + deep research with real data = authority
- Declarations are clear, sharp, accurate, and traceable
- No glazing, no corny intros, no selling
- See `knowledge/luis-writing-guide.md` for full voice guide
- Article workflow: draft (markdown) → approved → HTML → published

### Deployment
- `packages/website/` → deploys to luisracosta.com (GitHub Pages, CNAME configured)
- `packages/hq/` → deploys to Perplexity Computer hosted URL (password: even2026)
- Article previews live in `packages/hq/preview/` for internal review before publishing

### State Management
- `packages/hq/data/state.json` is the single source of truth for:
  - Article statuses and metadata
  - Client roster
  - Pipeline data
  - Content queue
  - Progress log

### Git Workflow
- `main` branch is production
- Commit messages: `[package] description` (e.g., `[website] add new article`, `[hq] update state`)
- No force pushes to main
- All article HTML changes must have a corresponding markdown source update

## What NOT To Do

- Do NOT modify `.paperclip/` without explicit board (Luis) approval
- Do NOT send client communications — all client contact is via WhatsApp, approved by Luis
- Do NOT create AI-generated images
- Do NOT write overly flattering or "selly" copy
- Do NOT price or quote clients — that's Luis's domain
- Do NOT deploy to production without updating state.json
- Do NOT use frameworks or build tools — keep it static and simple

## Key Dates

- Mérida event: April 11-12, 2026
- Dubai: May 1-4, 2026
- Porto: May 28, 2026 (17 days)
- Apple WWDC: June 8-12, 2026

## Active Work

- Two article rewrites in progress: "El Open Source" and "Por Qué Construimos Diferente"
- FIRMA23 orchestration v1 complete — defines the operating model
- Paperclip integration: this repo is the first project managed through Paperclip
