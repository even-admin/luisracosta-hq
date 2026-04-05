# WEBSITE V3 — The Real Deal

**Repo:** `even-admin/luisramirez-site` (branch: main → luisracosta.com)
**This is the ONLY brief that matters. Ignore WEBSITE-REBUILD-BRIEF.md and WEBSITE-V2-BRIEF.md.**

---

## Build With Real Tools

**Framework:** Astro (static site generator, outputs to `dist/` for GitHub Pages)
**Animations:** GSAP + ScrollTrigger via CDN
**Smooth scroll:** Lenis via CDN
**Styling:** Tailwind via CDN or inline — keep it simple, no complex build pipeline
**Images:** Real, high-quality images. Download from Unsplash or Apple press kits. No placeholders. No AI-generated.
**Output:** Static HTML/CSS/JS in `dist/` folder, deployable to GitHub Pages

If Astro is too complex for the constraints, build with vanilla HTML/CSS/JS but make it LOOK like a framework-quality site. The output matters, not the tooling.

---

## Design DNA

**NOT a portfolio. NOT a consultant page. This is a builder's personal site.**

| Attribute | Value |
|-----------|-------|
| Vibe | Apple product page meets Linear.app meets remygaskell.com |
| Background | Pure white #FFFFFF (light) / #0A0A0A (dark). NOT sand. NOT beige. |
| Cards | White, 1px border, 16px radius, ZERO shadow. Hover lifts 3px. |
| Typography | Instrument Serif (display), Satoshi (body), DM Mono (specs/technical) |
| Images | Real photography. Hardware product shots. High quality. |
| Animations | GSAP scroll reveals, text splitting, staggered entrances, parallax |
| Mood | Technical, clean, ambitious, a little dangerous, cool |

---

## Color Palette

```css
:root {
  --bg: #FFFFFF;
  --surface: #FAFAFA;
  --card: #FFFFFF;
  --border: #E5E5E5;
  --border-hover: #CCCCCC;
  --text: #0A0A0A;
  --text-2: #525252;
  --text-muted: #737373;
  --text-faint: #A3A3A3;
}

[data-theme="dark"] {
  --bg: #0A0A0A;
  --surface: #111111;
  --card: #161616;
  --border: #262626;
  --border-hover: #383838;
  --text: #E8E6E3;
  --text-2: #A0A0A0;
  --text-muted: #737373;
  --text-faint: #525252;
}
```

---

## Page Structure

### NAVIGATION (sticky, appears on scroll)

Fixed top bar, hidden initially, slides down after scrolling past hero:
- Left: "Luis Ramirez" small text
- Center or right: About · Setup · Work · Writing · Newsletter
- Far right: dark mode toggle (sun/moon)
- Background: backdrop-blur + semi-transparent bg
- Smooth scroll to sections on click
- Active section highlighted as you scroll (ScrollTrigger)

### SECTION 1: HERO (100vh, full viewport)

```
[Live clock — HH:MM:SS in DM Mono, ticking]

Luis Alberto Ramirez Acosta
[Instrument Serif, ~2.5rem, bold]

Fractional CTO · AI-Native Builder
[Satoshi, muted, 1rem]

MER, MX · 20.9674° N, 89.5926° W
[DM Mono, coordinate lottery — digits scramble 800ms then settle]

[X] [LinkedIn] [GitHub]
[icon row, 32px, subtle hover]

[Contact me]  or  [Copy email]
[toast on copy: "Copied"]
```

**Entrance animation:** Staggered — clock → name → tagline → coordinates lottery → icons pop → buttons fade. Total: ~1.5s. Smooth, not rushed.

**Background:** Consider a subtle grid pattern, very faint, or a slow-moving noise texture — just enough to feel alive, not distracting.

**Scroll indicator:** Animated thin line or chevron pulsing at bottom.

### SECTION 2: ABOUT

**Section label:** "About" in DM Mono, left-positioned outside content column (desktop), inline (mobile).

Short, direct. 2-3 paragraphs max:

> I build AI-powered operating systems for businesses. Not pitch decks. Not demos. Real systems that run real operations.
>
> Founder of EVEN Venture Studio in Mérida. Studying Programación y Transformación Digital at EBC. Background in Design Thinking and Human-Centered System Design.
>
> One operator. AI leverage. Output of a 5-8 person team. That's the equation.

**Animation:** Text reveals on scroll — lines fade up with slight stagger (GSAP SplitText or per-paragraph fadeUp).

