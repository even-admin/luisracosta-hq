# MISSION CONTROL — Rebuild Brief for Claude Code

## What To Do

Rebuild `packages/hq/` into a Mission Control dashboard. This replaces the current article-tracking HQ with a CEO operations board focused on closing a $50K-100K MXN client in 30 days.

**Keep what works:** The existing design system (Instrument Serif + Satoshi, B&W palette, dark mode toggle, password gate) is perfect. Keep the CSS variables, fonts, gate mechanism. Rebuild the dashboard content.

**Hosted at:** hq.luisracosta.com (CNAME already set)

## Design Rules

- **Fonts:** Instrument Serif for headings, Satoshi for body (already loaded in current index.html)
- **Colors:** Pure B&W. Background #FAFAFA / #0A0A0A. Cards: white #FFFFFF / #111111. Border: #E5E5E5 / #2A2A2A.
- **Cards:** White background, 1px subtle border, border-radius 16px, ZERO shadows. No box-shadow anywhere.
- **Style:** Clean, editorial, magazine back-office. No emojis. No gradients. No chunky elements.
- **Transitions:** 180ms cubic-bezier(0.16, 1, 0.3, 1) on hover states

## Tech Constraints

- **Static HTML/CSS/JS only** — no build tools, no React, no npm. This deploys to GitHub Pages.
- **LocalStorage for task persistence** (checkbox states, notes)
- **state.json for pipeline/content data** — [P] (Perplexity) will update this file via GitHub commits
- **Single page, no routing**

## Sections to Build

### 1. HEADER
- "Mission Control" in Instrument Serif
- Subtitle: "30 days to close a $50K-100K MXN client" in Satoshi, muted
- Dark mode toggle (keep existing)
- Password gate (keep existing)

### 2. THE MISSION (hero card)
- Target: "Close a $50K-100K MXN project by May 5, 2026"
- Countdown: days remaining (calculate from Date.now())
- 4-week progress bar: Week 1 (Foundation) → Week 2 (Visibility) → Week 3 (Pipeline) → Week 4 (Close)
- Current week highlighted based on date
- Clean, prominent, first thing you see

### 3. PIPELINE
Horizontal scrollable row of cards:

```json
[
  {"name": "Terra 58", "value": "$150K MXN", "status": "waiting", "note": "Awaiting JP confirmation", "type": "project"},
  {"name": "SETY", "value": "$200K MXN", "note": "On hold — 20 prospects × $10K", "status": "paused", "type": "project"},
  {"name": "Dr. Ramírez", "value": "$12K/mes", "status": "active", "note": "Active retainer", "type": "retainer"},
  {"name": "Servimueble", "value": "$12K/mes", "status": "active", "note": "Diego manages", "type": "retainer"}
]
```

Status indicators: green dot = active, yellow dot = waiting, gray dot = paused
Total pipeline value in header: "$350K MXN pipeline"

### 4. THIS WEEK'S TASKS
Checklist with checkboxes. State saved to localStorage. Each task has:
- Checkbox (toggleable)
- Task text
- Optional tag: "content", "client", "setup", "outreach"

Week 1 tasks (pre-populated):
- [ ] Fix Dr. Ramírez Google review link in GHL [client]
- [ ] Publish first 5 tweets on X [content]
- [ ] WhatsApp JP — check-in on Terra 58 [outreach]
- [ ] Add newsletter signup to luisracosta.com [setup]
- [ ] Update GitHub profile README [setup]
- [ ] Publish fold.mx first IG batch [content]
- [ ] Write Dr. Ramírez case study [content]
- [ ] Publish case study on LinkedIn [content]
- [ ] Write anchor piece #1 for blog [content]

Show progress: "X/9 completed" with a thin progress bar

### 5. CONTENT CADENCE
Grid/table showing content status:

| Channel | luisracosta.com | fold.mx | Dr. Ramírez |
|---------|----------------|---------|-------------|
| X/Twitter | 0/5 this week | 0/3 this week | — |
| LinkedIn | 0/2 this week | — | — |
| Newsletter | Not started | Not started | — |
| Instagram | — | 0/3 this week | — |
| Blog | 0/1 this month | 0/1 this month | — |
| Reviews | — | — | Link broken |

