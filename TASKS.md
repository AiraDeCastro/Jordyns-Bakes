# Tasks — Jordyn's Bakes

Status as of 2026-09-02: Milestones 0 (project setup), 1 (design system), 2 (database schema), 3 (public pages), 4 (order form), 5 (availability toggle), 6 (admin dashboard), and 8 (polish & QA) complete. Milestone 7 (content & assets) is partial — bio drafted, real photos and logo decision still pending from Jordyn. Tasks are grouped into milestones, roughly in build order — see [PLANNING.md](PLANNING.md) for the architecture, stack, and design decisions behind them. Check off tasks as they're completed; add anything newly discovered to "Discovered During Work" below, tagged with the milestone it belongs to.

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
- [x] Build the form with the full field set from PLANNING.md — `src/components/OrderForm.tsx`
- [x] Add client- and server-side validation on required fields — HTML5 `required` client-side, zod schema (`src/lib/validation/order.ts`) re-validated server-side in the Server Action
- [x] Add reference image upload (size/type limits) to storage — private `order-references` Supabase Storage bucket (5MB/file, image types only), verified live: customers can upload but not read anything back
- [x] Add a short-notice warning for event dates under the 2-week minimum lead time, and state that lead time up front on the form
- [x] On submit: write the row to `orders`, email a confirmation to the customer, email a notification to Jordyn — email sending is best-effort (`Promise.allSettled`) so a failed email never fails the order; verified live that a bad email address logs an error but the order still saves
- [x] Build the submission confirmation screen

## Milestone 5 — Availability toggle
- [x] Render the order form or a "not accepting orders" message based on `settings.accepting_orders` — `src/app/order/page.tsx`, `force-dynamic` so it always reflects the live value; verified both states live, including that the Home page banner updates too
- [x] Add an optional notify-me email capture to the "not accepting orders" state — new `notify_signups` table (same anon-can-insert/admin-only-read pattern as `orders`); verified live end-to-end including duplicate-signup handling

## Milestone 6 — Admin dashboard
- [x] Build the auth-gated `/admin` route (Supabase Auth login) — Supabase SSR (`@supabase/ssr`) with a `proxy.ts` gate plus a belt-and-suspenders check in the dashboard layout; verified live with a throwaway admin account (created and deleted via the Admin API) that unauthenticated visits redirect to `/admin/login`, login works, and sign-out actually clears the session
- [x] Build the order list view, newest first, with status shown — `src/app/admin/(dashboard)/OrdersTable.tsx`
- [x] Build the order detail view (full submitted fields + reference images) — reference images shown via time-limited signed URLs (private bucket, no public links)
- [x] Add a status update control (New → Reviewing → Quoted → Confirmed → Completed → Declined) — verified live, change persisted to the database and showed up back on the list
- [x] Add the `accepting_orders` toggle to the dashboard — verified live in both directions, and confirmed the Home/Order pages picked up the change immediately (no redeploy needed)
- [x] Also show `notify_signups` in the dashboard (carried over from the Milestone 5 discovery) — `src/app/admin/(dashboard)/NotifySignupsList.tsx`
- [x] Add a delete/decline button on the order detail page, and a "Previous order requests" section (Completed/Declined) below the notify-signups list — added post-launch, not in the original plan. `deleteOrder` action, `DeleteOrderButton` (confirm-before-submit, since deletion is irreversible), a one-click "Decline" shortcut, and the dashboard split into active vs. previous orders. DELETE RLS policy run and re-verified live with a fresh throwaway admin/order: anon still can't delete, authenticated admin now can — confirmed the row was actually removed, not just a silent no-op.

