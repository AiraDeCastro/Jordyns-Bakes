# Planning — Jordyn's Bakes

Technical plan derived from [PRD.md](PRD.md). This is the reference for vision, architecture, stack, and tooling while building. Full rationale lives in the PRD; this file is the condensed, implementation-facing version — if a decision here changes, update the PRD too so they don't drift apart.

## Vision

Jordyn's Bakes is a small custom cake/cupcake business (weddings, events, birthdays, holidays, graduations) currently run entirely through Instagram DMs. This app replaces that with:

- A showcase gallery of Jordyn's work, as polished as the cakes themselves — cute, clean, minimalist, beautiful.
- A structured order-**request** form that replaces back-and-forth DMs with one complete submission (occasion, date, size, flavors, design references).
- A single dashboard where Jordyn sees every request in one place, tracks its status, and controls whether she's accepting orders — without touching code.

It is **not** a storefront: no pricing engine, no checkout, no in-app payment. Every cake needs a human quote based on design, size, and date, so pricing and payment happen off-platform after Jordyn reviews a request. Single admin user (Jordyn) — no multi-user/role infrastructure.

**Target users:** the customer submitting a request (needs confidence they've given enough detail, and to know what to expect next), and Jordyn as admin (needs one place to review requests and toggle availability).

## Architecture

**Site map:** Home · Gallery (filterable by occasion) · Order form · About · FAQ (optional) · `/admin` (auth-gated, not linked from public nav).

**Key flows:**
- *Customer:* lands on Home (usually from the Instagram bio link) → browses Gallery → opens the order form → submits → sees a confirmation screen and receives a confirmation email → waits for Jordyn to follow up off-platform.
- *Admin:* Jordyn logs into `/admin` → sees new requests → opens one for full detail → contacts the customer to quote/confirm → updates its status → toggles site-wide availability if she's booked up.

**Data model** (Postgres via Supabase):

```
orders
  id, created_at, occasion, event_date, cake_type, servings,
  flavors, filling, design_description, reference_image_urls[],
  color_palette, dietary_notes, delivery_type, delivery_address,
  budget_range, customer_name, email, phone, referral_source,
  status, admin_notes

settings
  accepting_orders (boolean), updated_at
  -- drives whether the public order form or the "not accepting
  -- orders" message renders

admin_users
  managed via Supabase Auth — single user for MVP
```

Order `status` progresses: `New → Reviewing → Quoted → Confirmed → Completed → Declined`.

Schema, RLS policies, and grants are defined in [supabase/schema.sql](supabase/schema.sql) (run once via the Supabase SQL Editor) — live and verified against the actual project.

**RLS gotcha:** customers (`anon` role) can INSERT into `orders` but have no SELECT policy on it, by design — that's what keeps other people's order details private. Postgres RLS also checks the SELECT policy for any `RETURNING` clause, so requesting the inserted row back (`Prefer: return=representation`, or supabase-js `.insert().select()`) makes the whole insert fail even though the write itself is allowed. The order-form submit code uses plain `.insert()` without chaining `.select()` (`src/app/order/actions.ts`) — verified live.

**Reference image storage:** a private Supabase Storage bucket, `order-references` (5MB/file, image types only), created via the Storage API. Policies mirror `orders`: customers (`anon`) can upload but not read anything back (`supabase/storage_policies.sql`); only an authenticated admin can view uploaded files. Verified live — an anon read attempt gets a 404, not even a "forbidden," which is the better privacy behavior.

**Order form validation:** a zod schema (`src/lib/validation/order.ts`) is the single source of truth, checked again server-side in the Server Action even though the client also has HTML5 `required` validation. One gotcha worth remembering: a `<select>` always submits a value, even for its "nothing selected" placeholder option — a plain `z.enum(...).optional()` rejects that empty string as invalid rather than treating it as "not provided." Optional select fields use an `optionalEnum()` helper that treats `""` as `undefined`.

**Order form UX gotcha:** React resets a form's uncontrolled fields after any Server Action runs — including when the action returns a validation error — so an all-uncontrolled form loses everything the customer typed the moment one field is wrong. `OrderForm` keeps every text/select field controlled from one state object specifically to avoid this. (File inputs are the one exception — browsers don't allow controlling them, so a reference-image selection is lost on a validation error; that's a platform limitation, not something to work around.)

**Email delivery:** best-effort via `Promise.allSettled` (`src/lib/email.ts`, sent from `src/app/order/actions.ts`) — a failed email must never fail an otherwise-successful order submission. Verified live. Resend's sandbox sender (no domain verified yet) can only deliver to the account's own address; real customer emails will silently fail (logged server-side) until a domain is verified — see TASKS.md.

**Design system:** soft blush pink / cream / warm neutral palette, light and airy, never saturated — implemented as fixed CSS variables in `globals.css` (background, foreground, heading, muted, surface, accent, accent-deep, accent-tint, border); the palette does not switch with system dark mode, since it's the brand identity rather than a light/dark theme choice. Headings/logo use Fraunces (`font-display`); body and form text use Nunito Sans (`font-sans`), both loaded via `next/font/google`, legibility taking priority in the form. Generous white space, large uncropped cake photography, minimal chrome, soft rounded edges. A shared `Header`/`Footer`/`Container` shell lives in `src/components` and is wired into the root layout; each page's own root element needs a `flex-1` class to fill the space between them. Occasion categories used consistently across the gallery filter and order form — Weddings, Events, Birthdays, Holidays, Graduations, Other/Custom — mirroring Jordyn's existing Instagram highlights; don't rename without checking with her. Gallery photos are manually curated/uploaded, never scraped or hotlinked from Instagram.

**Non-functional priorities:** mobile-first (most traffic arrives from an Instagram bio link on a phone); optimized/responsive gallery images; accessible (contrast, labeled fields, full keyboard nav); customer contact info and uploaded reference images are admin-only, never exposed via a public route or API response.

**Order policy (confirmed):** minimum lead time is 2 weeks — the order form flags/warns on event dates selected under that, and this lead time is stated up front on the order form and About/FAQ pages. Pricing stays fully quote-on-request — no pricing ranges or guidance are shown anywhere on the site. Admin access is single-admin (Jordyn only), confirmed long-term rather than just an MVP placeholder.

**Explicitly out of scope for MVP:** payment/deposit collection, multi-admin roles, calendar/date-blocking logic, live Instagram feed sync, customer-facing status tracking, reviews/testimonials, SMS notifications.

## Technology stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (React) | One codebase for public site + admin, clean image handling, easy deploys |
| Styling | Tailwind CSS | Fast path to a consistent, minimalist look with a small custom palette |
| Database + Auth | Supabase (Postgres + built-in auth) | Order storage and a single admin login with no separate infrastructure |
| Transactional email | Resend | Confirmation email to customer, notification email to Jordyn |
| Image storage | Supabase Storage (or Cloudinary) | Gallery photos and uploaded reference images |
| Hosting | Vercel | Pairs naturally with Next.js; free tier covers this scale |

This keeps ongoing cost near zero at low order volume and needs no server maintenance.

## Required tools list

Things to have set up before/while developing:

| Tool / account | Purpose |
|---|---|
| Node.js (LTS) + npm/pnpm | Run and build the Next.js app locally |
| Git + a GitHub repo | Version control; Vercel deploys from this |
| Code editor (VS Code or similar) | Development |
| Supabase account + project | Postgres database, auth, storage |
| Supabase CLI *(optional)* | Local schema migrations/dev workflow |
| Vercel account, linked to the GitHub repo | Hosting and deploys (preview + production) |
| Resend account + API key | Sending confirmation/notification emails |
| Cloudinary account *(only if not using Supabase Storage)* | Alternate image hosting/optimization |
| `.env.local` for secrets (Supabase keys, Resend API key) — never committed | Local environment config |
| Google Fonts | Heading/body typefaces (no install — linked via CSS) |
| Instagram access (Jordyn) | Source of curated gallery photos and bio/about copy — not an API integration, just the content source |

## Open questions

None outstanding for MVP scope. The prior three (lead time, pricing display, single-admin access) were resolved 2026-08-31 — see the Order policy note under Architecture, and PRD §14 for the full record.
