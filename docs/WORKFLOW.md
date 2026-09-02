# How to design and build a Kattanchaya-style site

This is the workflow used to plan **Kattanchaya** in ChatGPT and then build the live app (Vite + React + TypeScript). Use it to teach others, or to rebuild the same kind of project: a vintage Kerala tea-shop site with a free **chayakada ambience maker**.

Live reference: [guru177.github.io/chayakada](https://guru177.github.io/chayakada/)  
Inspiration (look, don’t copy assets): [kattanchaya.in](https://www.kattanchaya.in/)

---

## What you are making

A **single-page nostalgic tea shop** plus a **sound mixer**.

| Piece | What the visitor gets |
| --- | --- |
| Hero | Vintage photo, Malayalam kicker, “Ambience Maker” starts sound |
| Our Story | History of **chaya in Kerala** (plantations, kattan, chayakada culture) |
| Ambience Maker | 7 loops + radio, knobs, gold sliders, presets, sleep, vibe, spatial |
| Menu | Full-bleed chalkboard photo |
| Gallery | Mosaic photos, filters, quote scrap, share CTA |
| Footer | Perks, brand, social, visit, hours |
| Pomodoro | `/pomodoro` — same mixer for study sessions |

**Do not** scrape or stream another site’s copyrighted songs. Use loops you own, plus 1–2 licensed local MP3s for radio.

---

## Tools

| Job | Tool |
| --- | --- |
| Mood, copy, layout brief, image prompts | **ChatGPT** |
| Build the app, CSS, audio, git | **Cursor** (or any code editor) |
| Stack | Vite 7, React 19, TypeScript, React Router 7 |
| Fonts | Google Fonts: Noto Serif Malayalam, Cinzel, Playfair, EB Garamond, Oswald, Libre Baskerville |
| Images | ChatGPT / image model → compress to JPEG + WebP |
| Audio | Your own `.m4a` loops + `.mp3` radio tracks |
| Host | GitHub Pages (this repo: `github.com/guru177/chayakada`) |

You need Node.js, npm, and git. Optional: Python + Pillow to run `scripts/optimize-images.py`.

---

## The rule: ChatGPT designs, the editor builds

ChatGPT is the **art director**. It should not dump a whole production repo.

Ask it for:

1. Mood and colour (not hex soup later — lock tokens in CSS)
2. Page map (sections in scroll order)
3. Malayalam + English copy
4. Image prompts (one asset at a time)
5. Mixer UX (what each control does)
6. Mobile layout rules (“2 cards per row”, “CTA full width”)

Then build in **small slices** in Cursor: one section, screenshot, fix, next section.

---

# Phase 1 — Plan the design in ChatGPT

Work through these chats **in order**. Copy a prompt, paste the reply into a notes file (`docs/design-brief.md` is enough), then move on.

## 1.1 One-sentence product

```text
I want a vintage Kerala chayakada website: nostalgic tea-shop look,
Malayalam-first copy, and a free in-page ambience mixer (rain, kettle,
crowd, radio). It is a digital tea stall, not a restaurant booking app.

Give me: 1 sentence pitch, 5 brand adjectives, what we will NOT build.
```

Lock: **nostalgia, paper, forest green, cream, gold, Malayalam**.  
Not: cart, login, live map, scraped music.

## 1.2 Visual system

```text
Design a visual system for a 1960s Kerala tea stall website.

Need:
- 6 CSS colour tokens (paper, ink, forest, cream, gold, wood)
- Font pairing: Malayalam body + English display + UI labels
- Texture ideas: torn paper, polaroid, postage stamp, chalkboard, wood
- What to avoid (neon, glassmorphism, stock “Indian restaurant” red/gold)

Output as a table I can paste into CSS :root.
```

This project’s tokens (in `src/styles.css`):

```css
--paper: #ead9b8;
--ink: #2a1c10;
--forest: #1e3d2f;
--forest-deep: #14281e;
--cream: #f4ead4;
```

Body sits on `#cbb892`. Mixer sits on dark wood. Footer is `--forest-deep`.

## 1.3 Information architecture

```text
Turn this into a one-page scroll map.

Nav labels: HOME, OUR STORY, MENU, AMBIENCE MAKER, GALLERY, LOCATIONS, CONTACT.

Important: DOM order can differ from nav labels if sections overlap
(negative margin fades). Propose:
- id for each section
- what is in each block
- which blocks are full-bleed photos vs paper vs wood
```

**This app’s scroll order (DOM):**  
home → story → **ambience** → **menu** → gallery → footer (`#locations`, `#contact`).

Nav still lists MENU before AMBIENCE. Teach this: **label order ≠ DOM order** when sections overlap. Hash URLs: `#home` `#story` `#menu` `#ambience` `#gallery` `#locations` `#contact`.

## 1.4 Copy (story is history, not a fake shop diary)

```text
Write Malayalam (Noto Serif Malayalam tone: literary, warm, not slang)
for an "Our Story" section titled ചായയുടെ ചരിത്രം / കേരളത്തിലെ ചായയുടെ പാരമ്പര്യം.

Topic: history of tea in Kerala — Munnar, Wayanad, Peermade plantations;
kattan (no milk, no sugar); chayakada as a public place; radio evenings;
sulaimani in Malabar.

Do NOT invent a single shop that opened in 1963 as the whole story.
EST. 1963 can stay as a brand mark in the header/footer only.

7 short paragraphs. Then a 1-line English summary.
```

Hero kicker can stay poetic (`ഒരു കട്ടൻ ചായയുടെ കഥ`). Story body is **culture**, not origin-myth of one kada.

## 1.5 Mixer UX spec

```text
Specify a vintage mixer UI, 8 cells in a grid:

7 ambience cards: rain, thunder, crickets, chatting, fire, birds, wind.
Each card: Malayalam name, LED, visualizer bars, rotary knob AND
a gold-dot volume bar, OFF/ON + percent.

8th cell: radio — now playing, seek, shuffle/prev/play/next/repeat, vertical VOL.

Toolbar: presets, sleep 30/60/90, vibe (clear/warm), spatial (stereo/wide),
master volume.

Constraints:
- Browser audio starts only after a user click
- Hero "Ambience Maker" button must start ambience AND the radio song
- Do not hotlink another website's MP3s
```

## 1.6 Image prompt pack

Ask ChatGPT for **one prompt per file**, 4:3 or 3:4, “1980s Kerala film, no modern logos, no extra text unless specified”.

| File | Subject |
| --- | --- |
| `hero-bg` / `hero-bg-mobile` | Chayakada counter, glass of kattan, wood, rain light |
| `shop-vintage` | Polaroid of an old stall (thatched roof, people, faded print) |
| `menu-board` | Chalkboard menu, EST mark, glasses |
| `gal-*` | Alleppey, Ambassador, hills, cinema, snacks, KSRTC, cycle… |
| `gal-quote` | Torn parchment, Malayalam lines, India postage stamp, **transparent background** |
| `footer-parchment` | “Come, sip…” sketch of two cutting-chai glasses, alpha PNG |
| `seal-stamp` | Circular “TRADITIONAL KATTANCHAYA KERALA” |
| `mix-wood` | Dark horizontal wood for mixer |

**Prompt pattern:**

```text
Vintage 1988 photograph of [subject], Kerala, faded colour print,
film grain, warm sepia, photorealistic, no watermarks, no modern brands.
Aspect [4:3 or 3:4].
```

Keep **alpha PNGs** for torn paper and stamps. Flattening them to JPEG fills holes with black and they vanish on dark wood.

## 1.7 Mobile rules (ask before you code)

```text
Give mobile CSS rules for this page (390px and 768px):

- Mixer: 2 columns, 8 cells (7 sounds + radio), 4 rows. Do not drop to 1 col.
- Gallery footer: quote | seal on row 1, share CTA full width under.
- Site footer: perks 2×2; parchment | stamp; brand/follow/visit stacked.
- Story: small centered polaroid, then full-width Malayalam paper; less padding.
- Gold slider: thumb vertically centered on the track (fat hit area, thin visual bar).
```

Save that answer. It is your QA checklist.

---

# Phase 2 — Scaffold the project

```bash
npm create vite@latest kattan-chaya -- --template react-ts
cd kattan-chaya
npm install react-router-dom
npm run dev
```

Suggested tree (this repo):

```text
index.html                 SEO, fonts, JSON-LD
src/
  main.tsx
  App.tsx                  AudioProvider + Router
  styles.css               almost all visual design
  data.ts                  volumes, presets, radio, gallery, loops
  seo.ts / nav.tsx / context.tsx
  audio/engine.ts          Web Audio + <audio> loops + radio
  pages/Home.tsx           all home sections
  pages/Pomodoro.tsx
  components/              Header, AmbiencePanel, Gallery, Footer, Pic, Seo
public/
  images/                  jpg + webp (+ png with alpha)
  audio/ambience/*.m4a
  audio/songs/*.mp3
scripts/optimize-images.py
docs/                      this file + AMBIENCE.md
```

Keep **one CSS file** until the look is stable. Split later if you must.

Wire routes:

```tsx
<AudioProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pomodoro" element={<Pomodoro />} />
    </Routes>
  </BrowserRouter>
</AudioProvider>
```

---

# Phase 3 — Build in this order

Build **top to bottom**, but ship audio as soon as the mixer shell exists so you can hear it.

## Step 1 — Tokens, fonts, header

- Paste `:root` colours and Google Fonts into `index.html` (`html lang="ml"`).
- Compact header: Malayalam wordmark, EST mark, cup SVG, hash nav.
- React Router 7 intercepts `#hash` clicks — don’t use raw `<a href="#story">`. Use `sectionLink` + `prepareJump` in `src/nav.tsx`, and compensate for **negative section margins** when scrolling.

## Step 2 — Hero

- `<picture>`: mobile portrait WebP/JPEG, then desktop.
- Cream “OUR STORY” + ghost “Ambience Maker”.
- Ambience click: `prepareJump("ambience")` and if radio is off, `toggleRadio()` so **song + loops** start (browser gesture). Default `music` volume is `0`; a plain `toggle()` would start rain but not the track.

## Step 3 — Story

- Polaroid (tape + torn clip-path + sepia photo) | paper column.
- `lang="ml"` on the copy.
- Overlap the mixer with `margin-top` negative + CSS mask fade so paper tears into wood.

## Step 4 — Data before UI chrome

In `src/data.ts` define:

- `SoundId`, `DEFAULT_VOLUMES`, `SOUND_META`
- `PRESETS` (Rain, Tea Time, Study, Monsoon, Night, Today)
- `RADIO_TRACKS` with local `src`
- `AMBIENCE_LOOPS` paths
- `GALLERY` + filters

UI should only **read** this file.

## Step 5 — Audio engine (the hard part)

See [AMBIENCE.md](./AMBIENCE.md) for the graph.

Teaching points:

1. **One** `AudioEngine` singleton. React must not create a new `AudioContext` per render.
2. `AudioProvider` (`context.tsx`) holds `playing`, `volumes`, vibe, spatial, sleep, track, master.
3. Browsers: `ctx.resume()` inside a click.
4. Each layer: generators or loop element → panner → gain → vibe filter → compressor → master.
5. If a loop file exists, play `<audio loop>`; else synthesize (noise, chirps, etc.).
6. Radio is a separate `<audio>` element. Pause radio ≠ stop rain.
7. `setVolume` above a whisper can auto-start the engine.

**Legal:** `public/audio/README.md` — only files you have rights to. Never clone another site’s song files.

## Step 6 — Mixer UI

`AmbiencePanel.tsx` on wood (`--img-wood`):

- 8-cell grid; radio is the 8th cell (not a full-width extra row on mobile).
- Each ambience card: both **rotary knob** and **gold-dot bar** bound to the same volume.
- Decorative scrap/polaroid: hide `≤980px`.
- Hero and mixer must share `AudioProvider` so mix continues on `/pomodoro`.

## Step 7 — Menu, gallery, footer

- Menu: one full-bleed `menu-board.jpg`.
- Gallery: CSS mosaic on desktop, 2-col on mobile; filters in `data.ts`.
- `Pic` component: `<picture>` + WebP + lazy `img` (eager only for hero).
- **Never** `display: contents` on gallery-footer / site-footer `<picture>` — `<source>` becomes extra grid items and shoves the seal off-screen. Style with `picture:has(.gal-quote)`.
- Footer: 4 perks, parchment (alpha), brand, follow, visit, stamp.

## Step 8 — Mobile

Use the ChatGPT mobile rules. Check at **390px** and **768px**. Hunt overflow (`document.scrollWidth > innerWidth`).

Typical fixes:

| Bug | Cause | Fix |
| --- | --- | --- |
| Parchment is a black box | JPEG killed alpha; `mix-blend-mode: multiply` | Restore PNG/WebP with alpha |
| Mixer is one long column | `grid-template-columns: 1fr` at 560px | Keep **2 columns** |
| Slider thumb sits on top of the bar | Default range styling | Taller input, `background-size` for the track, thumb `margin-top` |
| Story is 3000px of photo | Polaroid `height: 100%` + `min-height` on img | Cap polaroid width (~220px) and `object-fit: cover` |

## Step 9 — Speed and SEO

- Resize long edge, JPEG q≈82, sibling `.webp` (`scripts/optimize-images.py`).
- Keep PNG only when alpha matters (footer parchment, footer stamp, quote scrap).
- `index.html`: title, description, canonical, OG, Twitter, geo Kozhikode, JSON-LD in `#json-ld` (crawlers see it without JS).
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, apple-touch icon.

Canonical in this project: `https://guru177.github.io/chayakada/` (`SITE_URL` in `src/seo.ts`).

## Step 10 — Ship

```bash
npm run build    # tsc --noEmit && vite build
git add -A
git commit -m "Your why, not a file list."
git push origin master
```

GitHub Pages: build `dist`, set Pages to that folder (or the action you use). Update `SITE_URL` if the domain changes.

---

# Phase 4 — ChatGPT prompts while coding

Use ChatGPT (or Cursor) **per slice**, paste a screenshot, name the class.

**Layout**

```text
This is .gal-foot at 390px. Quote scrap, share CTA, seal stamp.
Make quote | seal on row 1, CTA full width row 2.
Do not use display:contents on the picture wrappers.
Give only the CSS for .gal-foot and children.
```

**Copy**

```text
Rewrite these 7 Malayalam paragraphs as tea history in Kerala,
not a shop founded in 1963. Keep the same heading. Literary register.
```

**Image**

```text
Give a tighter prompt for a torn parchment PNG with transparent
background, Malayalam quote, India 2 annas stamp, heart doodle.
No black rectangle behind the paper.
```

**Audio**

```text
Hero button currently calls audio.toggle(). DEFAULT_VOLUMES.music is 0.
I need one click to start ambience loops AND the current radio file.
Which existing API should I call and why?
```

(Answer for this codebase: `toggleRadio()` when not playing, or when `music < 0.05`.)

---

# Phase 5 — Teach it in a workshop (half day)

| Time | Activity |
| --- | --- |
| 20 min | Play the live site. Name the feeling (paper, rain, radio). |
| 25 min | Run the ChatGPT prompts (pitch → tokens → IA → one image prompt). |
| 20 min | Scaffold Vite, tokens, header, fake hero. |
| 30 min | Story polaroid + one Malayalam paragraph. |
| 40 min | `data.ts` + engine stub that plays one rain loop on click. |
| 30 min | One mixer card (knob + bar). |
| 20 min | Mobile 390px pass on that card. |
| 15 min | Rights talk: no stolen MP3s; WebP; SEO last not first. |

Homework: remaining 6 loops, radio file, gallery of 4 photos, footer.

---

# Phase 6 — Definition of done

- [ ] Click **Ambience Maker** in the hero: rain (or preset layers) **and** the song start; page scrolls to `#ambience`
- [ ] Preset pill loads a full mix; moving a knob clears the pill
- [ ] Radio pause does not kill rain
- [ ] Sleep pill can be cancelled
- [ ] Nav hashes reach the right section (including overlapping bands)
- [ ] 390px: mixer **2×4**, no horizontal scroll, story polaroid not full-bleed tall
- [ ] Quote/parchment show torn edges, not a black box
- [ ] `npm run build` passes
- [ ] No third-party song URLs in `data.ts`

---

## Where to read next

| Doc | Topic |
| --- | --- |
| [AMBIENCE.md](./AMBIENCE.md) | Controls + Web Audio graph |
| [public/audio/README.md](../public/audio/README.md) | How to add loops and songs |
| [README.md](../README.md) | How to run the app |

The design lives in ChatGPT notes and `src/styles.css`. The product logic lives in `src/data.ts` and `src/audio/engine.ts`. If you teach only three files, teach those.
