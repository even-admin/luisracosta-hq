# Content Engine — Luis Ramirez Acosta

Last updated: April 5, 2026

---

## The 3 Brands

| Brand | Audience | Language | Channels |
|-------|----------|----------|----------|
| **luisracosta.com** | Builders, founders, technical leaders | Spanish (primary), English (select) | X, Newsletter, Blog, LinkedIn, GitHub |
| **fold.mx** | LATAM tech/AI curious, Mérida business community | Spanish | IG, X, Newsletter, Website |
| **Dr. Ramírez** | Patients, referral doctors | Spanish | WhatsApp, Email (automated), Google reviews, Website |

---

## The Architecture: Anchor + Cascade

One anchor piece per brand per week. Everything else derives from it.

```
ANCHOR (1 piece, ~45 min write)
  ├── X thread (8 tweets)
  ├── X standalone tweets (3-4)
  ├── LinkedIn post
  ├── Newsletter issue
  ├── IG carousel script (fold only)
  ├── GitHub Discussion/README update
  └── Blog post on website
```

**Weekly time budget:** ~5-6 hours total
- 3h writing anchor pieces (1 per brand)
- 1.5h AI derivation + editing
- 1h engagement (replies, DMs, comments)
- 30min scheduling

---

## Channel Map by Brand

### luisracosta.com (Personal Brand)

| Channel | Cadence | Content Type |
|---------|---------|-------------|
| X/Twitter | 3-5x/week | Threads (educational), building-in-public, hot takes on AI/tech, behind-the-scenes |
| Newsletter | 2x/month | One deep insight per issue. Welcome sequence: 3 emails over 10 days. Lead magnet on site. |
| Blog | 2x/month | Anchor pieces — long-form essays, frameworks, case studies |
| LinkedIn | 2x/week | Repurposed from blog, more professional tone, same voice |
| GitHub | Continuous | Profile README (updated monthly), luisracosta-hq repo activity, open source tools, release notes cross-posted to X |

**Newsletter stack:** Resend (transactional + welcome emails) + Buttondown (newsletter platform). Signup embedded on luisracosta.com.

**Funnel:** Blog/X post → lead magnet → email signup → welcome sequence (3 emails, 10 days) → regular newsletter → soft pitch after 45 days → discovery call/WhatsApp

**Content pillars:**
1. El futuro de la computación (agentic hardware, post-app era)
2. IA en la economía real (PYMES en México, not Silicon Valley)
3. Fe + tecnología
4. Industry takes (chips, regulation, constructive not reactive)
5. Disciplina + entrenamiento (body teaches mind)

---

### fold.mx (Media Brand)

| Channel | Cadence | Content Type |
|---------|---------|-------------|
| Instagram | 3x/week | Cover + deepdive carousels, validation carousels, stories (no selly shit) |
| X/Twitter | 3-5x/week | AI news commentary, curated takes, threads |
| Newsletter | 2x/month | AI news digest for LATAM, curated links + analysis |
| Website | Continuous | Article series, news coverage (must include Mérida/Yuc news in main section) |

**Design rules:**
- Lowercase "fold" always (never FOLD)
- Full black and white — same fonts/styling as luisracosta.com
- REAL images only — no AI-generated. Real photos of news, events, people.
- Style: Forbes × Luis × a little Apple

**Content already staged:**
- 11+ IG cover/deepdive pairs
- Validation carousels (5 sets)
- Captions written
- Tweets drafted (week 1 + week 2)
- Profile copy ready

---

### Dr. Ramírez (Client Brand)

| Channel | Cadence | Content Type |
|---------|---------|-------------|
| WhatsApp | All patient contact | Booking confirmations, follow-ups, questions |
| Email (GHL automated) | Triggered | Appointment confirmation, 2-day reminder, post-visit thank you + Google review request |
| Google Reviews | Passive | QR cards in consultorio, review link in post-visit email |
| Website | Static | dr-luis-merida — already deployed |

