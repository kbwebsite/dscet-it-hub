# DSCET · Department of Information Technology — Official Digital Hub

Premium department website for the **Department of Information Technology**,
**Dhanalakshmi Srinivasan College of Engineering and Technology (DSCET)**,
Mamallapuram, Chengalpattu District, Tamil Nadu, India.

React 18 + TypeScript + Vite 5 + Tailwind v4 + Framer Motion + GSAP + Lucide.

## Quickstart

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build → dist/
npm run preview  # serve dist/
```

## Official-data mode

Verified facts cite **dscet.ac.in** (see `VerifiedBadge` components).
Anything unverified renders **"Information will be updated."** — never invented.

Verified so far: est. 2001 · HOD name (Dr. Ravikumar) · vision/mission/PEOs ·
milestones (2012 affiliation, 2022 intake 60→120, NBA 2023, 2024 intake →240) ·
B.Tech IT POs/PSOs/eligibility/TNEA · 3 labs · 2 patents · 8 journal papers ·
4 MoUs · 500-book dept. library (8:30 AM–3:30 PM) · Oracle certification ·
college contact (044-27442844, dscet@yahoo.co.in).

## Content architecture (admin-ready)

```
src/data/department.ts   about · vision · mission · PEOs · milestones · highlights
src/data/faculty.ts      typed directory (empty — awaiting official roster)
src/data/programs.ts     B.Tech IT · POs · PSOs · eligibility · TNEA
src/data/labs.ts         3 verified labs
src/data/research.ts     areas (evidenced vs interest) · MoUs · pending notes
src/data/publications.ts 8 verified papers (year/author/journal filters)
src/data/patents.ts      2 verified published patents
src/data/events.ts       structure + honest pending state
src/data/news.ts         structure + honest pending state
src/data/projects.ts     categories + pending state
src/data/achievements.ts verified recognition only
src/data/resources.ts    official doc links · library · timetable/calendar pending
src/data/alumni.ts       structure (no invented identities) · gallery cats
```

Replace any array with an API fetcher — UI stays untouched.
Auth boundary stubbed in `src/auth.tsx` (student/faculty/admin + ProtectedRoute).

## Routes

`/`, `/about`, `/academics`, `/faculty`, `/faculty/:id`, `/research`, `/labs`,
`/facilities`, `/students`, `/placements`, `/events`, `/news`, `/achievements`,
`/timetable`, `/calendar`, `/resources`, `/alumni`, `/gallery`, `/contact`,
`/search`, `/login`

## QA

- `npm test` ✅ (22 unit tests: event lifecycle, countdowns, permissions, embeds, seed, storage)
- `npx tsc --noEmit` ✅ · `npm run build` ✅
- Preview serves HTTP 200 ✅ · every nav target maps to a route · 404 page
- Search (`/` or Ctrl+K) across labs, programs, areas, publications, patents, docs
- Dark/light persisted · `prefers-reduced-motion` respected · skip-link, ARIA, semantic HTML
- SEO: DSCET-IT titles/meta/keywords, canonical, JSON-LD, sitemap, robots

## Department Digital Platform (`src/portal/`)

Role portals (Student/Faculty/HOD/Admin) with a typed mock backend, persistent
demo sessions, per-second countdown engine, department calendar, Live TV page,
notification center and audit trail. Enter at `/portal/login`.

## Production cutover guide

The portal is demo-complete with clearly-marked sample data. To go live:

1. **Auth** — replace `loginAs`/`logout` in `src/portal/store.tsx` with college
   SSO (OIDC); keep the `Role` union and `RequireRole` guards unchanged.
2. **Data** — swap `loadDB`/`saveDB` in `src/portal/mockdb.ts` for SIS REST
   calls; every mutation already funnels through one `commit()` point, and the
   audit trail records actor/role/action/detail for compliance.
3. **Realtime** — subscribe to WebSocket/SSE inside `PortalProvider` and merge
   into the same state; countdowns and LIVE transitions already poll via `useNow`.
4. **Parents** — add a `parent` role reusing the `audience` targeting and guards;
   keep it disabled until the institution approves.
5. **Content** — replace placeholder gallery/seed records with verified feeds;
   never mix demo data into public verified pages.
