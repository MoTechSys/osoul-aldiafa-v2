# Refactor Log — osoul-aldiafa-v2 (Phase 1→4)

> Branch: master. Snapshot of original state preserved in branch `V1`.
> Rules: npm, Zero-Defect, conventional commits, gates (typecheck+lint+build) after each task.

## Phase 1 — Critical SEO Fixes

### Task 1.1 — Remove opacity:0 initial state from headings ✅
- **What:** Changed `initial={{ opacity: 0, ... }}` → `initial={false}` on H1/H2/label motion elements so headings are visible in SSR HTML (no hidden text to Googlebot).
- **Files:** LocalServicePage.tsx, HomePageClient.tsx, AboutClient.tsx, ContactClient.tsx, OfferingsClient.tsx, ServicesClient.tsx, PortfolioClient.tsx
- **Also:** added `typecheck` npm script (`tsc --noEmit`) — required by Zero-Defect gate.
- **Gates:** typecheck EXIT 0 · lint 0 warnings · build EXIT 0 (all pages built).
- **When:** 2026-06-15

### Task 1.2 — Convert LocalServicePage to Server Component ✅
- **What:** Removed `"use client"` and `motion/react` import from LocalServicePage.tsx. Created `src/components/animations/RevealOnScroll.tsx` — a 'use client' leaf that isolates the motion library and respects `prefers-reduced-motion`. The hero H1 now renders as a real server `<h1>` (wrapped in RevealOnScroll, `initial={false}`).
- **Why:** The SEO-critical city pages (10 of them) now render fully server-side; content reaches Googlebot in the initial HTML.
- **Verification (live):** `curl -A "Googlebot/2.1" /sababin-qahwa-jeddah` → H1 present in raw HTML, NO opacity:0. City page First Load JS 148kB → 146kB.
- **Gates:** typecheck EXIT 0 · lint 0 warnings · build EXIT 0.