### SECTION 3: THE SETUP (star section — spend the most time here)

**Section label:** "Setup"
**Subhead:** "How I operate." in DM Mono, muted

This section is WHY someone hires Luis. It shows the actual machine.

#### Hardware: Mac Mini + MacBook Pro

Two big showcase moments. Each device gets a full-width or near-full-width treatment.

**Mac Mini card:**
- **Real image** of Mac Mini — use Apple's official product shot (search apple.com/shop/buy-mac/mac-mini for press images, or use a high-quality photo from Unsplash searching "mac mini m4 product shot"). The image should be large, clean, on white/transparent background.
- On scroll: image slides in from one side, specs appear from the other (or image pins while specs scroll alongside)
- Name: "Mac Mini" in Instrument Serif
- One-liner: "The brain that never sleeps." in Satoshi
- Specs in DM Mono with dot leaders:

```
Role ................. Always-on server
Uptime ............... 24/7
Runs ................. Agent orchestration, Cal.com, webhooks
Location ............. Office, Mérida
Replaces ............. 1 DevOps engineer
```

**MacBook Pro card:**
- Same treatment — real product image, large, clean
- Name: "MacBook Pro" in Instrument Serif
- One-liner: "Ships from anywhere." in Satoshi
- Specs:

```
Role ................. Mobile development station
Stack ................ Claude Code, React, Python, Tailwind
Deploys/week ......... 12–15
Location ............. Wherever I am
Replaces ............. 2 frontend developers
```

**Scroll behavior:** These two cards should feel like an Apple product comparison. Options:
1. **Pin and reveal:** Image pins in place while spec text scrolls up alongside (ScrollTrigger pin)
2. **Parallax:** Image moves slower than text, creating depth
3. **Slide in:** Image enters from left, specs from right, meeting in the middle

Pick whichever creates the most impact. The "Replaces X engineers" line should land with weight.

#### AI Layer

Three medium cards in a row (desktop) or stacked (mobile). Stagger reveal on scroll.

| Tool | Role | Detail |
|------|------|--------|
| Perplexity | The strategist | Research, intelligence, content, operations. Plans everything. |
| Claude Code | The builder | Ships production code. React, Python, full-stack. Daily. |
| Paperclip | The HQ | Agent orchestration. Project tracking. Visibility. |

Clean white cards, subtle border, 16px radius. Each with a small icon or monogram.

#### Dev Stack + Ops (Remy-style grid)

4-column grid (desktop), 2-column (mobile). Small cards, name only:
- React · Next.js · Tailwind · shadcn
- Python · Supabase · PostgreSQL · GitHub
- Cal.com · HubSpot · Google Workspace

No descriptions. Just the grid. Shows range.

### SECTION 4: WORK

**Section label:** "Work"

Three project cards. Real links. Hover lift.

| Project | Description | Link |
|---------|-------------|------|
| EVEN Venture Studio | Fractional CTO as a Service for businesses in México. | evenai.co |
| fold.mx | Technology and AI media. Real impact, no noise. | fold.mx |
| Dr. Ramírez López | Patient-centric digital ecosystem for neurosurgery practice. | drluisramirezlopez.com |

Each card: subtle border, padded, hover translateY(-3px). External links in new tab.

### SECTION 5: WRITING

**Section label:** "Writing"

Article list with working links:

| Article | Date |
|---------|------|
| La Carrera de la IA es un Ciclo | Abril 2026 |
| Por Qué Construimos Diferente | Abril 2026 |
| Cómo Construí Mi Sistema Operativo | Abril 2026 |
| El Territorio Cambió | Marzo 2026 |
| Caballos Salvajes | Marzo 2026 |

Links go to `/article-name.html` on the same domain. Instrument Serif titles, DM Mono dates. Hover: slight translate or arrow slides in.

### SECTION 6: NEWSLETTER

**Section label:** "Newsletter"

```
Ideas sobre IA, tecnología y negocios.
Sin spam. Cada dos semanas.

[email input] [Suscribirme]

Success: "Gracias. Te escribo pronto."
```

localStorage for now. Will wire to Resend/Buttondown later.

### SECTION 7: FOOTER

```
© 2026 Luis Alberto Ramirez Acosta
Mérida, Yucatán, México
built with claude code

X · LinkedIn · GitHub · fold.mx
```

---

## Animation System

### Load: GSAP + ScrollTrigger + Lenis

