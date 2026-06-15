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
