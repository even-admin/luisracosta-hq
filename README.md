# luisracosta-hq

Master ecosystem repository for Luis Alberto Ramírez Acosta.

## What Lives Here

| Package | Description | URL |
|---------|-------------|-----|
| `packages/website` | Personal site | [luisracosta.com](https://luisracosta.com) |
| `packages/hq` | Mission Control dashboard | Internal |
| `packages/articles` | Article source files (markdown) | — |
| `packages/newsletter` | Newsletter system | Coming soon |
| `packages/landing-pages` | Campaign pages | Coming soon |

## Architecture

One monorepo. One truth. Managed by Paperclip with Claude Code as CTO.

```
Board (Luis) → Perplexity Computer (strategy/research)
                     ↓
              Paperclip (orchestration)
                     ↓
         ┌──────────┼──────────┐
         CEO        CTO        CMO
       (triage)   (build)   (content)
```

## Quick Start

```bash
# Clone
git clone https://github.com/even-admin/luisracosta-hq.git
cd luisracosta-hq

# Connect to Paperclip (after installing locally)
# npx paperclipai onboard --yes
# Then point Paperclip to this repo
```

## Conventions

- Static HTML/CSS/JS — no frameworks, no build step
- Black and white design language
- Español mexicano for all external content
- See `CLAUDE.md` for full technical context
- See `.paperclip/` for agent configurations

---

EVEN Venture Studio · Mérida, Yucatán · 2026
