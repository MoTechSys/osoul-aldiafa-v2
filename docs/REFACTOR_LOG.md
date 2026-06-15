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