### Task 1.3 — Replace per-city LocalBusiness with Service schema ✅
- **What:** Deleted `generateCityLocalBusinessSchema` entirely. Enhanced `generateServiceSchema` to accept `cityAr` (→ `areaServed: City`) + `serviceType`, referencing the single business entity via `provider.@id = /#business`. Updated all 10 city pages: removed the duplicate cityBusinessSchema import/const/<script>, passed cityAr+serviceType to the Service schema.
- **Why:** A LocalBusiness per city (incl. Makkah/Madinah with no real branch) signals fake local entities = doorway/spam pattern. Now each city page emits Service (→ one business @id) + Breadcrumb + FAQPage only.
- **Note:** The ONE legitimate LocalBusiness entity remains in layout.tsx (`generateLocalBusinessSchema`, @id /#business) with real branches (Yanbu/Badr/Jeddah) as `Place` — this is correct and required, not a duplicate.
- **Verification (live):** city page Service schema → `areaServed:{City,"جدة"}` + `@id .../#business`. No per-city LocalBusiness.
- **Gates:** typecheck EXIT 0 · lint 0 · build EXIT 0.

### Tasks 1.4, 1.5, 1.7, 1.8, 1.9, 1.11 (batch) ✅
- **1.4 sitemap lastModified:** `new Date()` → static `PUBLISHED = "2026-06-15"`. Live sitemap.xml now shows a single stable date. (Google keeps trust in lastmod.)
- **1.5 hreflang:** removed `languages: { "ar-SA" }` from layout.tsx + SEO.tsx (monolingual site). Live: no hreflang tags.
- **1.7 priority:** kept on the two real LCP heroes (HomePageClient hero, LocalServicePage hero); removed from logo (HomePageClient:245), offerings lightbox, portfolio lightbox.
- **1.8 maximumScale:** removed `maximumScale: 5` from viewport (WCAG 2.1 SC 1.4.4). Live: no maximum-scale.
- **1.9 jsonLd:** added U+2028 / U+2029 escaping (now 5 escape sequences).
- **1.11 GA env-only:** removed hardcoded DEFAULT_GA_ID from Analytics.tsx; now reads NEXT_PUBLIC_GA_ID only.
- **Gates:** typecheck EXIT 0 · lint 0 · build EXIT 0.
- ⚠️ OWNER ACTION: ensure `NEXT_PUBLIC_GA_ID=G-TLRS7CGGGY` is set in Vercel env (Production+Preview) or GA stops tracking after this deploy.

### Task 1.10 — Tighten tsconfig.json ✅ (with one documented deviation)
- **What:** Enabled `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noImplicitReturns`, `forceConsistentCasingInFileNames` (all on top of existing `strict: true`). Fixed the resulting real bug: BottomNav.tsx useEffect now returns `undefined` on all paths (noImplicitReturns). Added `if (!c) throw` guards in localContent.tsx.
- **DEVIATION (owner-authorised "make the smartest call"):** `noUncheckedIndexedAccess` was NOT enabled. Enabling it produced 100+ errors, ALL from fixed-index access into static, known-length data arrays (e.g. `PRODUCT_IMAGES[8]`, `CITIES[p.city]` inside maps over the same source). These indexes are guaranteed at author time, so the flag would add 100+ high-risk edits with no real safety value — exactly the "noise without value" the skill warns against. Kept every other valuable strict flag instead. Revisit if the data layer moves to dynamic sources.
- **Gates:** typecheck EXIT 0 · lint 0 · build EXIT 0.

## Phase 2 — selected tasks (owner authorised "do what's best")
Decision: executed the high-value, zero/low-risk tasks (2.4 internal links; 2.1 deferred — needs real owner content). SKIPPED 2.2/2.3 (dynamic-route consolidation) — the 10 city pages are already indexed & ranking; consolidation is a maintenance win, not an SEO win, and risks breaking live indexed URLs. Revisit later if desired.

### Task 2.4 — Home → city internal links ✅
- **What:** New Server Component `src/components/ServiceAreas.tsx` rendering 10 descriptive-anchor links (service × city), inserted into the homepage server tree (`app/page.tsx`).
- **Why:** Home previously had ZERO direct links to local landing pages (crawl-path + PageRank gap, audit H9).
- **Verification (live):** Googlebot sees all 10 city links in homepage HTML (server-rendered).
- **Gates:** typecheck EXIT 0 · lint 0 · build EXIT 0.

## Phase 4 — Quality gates (high-value subset)
### Task 4.1 — Error boundaries ✅ (opengraph-image deferred)
- **What:** Added `src/app/error.tsx` (route-level branded Error Boundary, 'use client') and `src/app/global-error.tsx` (root-layout error fallback with own html/body). Protects against the white-screen-of-death on runtime errors. (`loading.tsx` + `not-found.tsx` already existed.)
- **opengraph-image.tsx DEFERRED:** dynamic OG via ImageResponse failed prerender because Arabic text needs an embedded font file in the ImageResponse (default fonts don't cover Arabic glyphs). The site already ships a static OG image, so removed the dynamic one to keep master building. Revisit by bundling a TTF (e.g. Amiri) and passing it via `fonts:` in ImageResponse.
- **Gates:** typecheck EXIT 0 · lint 0 · build EXIT 0.

### Task 4.2 — Testing stack (Vitest first) ✅
- **What:** Added Vitest (`vitest.config.ts`, `@` alias, node env) + `npm test` / `npm run test:watch` scripts. Wrote `src/lib/schema.test.ts` (4 tests): jsonLd escaping covers all 5 sequences + stays valid JSON; generateServiceSchema references single business @id, City areaServed, Country fallback.
- **Result:** 4/4 tests pass. Guards the SEO-critical schema/escaping logic against regressions.
- **Note:** Playwright E2E + Lighthouse CI + axe + size-limit not yet added (heavier; Vitest covers the highest-risk pure logic now). Can extend later.
- **Gates:** test EXIT 0 · typecheck EXIT 0 · lint 0 · build EXIT 0.

## Phase 3 — Stack Upgrade: DEFERRED (risk decision)
Next 14→16 + React 18→19 + Tailwind 3→4 is THREE simultaneous major upgrades on a live, indexed site that leans on `motion`, `embla-carousel`, and extensive Tailwind 3 config. High breakage risk, ~zero SEO upside (site is already fast: 87KB shared JS, good LCP, single LCP priority image). Per owner's "do what's best" + the non-negotiable "never leave master broken", this is deferred deliberately rather than rushed. Recommend doing it later as its own isolated effort with full regression testing (the Vitest base from 4.2 helps).

## FINAL STATE
master is green: test + typecheck + lint + build all EXIT 0. All work pushed. Original state preserved in branch V1.
Completed: Phase 1 (all 10 tasks), Phase 2.4, Phase 4.1 (error boundaries) + 4.2 (Vitest).
Deferred (documented): 1.10 noUncheckedIndexedAccess, 2.1 real content (needs owner), 2.2/2.3 dynamic routes (risk vs indexed pages), 3.x stack upgrade, 4.1 dynamic OG (needs Arabic font), 4.2 Playwright/Lighthouse/axe/size-limit, 4.3 CI workflows.

### Task 4.1b — Dynamic opengraph-image (now WORKING) ✅
- **What:** Re-added `src/app/opengraph-image.tsx` (ImageResponse, 1200×630, branded gradient + Arabic copy) with an embedded font under `src/app/_fonts/`.
- **Font fix:** Amiri failed in @vercel/og Satori ("lookupType 5 substFormat 3 not supported" — advanced Arabic ligatures). Switched to **Tajawal** (simple sans, 60KB) → builds & prerenders clean.
- **Scope:** Provides an automatic branded OG for routes without a custom OG image. Homepage keeps its existing dedicated og-image.jpg (its manual openGraph.images override stays).
- **Gates:** build EXIT 0 (opengraph-image prerenders) · typecheck 0 · lint 0 · test 4/4.

### Task 4.2b — Playwright E2E (critical path) ✅
- **What:** Added Playwright (@playwright/test + chromium) with `playwright.config.ts` (auto build+serve on :3200) and `tests/e2e/critical-path.spec.ts` (4 tests): homepage→10 city links, city H1 visible & non-transparent in DOM, WhatsApp CTA → wa.me, city page emits Service schema referencing #business.
- **REAL BUG FOUND & FIXED:** the E2E surfaced that the city hero H1 was rendered via `whileInView` (RevealOnScroll), so it sat at opacity:0 until scrolled into view — visually a flash/hidden-text for users on an above-the-fold heading. Fixed: hero H1 is now a plain server `<h1>` (renders immediately, never transparent). RevealOnScroll kept (with new `immediate` option) for below-the-fold use.
- **Local-env note:** initial E2E runs failed with MIME-400/ChunkLoadError — caused by a stale/zombie `next-server` holding the port (per web-deploy-vercel-ops lesson). Fixed by killing the exact PID on the port + `reuseExistingServer:false`; not a code issue. Added test-results/ to .gitignore.
- **Result:** 4/4 E2E pass · 4/4 unit pass.
- **Gates:** typecheck 0 · lint 0 · build 0 · unit 4/4 · e2e 4/4.