```html
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/ScrollTrigger.min.js"></script>
```

### Hero entrance (on page load)
1. Optional preloader — minimal "L" mark fades, content reveals
2. Clock fades in (200ms)
3. Name slides up (fadeUp: translateY 30→0, opacity 0→1, 600ms)
4. Tagline follows (100ms delay)
5. Coordinates lottery (800ms — random digits cycle, settle to real values)
6. Social icons pop in (scale 0.9→1, 50ms stagger)
7. Buttons fade in

### Scroll reveals (all sections)
- **Default:** Every section element does fadeUp (translateY 30→0) when entering viewport
- **Stagger:** Multiple cards/items in a section stagger at 100ms intervals
- **About text:** Lines reveal one by one (use clip-path or opacity+translate per line)
- **Hardware cards:** Larger motion — translateY 60→0, potentially with slight scale (1.02→1)
- **Nav:** Slides down from top when scrolling past hero (ScrollTrigger)
- **Active nav link:** Highlighted as corresponding section enters viewport

### Hardware section (the premium scroll)
- **Pin the image** while spec text scrolls alongside (GSAP ScrollTrigger pin)
- OR **parallax** where image moves at 0.5x scroll speed creating depth
- The transition between Mac Mini and MacBook Pro should feel seamless — one flows into the other

### Hover micro-interactions (300ms ease)
- Cards: translateY(-3px) + border darkens
- Buttons: background shifts slightly
- Social icons: subtle scale(1.05) + background circle
- Article links: arrow (→) slides in from left on hover

### Smooth scrolling
Initialize Lenis for buttery scroll feel:
```js
const lenis = new Lenis({ lerp: 0.1, smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
```

---

## Images

**Use REAL high-quality product images. Not AI generated. Not placeholders.**

For Mac Mini and MacBook Pro:
1. Download from Apple Newsroom press images (apple.com/newsroom — they provide high-res PNGs)
2. Or find on Unsplash: "mac mini product shot white background", "macbook pro product white background"
3. Images MUST be on white/transparent background, clean cutout, high resolution
4. Optimize: convert to WebP, max 200KB per image
5. Save in an `images/` directory in the repo

If product images cannot be sourced (copyright concerns), create **clean SVG device illustrations** — minimal line art, technical drawing style. NOT cartoon. Think Apple design patent drawings — precise, geometric, monochrome.

---

## What NOT To Do

- No blue links — `a { color: inherit; }` globally
- No box-shadows on cards
- No gradients
- No beige/sand/warm colors — PURE WHITE and BLACK
- No stock photos of people
- No AI-generated images
- No framework logos or badge icons
- No "let's work together" CTA
- No testimonials
- No pricing
- No contact form
- No iPhone section (dropped)
- No emoji in body text

---

## Responsive

- **Desktop (>1024px):** Full layout, left section labels, hardware images large, 4-col stack grid
- **Tablet (768-1024px):** Section labels inline, hardware cards stack, 3-col grid
- **Mobile (<768px):** Everything stacks, full-width cards, 2-col grid, nav becomes minimal
- Touch: all hover effects become focus/active states

---

## Files

In `even-admin/luisramirez-site`:
- Rewrite: `index.html`, `style.css`
- Create: `app.js` (animations, clock, lottery, copy, scroll)
- Create: `images/` directory with hardware product shots
- Keep: `base.css`, `CNAME`, all article `*.html` pages

## Build and Deploy

```bash
# If using Astro:
npm create astro@latest . -- --template minimal
# build → output to dist/
# copy dist/ contents to repo root for GitHub Pages

# If plain HTML:
# Just push index.html, style.css, app.js, images/ directly
```

## Commit

`website v3: real build — GSAP animations, hardware showcase, Lenis smooth scroll, pure B&W`

---

## Quality Checklist Before Pushing

- [ ] Clock ticking live in hero
- [ ] Coordinate lottery animation works
- [ ] Copy email shows toast
- [ ] Dark mode toggle works
- [ ] All article links work (/article-name.html)
- [ ] Hardware images load, look crisp
- [ ] Scroll animations fire on each section
- [ ] Nav appears on scroll, highlights active section
- [ ] Newsletter form captures to localStorage
- [ ] Mobile responsive — no horizontal scroll, nothing broken
- [ ] No blue links anywhere
- [ ] No shadows on cards
- [ ] Footer says "built with claude code"
- [ ] Page loads in under 3 seconds
