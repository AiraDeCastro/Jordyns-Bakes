// Select option lists for the order form (PRD §7). Singular occasion
// names here ("Wedding") describe what a single order is for, distinct
// from the plural category labels used in the Gallery filter.

export const ORDER_OCCASIONS = [
  "Wedding",
  "Event",
  "Birthday",
  "Holiday",
  "Graduation",
  "Other",
] as const;

export const CAKE_TYPES = ["Cake", "Cupcakes", "Both"] as const;

export const SERVINGS_RANGES = [
  "Under 12",
  "12–20",
  "21–35",
  "36–50",
  "51–75",
  "76–100",
  "100+",
] as const;

export const DELIVERY_TYPES = ["Delivery", "Pickup"] as const;

export const BUDGET_RANGES = [
  "Not sure yet",
  "Under $100",
  "$100–$250",
  "$250–$500",
  "$500–$1,000",
  "$1,000+",
] as const;

export const REFERRAL_SOURCES = [
  "Instagram",
  "Google search",
  "Friend or family referral",
  "Past customer",
  "Other",
] as const;

// Mirrors the `orders.status` check constraint in supabase/schema.sql.
export const ORDER_STATUSES = [
  "New",
  "Reviewing",
  "Quoted",
  "Confirmed",
  "Completed",
  "Declined",
] as const;
