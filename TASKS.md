# Tasks — Jordyn's Bakes

Status as of 2026-08-30: nothing built yet. Tasks are grouped into milestones, roughly in build order — see [PLANNING.md](PLANNING.md) for the architecture, stack, and design decisions behind them. Check off tasks as they're completed; add anything newly discovered to "Discovered During Work" below, tagged with the milestone it belongs to.

## Milestone 0 — Project setup
- [x] Initialize the Next.js + Tailwind project — scaffolded with Next.js 16 (App Router, TypeScript, Turbopack) + Tailwind v4; `npm run build` and the dev server both verified working
- Set up the Supabase project (database + auth)
- Set up a Resend account and API key for transactional email
- Connect the repo to Vercel for deploys
- Set up `.env.local` and Vercel env vars for secrets (Supabase keys, Resend key)

## Milestone 1 — Design system
- Define Tailwind theme tokens for the blush/cream palette
- Pick and load the heading (serif/script) and body (sans-serif) typefaces
- Build the base layout shell (nav, footer, container widths), mobile-first

## Milestone 2 — Database schema
- Create the `orders` table
- Create the `settings` table with an `accepting_orders` boolean
- Set up `admin_users` via Supabase Auth (single user)
- Add row-level security: writes restricted as intended, customer PII readable by admin only

## Milestone 3 — Public pages
- Build the Home page: hero, intro, accepting/not-accepting status banner, CTAs
- Build the Gallery page: photo grid, filter by occasion category, lightbox view
- Build the About page: bio/story, lead-time expectations
- Build the FAQ page (optional for MVP)

## Milestone 4 — Order form
- Build the form with the full field set from PLANNING.md
- Add client- and server-side validation on required fields
- Add reference image upload (size/type limits) to storage
- Add a short-notice warning for event dates under the 2-week minimum lead time, and state that lead time up front on the form
- On submit: write the row to `orders`, email a confirmation to the customer, email a notification to Jordyn
- Build the submission confirmation screen

## Milestone 5 — Availability toggle
- Render the order form or a "not accepting orders" message based on `settings.accepting_orders`
- Add an optional notify-me email capture to the "not accepting orders" state

## Milestone 6 — Admin dashboard
- Build the auth-gated `/admin` route (Supabase Auth login)
- Build the order list view, newest first, with status shown
- Build the order detail view (full submitted fields + reference images)
- Add a status update control (New → Reviewing → Quoted → Confirmed → Completed → Declined)
- Add the `accepting_orders` toggle to the dashboard

## Milestone 7 — Content & assets
- Get a logo/wordmark decision from Jordyn
- Collect 15–30 curated cake/cupcake photos, tagged by occasion
- Get bio/about copy from Jordyn
- [x] Resolve the open questions in PLANNING.md — lead time is 2 weeks, pricing stays fully quote-on-request, admin access is single-admin (confirmed 2026-08-31)

## Milestone 8 — Polish & QA
- Do a full mobile viewport pass (primary traffic source)
- Optimize/responsive-size all gallery images
- Do an accessibility pass: contrast, form labels, keyboard navigation
- Verify no customer PII or reference images are exposed via public routes/APIs

## Milestone 9 — Launch
- Do the final production deploy to Vercel
- Point the Instagram bio link to the live site
- Smoke-test the order form and email delivery end-to-end in production

---

## Discovered During Work
_(Newly found tasks go here as they turn up, tagged with the milestone they belong to.)_

- [x] [Milestone 0] Initialize a git repository, make an initial commit, and push to a private GitHub repo — done: https://github.com/AiraDeCastro/Jordyns-Bakes (branch `main`)
- [x] [Milestone 0] Set up pre-commit quality gates (lint, test, build, `npm audit`) via Husky, and enforce Conventional Commits via commitlint — see CLAUDE.md "Commit workflow". Vitest + React Testing Library added since no test suite existed yet, with an initial smoke test for the Home page.
