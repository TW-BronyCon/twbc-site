<!--
Thank you for contributing to the TWBC Site!
Please fill out this template to help speed up review.
-->

## Description

Provide a brief description of the changes introduced by this pull request.

## Related Issues

- Closes # (if applicable)

## Type of Change

- [ ] `feat`: New user-facing feature/behavior
- [ ] `fix`: User-facing bug fix
- [ ] `refactor`: Structural changes without changing behavior
- [ ] `chore`: Dependency updates, i18n updates, or configs
- [ ] `docs` / `ci` / `test`: Documentation, workflow, or testing updates

---

## 🛠 Pre-merge Checklist

### 1. Automated Checks (Local verification)

Run the following locally before pushing:

- [ ] `npm run format:check` passes without errors.
- [ ] `npm run i18n:check` passes (no missing/unused translation keys).
- [ ] `npm run typecheck` passes with no TypeScript errors.
- [ ] `npm run build` succeeds.

### 2. Manual QA Verification (Select affected pages to manually test)

Perform manual checks on **both desktop and mobile viewports** in **English (`en`) and Traditional Chinese (`zh-TW`)** for any areas affected by this PR:

- [ ] **Global Elements** (Nav, Footer, Background, Watermark)
- [ ] **Home Page** (`home.vue`)
- [ ] **News Page** (`news.vue`)
- [ ] **Ticket Page** (`ticket.vue`)
- [ ] **Schedule Page** (`schedule.vue`)
- [ ] **Venue Page** (`venue.vue`)
- [ ] **Booths List & Detail** (`booths/index.vue`, `[id].vue`)
- [ ] **Transport Page** (`transport.vue`)

<details>
<summary>🔍 View Detailed QA Steps & Feature Checklist (Click to expand)</summary>

#### Global Elements

- **Navigation Menu (`SiteNav.vue`)**:
  - Mobile hamburger toggle works.
  - Links navigate to correct locations.
  - Hover/active states are styled correctly (gold text, text-shadow glow).
  - "Apply" submenu items work as expected.
- **Footer (`Footer.vue`)**:
  - Social icons open in new tabs with `target="_blank"` and `rel="noopener noreferrer"`.
  - Language switcher toggles between locales.
  - Quotes rotation animations fade in/out every 10 seconds.
- **Background & Watermark**:
  - Dev watermark is present in dev/preview without blocking page input.
  - Animated starry background scrolls smoothly without lag.

#### Home Page (`home.vue`)

- TWBC Logo and date display are responsive and fit cleanly.
- Countdown timer ticks down correctly and displays days/hours/minutes/seconds.
- Countdown transition animations (`digit-slide`) run smoothly.
- CTA "Buy Ticket" button directs to `/ticket` page.
- Location section map loads lazily, fits layout, and displays coordinates correctly.
- FAQ questions (q1-q4) and answers (a1-a4) render correctly.

#### News Page (`news.vue`)

- Envelope list cards render with randomized rotation angles.
- Hover glow animation triggers correctly.
- Clicking sealed envelope runs crack-animation and opens the modal.
- News content modal locks tab focus inside via `handleModalTab`.
- Modal closes correctly via ESC key or clicking outside.
- Opened state is persisted correctly in `localStorage`.

#### Ticket Page (`ticket.vue`)

- Toggle between card/table views functions seamlessly.
- Cards show tier prices, styled colors, and accurate Google Form CTA links.
- Expiration check disables buttons automatically if cutoff date has passed.
- Comparison table highlights current row and column on cell hover.

#### Schedule Page (`schedule.vue`)

- Timetable grids map properly onto columns based on active language track labels.
- Timeline grid coordinates and times align accurately on side borders.
- Clicking an event block pops open the detail modal with speaker information.
- Background elements are set to `inert` when modal is active.
- Modal closes correctly via ESC key, clicking backdrop, or close button.

#### Venue Page (`venue.vue`)

- SVG Map zooms/pans via control buttons, mouse dragging, and pinch-to-zoom gestures.
- Hovering/clicking interactive zones and individual booths updates status panels.
- Clicking a zone retrieves the correct scheduled events in the sidebar panel.
- Details panel allows clicking through to booth detail pages.

#### Booths List (`booths/index.vue`) & Detail (`booths/[id].vue`)

- Index grid displays correct booth images, badges, and quick social links.
- Detail page header handles localized content and handles Not Found case.
- Photo gallery displays active preview image; clicking updates selector.
- Main image opens Lightbox on click/keydown (Enter/Space); focus trapped; closes on ESC.

#### Transport Page (`transport.vue`)

- MRT, Bus, and Driving info cards display properly.
- Map iframe embed loads lazily and fills column space.
- Grid transitions into a single-column layout on mobile (<850px).

</details>

---

### 3. Coding Guidelines & Standards Compliance

- [ ] **TS / Strict Typing**: All variables, props, emits, and composables have explicit types. No usage of `any`.
- [ ] **Composition API**: Vue components use `<script setup lang="ts">`.
- [ ] **No CJK-Latin Spaces**: i18n files and template text contain no literal spaces between CJK and alphanumeric characters.
- [ ] **i18n Implementation**: All UI strings are translated via `$t` or `useI18n` (no hardcoded text).
- [ ] **Vanilla CSS Styling**: Component styles are scoped (`<style scoped>`) and use CSS variables from `variables.css`.
- [ ] **PageLayout Wrapper**: All content pages (except index/home) wrap their layout in `PageLayout.vue`.
- [ ] **SEO & Metadata**: Page title and meta descriptions are set via `useSeoMeta` or `useHead`.
- [ ] **Asset Optimization**: Images are WebP/AVIF format with defined width and height attributes to avoid CLS.
- [ ] **Comment Preservation**: Existing comments and contextual documentation are preserved.