Small chips: green = on track, yellow = behind, red = blocked, gray = not started, dash = N/A

### 6. CLIENT HUNTING
Cards linking to platforms where work lives:
- Upwork — "Bid on AI/vibe coding projects" — https://upwork.com
- LinkedIn — "Publish & connect with founders" — https://linkedin.com
- vibecoding.work — "AI-native developer jobs" — https://vibecoding.work
- Arc.dev — "Fractional CTO matching" — https://arc.dev
- Fractional Jobs — "List yourself as fCTO" — https://fractionaljobs.io

Simple link cards, external links open in new tab.

### 7. NUMBERS (footer strip)
- MRR: $24K MXN
- Pipeline: $350K MXN
- Costs: ~$532 USD/mo
- Days to target: [calculated]

## Data Architecture

`data/state.json` — Updated by [P] via GitHub:
```json
{
  "last_updated": "2026-04-05T12:00:00-06:00",
  "mission": {
    "target": "Close a $50K-100K MXN project",
    "deadline": "2026-05-05",
    "weeks": [
      {"num": 1, "name": "Foundation", "start": "2026-04-06", "end": "2026-04-12"},
      {"num": 2, "name": "Visibility", "start": "2026-04-13", "end": "2026-04-19"},
      {"num": 3, "name": "Pipeline", "start": "2026-04-20", "end": "2026-04-26"},
      {"num": 4, "name": "Close", "start": "2026-04-27", "end": "2026-05-05"}
    ]
  },
  "pipeline": [...],
  "content_cadence": {...},
  "platforms": [...]
}
```

`app.js` — Reads state.json, renders dashboard, handles localStorage for tasks.

## What NOT to Do

- No React, no build tools, no npm
- No box-shadows
- No emojis
- No gradients
- No chunky/heavy design elements
- Don't break the existing password gate or dark mode toggle
- Don't use any external JS libraries (vanilla JS only)
- Don't add authentication beyond the existing password gate

## Files to Modify (HQ)

- `packages/hq/index.html` — rebuild dashboard HTML
- `packages/hq/style.css` — update styles for new sections
- `packages/hq/app.js` — rebuild dashboard logic
- `packages/hq/data/state.json` — new data structure

---

# PART 2: luisracosta.com — Personal Site Upgrade

## Current State

The site at `packages/website/` is a bare single page: name, one paragraph, article titles (not linked), an "Elsewhere" heading with nothing under it, and an email. No one landing here knows what to hire Luis for, sees proof of work, or can give their email.

## What To Build

Keep the same design system (Instrument Serif + Satoshi, B&W, minimal editorial). Keep the existing style.css and base.css — they're the source of truth. This is NOT a redesign. It's adding the missing sections that turn a name card into a client acquisition page.

### 1. HERO (update existing header)
Keep: "Luis Alberto Ramirez Acosta" in Instrument Serif.
Tagline: "Fractional CTO. AI-native builder. Mérida, MX."
One line muted: "Founder @ EVEN Venture Studio"

Not a sales pitch. Just who he is. The rest of the page proves it.

### 2. BACKGROUND (replaces "What I Do")
Heading: "Background" in Instrument Serif.

This is NOT a portfolio of little client deployments. This is a credential section that shows who Luis IS.

Two columns or a clean structured layout:

**Education & Training:**
- Programación y Transformación Digital — EBC (current)
- Design Thinking certification
- Human-Centered System Design

**Work:**
- Founder, EVEN Venture Studio — evenai.co
- Fractional CTO for capital-backed founders and business families in México
- AI-native operations: one operator + AI = output of a 5-8 person team

Keep it minimal. No bullet-point soup. Clean typography, Instrument Serif for labels, Satoshi for details.

### 3. THE SETUP (replaces generic "Stack" section)
Heading: "The Setup" in Instrument Serif.
Subtext in muted: "This is how I operate."

