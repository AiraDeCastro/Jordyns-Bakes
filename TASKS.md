# Tasks — Jordyn's Bakes

Status as of 2026-09-01: Milestones 0 (project setup), 1 (design system), 2 (database schema), and 3 (public pages) complete. Tasks are grouped into milestones, roughly in build order — see [PLANNING.md](PLANNING.md) for the architecture, stack, and design decisions behind them. Check off tasks as they're completed; add anything newly discovered to "Discovered During Work" below, tagged with the milestone it belongs to.

## Milestone 0 — Project setup
- [x] Initialize the Next.js + Tailwind project — scaffolded with Next.js 16 (App Router, TypeScript, Turbopack) + Tailwind v4; `npm run build` and the dev server both verified working
- [x] Set up the Supabase project (database + auth) — project created, URL/publishable key/secret key saved in `.env.local` (git-ignored; documented in `.env.example`)
- [x] Set up a Resend account and API key for transactional email — key saved in `.env.local`; sending is limited to your own inbox until a domain is verified with Resend later
- [x] Connect the repo to Vercel for deploys — imported from GitHub, live at https://jordyns-bakes.vercel.app (auto-deploys on every push to `main`)
- [x] Set up `.env.local` and Vercel env vars for secrets (Supabase keys, Resend key) — all 4 saved locally in `.env.local` (git-ignored) and in Vercel's Environment Variables settings (public ones kept public/Config, service-role and Resend keys kept as Secret)

## Milestone 1 — Design system
- [x] Define Tailwind theme tokens for the blush/cream palette — brand colors added as CSS variables in `globals.css` (background, foreground, heading, muted, surface, accent, accent-deep, accent-tint, border), fixed rather than dark-mode-switching
- [x] Pick and load the heading (serif/script) and body (sans-serif) typefaces — Fraunces (headings, `font-display`) and Nunito Sans (body, `font-sans`) via `next/font/google`
- [x] Build the base layout shell (nav, footer, container widths), mobile-first — `Header`, `Footer`, and `Container` components added, wired into the root layout; verified responsive in the browser at mobile and desktop widths

## Milestone 2 — Database schema
- [x] Create the `orders` table — see `supabase/schema.sql`
- [x] Create the `settings` table with an `accepting_orders` boolean — seeded with one row, `accepting_orders = true`
- [x] Set up `admin_users` via Supabase Auth (single user) — one user created in Supabase Authentication (email can be swapped to Jordyn's later with zero data impact, since nothing references the specific user)
- [x] Add row-level security: writes restricted as intended, customer PII readable by admin only — verified live: customers can submit orders but can't read any orders back (including their own just-submitted one); the accepting-orders switch is publicly readable but only admin-editable

## Milestone 3 — Public pages
- [x] Build the Home page: hero, intro, accepting/not-accepting status banner, CTAs — status banner reads the live `settings.accepting_orders` value from Supabase on every request (verified against the real database)
- [x] Build the Gallery page: photo grid, filter by occasion category, lightbox view — verified filtering and the lightbox interaction live in the browser; uses placeholder illustrated cards until real photos exist (Milestone 7)
- [x] Build the About page: bio/story, lead-time expectations — bio text is a placeholder draft pending Jordyn's real copy (Milestone 7)
- [x] Build the FAQ page (optional for MVP) — built with real, decided answers (lead time, quoting, delivery/pickup, dietary)

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
- [x] [Milestone 3] The root layout (`src/app/layout.tsx`) renders `<Header />{children}<Footer />` directly inside a flex-column `<body>`, with no extra wrapper div. Each page's own top-level element needs a `flex-1` class (as the current placeholder Home page already has) so it fills the space between header and footer — remember this when building the real Home/Gallery/About/FAQ pages. Done: all four pages follow this.
- [Milestone 4] When writing the order-form submit code, use a plain `.insert()` call with no chained `.select()` (and don't set `Prefer: return=representation`) — see the RLS gotcha noted in PLANNING.md. Confirmed live during Milestone 2 testing: requesting the inserted row back makes the whole submit fail for customers, since they correctly have no read access to the `orders` table.
- [Milestone 3] Any page that reads live data from Supabase (like the Home page's `accepting_orders` banner) needs `export const dynamic = "force-dynamic"`, or Next.js will statically prerender it at build time and freeze the value until the next deploy. Caught this on Home — double-check the same applies wherever Milestone 5 (availability toggle) reads this setting.
- [Milestone 7] Placeholder content to swap for the real thing: `src/lib/gallery-items.ts` (illustrated placeholder cards, no real photos yet) and the bio paragraph in `src/app/about/page.tsx` (draft copy, not Jordyn's actual words).
