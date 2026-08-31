# Jordyn's Bakes — Product Requirements Document

**Owner:** Jordyn McIntosh (@jordynsbakes)
**Status:** Draft v1
**Last updated:** 2026-08-30

## 1. Overview

Jordyn's Bakes is a small custom cake/cupcake business (weddings, events, birthdays, holidays, graduations) currently run entirely through Instagram DMs. This PRD covers a small marketing + ordering web app that:

- Showcases Jordyn's cake and cupcake work in a beautiful, on-brand gallery.
- Replaces DM-based ordering with a structured order request form.
- Gives Jordyn a simple dashboard to see, manage, and respond to incoming order requests.

The app is **not** a storefront or payment processor — pricing and payment happen off-platform (Venmo/Zelle/etc.) after Jordyn reviews and confirms a request. This matches how custom-cake orders actually work: every order needs a human quote based on design complexity, size, and date.

## 2. Goals

- Make it effortless for a customer to submit a complete, unambiguous order request (occasion, date, size, flavors, design references) instead of a back-and-forth DM thread.
- Present Jordyn's work in a gallery that feels as polished as the cakes themselves — cute, clean, minimalist, beautiful.
- Give Jordyn one place to see all incoming requests instead of digging through Instagram DMs.
- Let Jordyn open/close ordering (she currently has "not accepting orders" in her IG bio) without touching code.

### Success metrics
- % of orders that arrive with all info needed to quote (no follow-up questions required).
- Time from request submission to Jordyn's first response.
- Reduction in "is she taking orders?" DMs (visible open/closed status on site).

## 3. Target Users

| User | Needs |
|---|---|
| **Customer** (browsing IG/site, wants a custom cake) | See examples of relevant work, understand what info to provide, submit a request confidently, know when to expect a reply. |
| **Jordyn (owner/admin)** | Toggle order availability, see requests in one dashboard, track status (new → quoted → confirmed → completed), not have to write any code to update the gallery or bio-style info. |

## 4. Brand & Visual Design Direction

Pulled from the existing @jordynsbakes Instagram presence:

- **Palette:** soft blush pink, cream/off-white, warm neutral background — light and airy, not saturated.
- **Mood:** feminine, minimal, handmade — watercolor-soft accents rather than hard graphic shapes.
- **Typography:** a warm serif or script accent for headings/logo (matching the "Jordyn's Bakes" hand-lettered feel), paired with a clean simple sans-serif for body/form text so the ordering flow stays highly legible.
- **Layout principles:** generous white space, large uncropped photography of cakes as the hero content, minimal chrome (no heavy nav bars, no busy backgrounds), rounded soft edges on cards/buttons.
- **Occasion categories**, mirrored from her existing IG highlights, used consistently across gallery filters and the order form: **Weddings, Events, Birthdays, Holidays, Graduations**, plus **Other/Custom**.

Note: actual photos should be sourced directly from Jordyn (exported from her camera roll / IG) rather than scraped, both for image quality and because Instagram doesn't allow reliable public scraping.

## 5. Site Map

1. **Home** — hero image/rotating cake photos, short intro, "Currently accepting orders" status banner, CTA to gallery and order form.
2. **Gallery** — grid of cake/cupcake photos, filterable by occasion category.
3. **Order Form** — the core conversion flow (see §7).
4. **About** — short bio, story, how ordering works, lead-time expectations.
5. **FAQ** (optional MVP, easy to add) — pricing ranges, lead time, delivery vs. pickup, allergy/dietary handling.
6. **Admin (auth-gated)** — order dashboard for Jordyn only, not linked from public nav.

## 6. Core Features (MVP)