**Immediate fixes needed:**
1. Google review link is a broken placeholder `[LINK_RESENA_GOOGLE]` — fix in GHL
2. Dr. wants phone notifications when someone books — LeadConnector app is broken for this
3. Evaluate Easy!Appointments as GHL replacement

---

## GitHub as Social Media

GitHub is where Luis's real audience lives: developers, builders, technical founders.

**Strategy:**
- **Profile README** (even-admin or personal): 1-sentence bio, pinned repos, links to newsletter/X/blog, "currently building" section
- **luisracosta-hq repo**: The master monorepo IS content — it shows how a solo founder orchestrates AI agents. Keep it public and well-documented.
- **Open source tools**: Any tool built for clients/internal use → extract, clean, publish as standalone OSS repo. Stars = social proof.
- **Release notes → X**: Every meaningful commit/release gets a tweet. "Acabo de publicar v2.0 de [tool]. Link in first reply."
- **GitHub Discussions**: Enable on main repos. Let community self-serve.

**Cross-pollination:**
- GitHub release → tweet → newsletter mention
- Blog post → GitHub Discussion thread (for technical posts)
- IG carousel → reference GitHub repo in caption

---

## Newsletter Infrastructure

**Recommended stack:**
- **Resend** ($0-20/mo): Transactional emails, welcome sequence, API-native for Next.js
- **Buttondown** ($9-79/mo): Newsletter platform, markdown-native, clean API, developer-friendly
- **OR Beehiiv** ($0-109/mo): If growth network matters (recommendation engine, boosts)

**Embed on luisracosta.com:**
- Simple form: email + first name
- Lead magnet: "Guía de automatización con IA para PYMES" or similar
- Inline in blog posts (mid-article CTA) + footer permanent
- Social proof counter: "Únete a X founders y líderes de negocio"

**Welcome sequence:**
1. Day 0: Deliver lead magnet. No pitch. "Reply and tell me your biggest challenge."
2. Day 3-5: Who I am, what I build, one story.
3. Day 7-10: One specific insight. Light CTA: "I work with [X type of company]."

---

## Automation Layer

| What | How | Trigger |
|------|-----|---------|
| Newsletter welcome sequence | Resend API | New subscriber |
| Tweet scheduling | Typefully or X API direct | Weekly batch (Sunday) |
| IG posting | Buffer or manual | 3x/week |
| GitHub release → tweet | GitHub Actions webhook | New release/tag |
| Blog → newsletter | Manual or Buttondown API | New blog post |
| Post-visit review email | GHL automation (existing) | After appointment |

**What stays human:**
- Original anchor writing
- Personal newsletter intro paragraph
- Reply to DMs/comments from potential clients
- Tweet hooks (first tweet of any thread)
- Any client-facing communication

**What [P] handles:**
- Anchor → derivative transformation
- Scheduling and queue management
- Research for content topics
- Newsletter draft from anchor
- Monitoring engagement and flagging opportunities

---

## Week 1 Action Plan

### Immediate (today/tomorrow)
1. [ ] Fix Dr. Ramírez Google review link in GHL
2. [ ] Publish fold.mx staged content (IG + first tweets)
3. [ ] Publish Luis's first 10 tweets on X

### This week
4. [ ] Add newsletter signup to luisracosta.com (Resend or Buttondown)
5. [ ] Set up Typefully or connect X API for scheduling
6. [ ] Write first anchor piece for luisracosta.com
7. [ ] Update GitHub profile README (even-admin)
8. [ ] Push first fold.mx article live on website

### This month
9. [ ] 3 newsletter issues sent (1 welcome + 2 regular)
10. [ ] fold.mx running at cadence (3 IG/week, 3-5 tweets/week)
11. [ ] luisracosta.com running at cadence (3-5 tweets/week, 2 blog posts)
12. [ ] HubSpot CRM set up for pipeline management
13. [ ] Dr. Ramírez review system working (fix link, test QR cards)