## Milestone 7 — Content & assets
- Get a logo/wordmark decision from Jordyn — deferred: keeping the styled-text wordmark (already live) until it's confirmed whether Jordyn wants a custom logo made
- Collect 15–30 curated cake/cupcake photos, tagged by occasion — not started; decided to pitch the site to Jordyn first using the existing illustrated placeholder gallery (each card is clearly labeled "Sample placeholder — real photos coming soon") rather than substitute other bakers'/photographers' photos from Pinterest as stand-ins, which would misattribute real work as Jordyn's own. Swap in her real photos once she sends them.
- Draft bio/about copy — done, draft copy live on the About page (`src/app/about/page.tsx`), written from known facts only (no fabricated personal history); still needs Jordyn's edits/approval before treating it as final
- [x] Resolve the open questions in PLANNING.md — lead time is 2 weeks, pricing stays fully quote-on-request, admin access is single-admin (confirmed 2026-08-31)

## Milestone 8 — Polish & QA
- [x] Do a full mobile viewport pass (primary traffic source) — checked Home, Gallery (+ lightbox), Order form, About, FAQ, and Admin login at 375px; no layout issues found. Admin dashboard/order-detail pages verified via code review (same mobile-first `sm:` breakpoint pattern used everywhere else, plus `overflow-x-auto` on the orders table) rather than live click-through — a browser-pane display issue blocked clicks partway through this session, unrelated to the site itself.
- [x] Optimize/responsive-size all gallery images — `GalleryItem` now supports an optional `imageSrc`; `GalleryGrid` renders `next/image` (responsive `sizes`, lazy-loaded, auto-optimized) once a real photo exists, falling back to the illustration otherwise. Means Milestone 7's real photos need zero extra code — just add the file and set `imageSrc`.
- [x] Do an accessibility pass: contrast, form labels, keyboard navigation — computed actual WCAG contrast ratios (not eyeballed) and found two real AA failures: `--muted` text (3.86:1 on the page background) and `--accent-deep` on `--accent-tint` (4.07:1, used in the status banner and every pill/badge). Darkened both tokens to pass with margin (4.5–6.2:1) in `globals.css`. Also strengthened focus-visible styles on every form input (a color-only border change is a weak keyboard focus indicator) and added proper focus management to the Gallery lightbox (moves focus in on open, returns it to the triggering card on close) — covered by a regression test. Form labels were already correctly associated (confirmed via passing `getByLabelText` queries throughout the test suite).
- [x] Verify no customer PII or reference images are exposed via public routes/APIs — re-verified live: anon can't SELECT `orders` or `notify_signups`, can't list/read the storage bucket, and an anon UPDATE attempt on `settings` returns success but silently changes nothing (RLS-filtered before the write applies — confirmed via `updated_at` not changing). Confirmed `SUPABASE_SERVICE_ROLE_KEY` is never referenced anywhere in `src/` — only in ad-hoc verification scripts. Added `src/app/robots.ts` disallowing `/admin` as defense-in-depth (it's already auth-gated; this just keeps it out of search indexes too).

## Milestone 9 — Launch
- [x] Do the final production deploy to Vercel — confirmed live and current at https://jordyns-bakes.vercel.app
- Point the Instagram bio link to the live site — needs Jordyn (her Instagram account)
- [x] Smoke-test the order form and email delivery end-to-end in production — full pipeline verified live: submitted a real order on production, confirmed it landed correctly in the database, saw the success screen, and confirmed both the customer confirmation email and the admin notification email actually arrived (using the account owner's own address for both, since Resend has no verified sending domain yet). Also verified admin login/dashboard/sign-out on the real production URL for the first time (previously only tested on localhost), using a throwaway test account created and deleted via the Supabase Admin API. All test data cleaned up afterward.

---

## Discovered During Work
_(Newly found tasks go here as they turn up, tagged with the milestone they belong to.)_

- [x] [Milestone 0] Initialize a git repository, make an initial commit, and push to a private GitHub repo — done: https://github.com/AiraDeCastro/Jordyns-Bakes (branch `main`)
- [x] [Milestone 0] Set up pre-commit quality gates (lint, test, build, `npm audit`) via Husky, and enforce Conventional Commits via commitlint — see CLAUDE.md "Commit workflow". Vitest + React Testing Library added since no test suite existed yet, with an initial smoke test for the Home page.
- [x] [Milestone 3] The root layout (`src/app/layout.tsx`) renders `<Header />{children}<Footer />` directly inside a flex-column `<body>`, with no extra wrapper div. Each page's own top-level element needs a `flex-1` class (as the current placeholder Home page already has) so it fills the space between header and footer — remember this when building the real Home/Gallery/About/FAQ pages. Done: all four pages follow this.
- [x] [Milestone 4] When writing the order-form submit code, use a plain `.insert()` call with no chained `.select()` (and don't set `Prefer: return=representation`) — see the RLS gotcha noted in PLANNING.md. Confirmed live during Milestone 2 testing: requesting the inserted row back makes the whole submit fail for customers, since they correctly have no read access to the `orders` table. Done: `src/app/order/actions.ts` follows this.
- [Milestone 3] Any page that reads live data from Supabase (like the Home page's `accepting_orders` banner) needs `export const dynamic = "force-dynamic"`, or Next.js will statically prerender it at build time and freeze the value until the next deploy. Caught this on Home — double-check the same applies wherever Milestone 5 (availability toggle) reads this setting.
- [Milestone 7] Placeholder content to swap for the real thing: `src/lib/gallery-items.ts` (illustrated placeholder cards, no real photos yet) and the bio paragraph in `src/app/about/page.tsx` (draft copy, not Jordyn's actual words).
- [x] [Milestone 4] Found and reconciled a leftover, uncommitted duplicate `OrderForm.tsx` under `src/components/` that predated this session's work and referenced option constants that didn't exist. Consolidated into one working component at `src/components/OrderForm.tsx` (the project's established location for shared components); no other duplicates found.
- [x] [Milestone 4] Real bug found via live testing: optional dropdown fields (`budgetRange`, `referralSource`) submit `""` for their unselected placeholder option, which `z.enum(...).optional()` rejects as an invalid value (empty string isn't "missing"). Fixed with an `optionalEnum()` helper in `src/lib/validation/order.ts` that treats `""` as not-provided. Covered by a regression test.
- [x] [Milestone 4] Real bug found via live testing: React resets a form's uncontrolled fields after any Server Action runs, including on a validation error — so a customer who mistyped one field would lose every other field they'd filled in. Fixed by making every text/select field in `OrderForm` fully controlled from one state object. Covered by a regression test. (File uploads can't be controlled by React and will still clear on error — an inherent browser limitation, not something to try to work around.)
- [Milestone 0 / ongoing] Vercel's environment variables need the new `ADMIN_NOTIFICATION_EMAIL` var added (same value as `.env.local`) — it exists locally but hasn't been added to the Vercel project settings yet, so the live site's order notification email won't send until that's done.
- [Milestone 7 / launch] Customer confirmation emails currently fail for any real customer address — verified live (Resend's sandbox sender only accepts the account owner's own address until a domain is verified). Not a code bug; needs a verified sending domain before launch.
- [x] [Milestone 6] The admin dashboard should also let Jordyn view `notify_signups` (people who asked to be told when orders reopen), not just `orders` — otherwise those signups are collected but nobody ever sees them. Done: see Milestone 6 above.
- [x] [Milestone 0] `.claude/launch.json` needed `"autoPort": true` added — a live production dev server for a different chat session was already holding port 3000, and without this the local dev server refuses to start when that happens.
- [x] [Milestone 6] Next.js 16 deprecated the `middleware.ts` file convention in favor of `proxy.ts` (same behavior, function renamed from `middleware` to `proxy`) — caught this from a build warning per AGENTS.md's instruction to check for breaking changes, and migrated rather than leaving deprecated code. The Next.js docs also note that a matcher/route change can silently remove proxy coverage, so each Server Action and page under `/admin` should keep checking auth itself rather than relying on the proxy alone — already the case here (see the dashboard layout's own `getUser()` check).