This IS the case study. Show the actual working environment and workflow:

**Hardware:**
- Mac Mini (office) — always-on server, runs orchestration
- MacBook Pro (mobile) — development on the go
- iPhone × 2 — WhatsApp client comms, monitoring

**AI Layer:**
- Perplexity — strategy, research, intelligence, operations
- Claude + Claude Code — builds and ships code
- Paperclip — agent orchestration and project management

**Dev Stack:**
- React / Next.js / Tailwind / shadcn
- Python
- Supabase / PostgreSQL
- GitHub (even-admin)

**Client Ops:**
- GoHighLevel — CRM & automation for clients
- HubSpot — pipeline management
- Google Workspace — professional email + Meet

Design this like a clean equipment list or a "what's in my bag" section. White cards, subtle borders, no shadows. Think Apple product page meets editorial layout. NOT a boring tool grid — make it feel like opening someone's actual workspace.

### 4. EVEN (new section — links to proof)
Heading: "EVEN" in Instrument Serif.
One clean card or block:
- "Venture studio in Mérida. Fractional Technical Co-Founder as a Service."
- Link: evenai.co
- Note in muted: "Portfolio, methodology, and client work live here."

EVEN is where the portfolio lives. Luis's personal site is about HIM — his thinking, his setup, his credentials. EVEN handles the project showcasing. Don't duplicate it.

### 5. THINKING (fix existing)
The current article titles aren't linked. Fix them:
- Each article title should link to its published URL on luisracosta.com
- Show date in muted text
- Keep the clean list format

Article URLs (from state.json):
- "La Carrera de la IA es un Ciclo" → /la-carrera-de-la-ia-es-un-ciclo.html
- "Por Qué Construimos Diferente" → /por-que-construimos-diferente.html
- "Cómo Construí Mi Sistema Operativo" → /como-construi-mi-sistema-operativo.html
- "El Territorio Cambió" → /el-territorio-cambio.html
- "Caballos Salvajes" → /caballos-salvajes.html

### 6. NEWSLETTER SIGNUP (new section — CRITICAL)
Heading: "Newsletter" in Instrument Serif.
Subtext: "Ideas sobre IA, tecnología y negocios. Sin spam. Un email cada dos semanas."

Simple form:
- Email input field + "Suscribirme" button
- On submit: store email to localStorage for now (we'll wire to Resend/Buttondown later)
- Success state: "Gracias. Te escribo pronto." replaces the form
- Clean, minimal form. Same card style. No popup, no modal — inline on the page.

**Future:** This form will POST to an API endpoint. For now, just capture to localStorage and show success. The brief for wiring the backend comes later.

### 7. ELSEWHERE (fix existing)
Add actual links:
- X/Twitter — https://x.com/luisracosta (or whatever handle)
- LinkedIn — https://linkedin.com/in/luisracosta
- GitHub — https://github.com/even-admin
- fold.mx — https://fold.mx

Simple text links, subtle hover underline.

### 8. CONTACT (update)
Replace `luis@evenai.co` with:
- Email: contacto@luisracosta.com (new Google Workspace)
- One line: "WhatsApp is faster." with a WhatsApp link (https://wa.me/XXXXXXXXXXX — Luis will fill in number)

### 9. FOOTER (new)
Simple footer:
- "© 2026 Luis Alberto Ramirez Acosta"
- "Mérida, Yucatán, México"
- Small text links: X, LinkedIn, GitHub

## Files to Modify (Website)

- `packages/website/index.html` — add new sections
- `packages/website/style.css` — add styles for new components (service cards, newsletter form, stack grid)
- Keep `packages/website/base.css` untouched
- Keep all existing article HTML pages untouched

## Commit & Deploy

- Branch: `main` (push directly)
- Commit 1: "hq: rebuild Mission Control — 30-day client close dashboard"
- Commit 2: "website: upgrade personal site — services, case study, stack, newsletter signup"
- Deploy: GitHub Pages serves both from their respective directories