### 6.1 Cake Gallery
- Manually curated: Jordyn (or Claude, seeded from provided images) uploads photos directly into the site — no live Instagram API dependency.
- Filter/tag by occasion category.
- Lightbox/full-size view on click.
- Mobile-first grid (looks great on a phone, since that's how most visitors will arrive from an IG bio link).

### 6.2 Order Request Form
See detailed field list in §7. On submit:
- Row is written to the database.
- Confirmation email sent to the customer ("Thanks — Jordyn will follow up within X days").
- Notification email sent to Jordyn.

### 6.3 Availability Status
- A single admin-controlled toggle: **Accepting Orders / Not Accepting Orders**.
- When closed, the order form is replaced with a friendly "not currently accepting orders, check back soon" message (matches her current IG bio behavior), still allowing an optional "notify me" email capture.

### 6.4 Admin Dashboard (auth-gated)
- Login (Jordyn only — single admin user is fine for MVP).
- List of order requests, newest first, with status: **New → Reviewing → Quoted → Confirmed → Completed → Declined**.
- Click into a request to see full details and update status.
- Toggle the site-wide "Accepting Orders" flag from here.

## 7. Order Form — Field Detail

| Field | Type | Notes |
|---|---|---|
| Occasion | Select (Wedding / Event / Birthday / Holiday / Graduation / Other) | Drives any conditional fields later (e.g. tiered options for weddings) |
| Event date needed | Date picker | Should flag/warn if date is very soon (e.g. <2 weeks) since custom cakes need lead time |
| Cake or cupcakes | Select | |
| Servings / size | Number or select (e.g. "12–15", "20–25", "50+") | |
| Flavor(s) | Text or multi-select with common flavors + "other" | |
| Filling/frosting preference | Text (optional) | |
| Design description | Textarea | "Tell us your vision" |
| Reference images | File upload (multi) | Customers often have Pinterest/IG screenshots |
| Color palette | Text (optional) | |
| Dietary restrictions/allergies | Text (optional) | |
| Delivery or pickup | Select | |
| Delivery address | Text (conditional on delivery) | |
| Budget range | Select (optional, ranges not exact quote) | Helps Jordyn gauge scope quickly |
| Name | Text | required |
| Email | Email | required |
| Phone | Text | optional |
| How did you hear about us | Select (optional) | Lightweight marketing insight |

Validation: required fields enforced client- and server-side; image uploads size/type-limited.

## 8. User Flows

**Customer flow:** Land on home (likely from IG bio link) → browse gallery for inspiration → click "Request an Order" → fill form → submit → see confirmation screen + receive confirmation email → wait for Jordyn's follow-up (outside the app, via email/phone).

**Admin flow:** Jordyn logs into `/admin` → sees new requests badge → opens a request → reviews details/reference images → contacts customer externally to quote/confirm → updates status in dashboard → (optionally) toggles "Accepting Orders" off if booked up.

## 9. Technical Recommendations

No stack preference was specified, so recommending a simple, low-maintenance setup appropriate for a small single-admin business site:

- **Framework:** Next.js (React) — single codebase for public site + admin, easy image handling, deploys cleanly.
- **Styling:** Tailwind CSS — fast to hit a clean/minimalist look with consistent spacing and a small custom color palette (blush/cream tokens).
- **Database + Auth:** Supabase (Postgres + built-in auth) — handles order storage and a single admin login without standing up separate infrastructure.
- **Email:** Resend (or similar transactional email API) for confirmation + notification emails.
- **Image storage:** Supabase Storage or Cloudinary for gallery photos and uploaded reference images.
- **Hosting:** Vercel — pairs naturally with Next.js, free tier is sufficient at this scale.

This stack keeps ongoing cost near-zero at low order volume and requires no server maintenance.

### Suggested data model (sketch)
- `orders`: id, created_at, occasion, event_date, cake_type, servings, flavors, filling, design_description, reference_image_urls[], color_palette, dietary_notes, delivery_type, delivery_address, budget_range, customer_name, email, phone, referral_source, status, admin_notes
- `settings`: accepting_orders (boolean), updated_at
- `admin_users`: managed via Supabase Auth (single user for MVP)

## 10. Non-Functional Requirements

- **Mobile-first:** most traffic will arrive from an Instagram bio link on a phone.
- **Performance:** optimized/responsive images (no multi-MB photos slowing the gallery).
- **Accessibility:** sufficient color contrast despite the soft blush palette, proper form labels, keyboard-navigable.
- **Privacy:** customer contact info and reference images are only visible to admin; no public exposure of submitted order data.

## 11. Phase 2 / Future Considerations (out of MVP scope)

- Online deposit/payment collection (Stripe) once pricing is more standardized.
- Live Instagram feed sync instead of manual gallery uploads.
- Automated lead-time logic (e.g., block dates too close to today, or a calendar of already-booked dates).
- Customer-facing order status tracking (vs. Jordyn following up manually).
- Reviews/testimonials section.
- SMS notifications in addition to email.

## 12. Out of Scope (MVP)

- Payment processing.
- Multi-admin accounts / staff roles.
- Real-time inventory or scheduling/calendar blocking.
- Live Instagram API integration.

## 13. Content & Assets Needed From Jordyn

- Logo/wordmark (or confirm using styled text of "Jordyn's Bakes").
- 15–30 high-quality cake/cupcake photos, tagged by occasion.
- Short bio/about text.
- Lead-time policy and any standard pricing ranges to display (even approximate) to set expectations before a quote.

## 14. Open Questions

- What's the typical minimum lead time Jordyn needs, so the form/UI can set expectations (e.g. "orders need at least X weeks notice")?
- Should there be any pricing guidance shown up front, or fully quote-on-request?
- Confirm single-admin (just Jordyn) is correct for the MVP, or if a second person ever needs dashboard access.
