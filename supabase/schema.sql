-- Jordyn's Bakes — initial database schema (Milestone 2)
-- Run this once in the Supabase SQL Editor for this project.
-- Safe to re-run only after dropping the tables first — it does not use
-- "if not exists" guards, so re-running as-is on an already-set-up
-- database will error rather than silently skip.

-- ORDERS ---------------------------------------------------------------
-- One row per submitted order request.

create table orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  occasion text not null,
  event_date date not null,
  cake_type text not null,
  servings text not null,
  flavors text not null,
  filling text,
  design_description text not null,
  reference_image_urls text[],
  color_palette text,
  dietary_notes text,
  delivery_type text not null,
  delivery_address text,
  budget_range text,
  customer_name text not null,
  email text not null,
  phone text,
  referral_source text,
  status text not null default 'New'
    check (status in ('New', 'Reviewing', 'Quoted', 'Confirmed', 'Completed', 'Declined')),
  admin_notes text
);

alter table orders enable row level security;

-- Anyone (including customers who aren't logged in) can submit an order.
--
-- IMPORTANT for whoever writes the submit code (Milestone 4): do not
-- request the inserted row back on this insert (no supabase-js .select()
-- chained after .insert(), no "Prefer: return=representation"). Customers
-- have no SELECT policy on this table by design, and Postgres RLS checks
-- the SELECT policy for any RETURNING clause too — so asking for the row
-- back makes the whole insert fail, even though the write itself is
-- allowed. Use the default "return=minimal" behavior instead.
create policy "Anyone can submit an order"
  on orders for insert
  to anon, authenticated
  with check (true);

-- Only a logged-in admin (Jordyn) can view submitted orders — this is
-- what keeps customer names, emails, and reference images private.
create policy "Admin can view orders"
  on orders for select
  to authenticated
  using (true);

-- Only a logged-in admin can update order status/notes.
create policy "Admin can update orders"
  on orders for update
  to authenticated
  using (true)
  with check (true);

-- Only a logged-in admin can delete an order (e.g. clearing out test or
-- spam entries — Milestone 9 discovery).
create policy "Admin can delete orders"
  on orders for delete
  to authenticated
  using (true);

-- Explicit table-level grants, in addition to the RLS policies above.
-- RLS alone isn't enough — Postgres also checks the base grant.
grant insert on orders to anon, authenticated;
grant select, update, delete on orders to authenticated;

-- SETTINGS ---------------------------------------------------------------
-- Single-row table holding whether the site is accepting orders.

create table settings (
  id int primary key default 1,
  accepting_orders boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);

insert into settings (id, accepting_orders) values (1, true);

alter table settings enable row level security;

-- Everyone can read this — the public site needs it to decide whether
-- to show the order form or the "not accepting orders" message.
create policy "Anyone can read settings"
  on settings for select
  to anon, authenticated
  using (true);

-- Only a logged-in admin can flip the accepting_orders switch.
create policy "Admin can update settings"
  on settings for update
  to authenticated
  using (true)
  with check (true);

grant select on settings to anon, authenticated;
grant update on settings to authenticated;

-- NOTIFY SIGNUPS ---------------------------------------------------------
-- Emails collected from the "notify me" capture shown when the site
-- isn't accepting orders (Milestone 5).

create table notify_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table notify_signups enable row level security;

-- Anyone can sign up. No SELECT policy for anon/authenticated-as-customer
-- — same privacy pattern as orders, so an email list isn't publicly
-- readable back.
create policy "Anyone can sign up to be notified"
  on notify_signups for insert
  to anon, authenticated
  with check (true);

-- Only a logged-in admin can see who signed up.
create policy "Admin can view notify signups"
  on notify_signups for select
  to authenticated
  using (true);

grant insert on notify_signups to anon, authenticated;
grant select on notify_signups to authenticated;
