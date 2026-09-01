import { z } from "zod";
import {
  ORDER_OCCASIONS,
  CAKE_TYPES,
  SERVINGS_RANGES,
  DELIVERY_TYPES,
  BUDGET_RANGES,
  REFERRAL_SOURCES,
} from "@/lib/order-options";

// A <select> always submits *something*, even for its unselected
// placeholder option (value=""). For an optional field that means the
// empty string, not a missing key — so treat "" as "not provided"
// before checking it against the allowed values.
function optionalEnum<T extends readonly [string, ...string[]]>(values: T) {
  return z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(values).optional(),
  );
}

export const orderFormSchema = z
  .object({
    occasion: z.enum(ORDER_OCCASIONS),
    eventDate: z
      .string()
      .min(1, "Event date is required")
      .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date"),
    cakeType: z.enum(CAKE_TYPES),
    servings: z.enum(SERVINGS_RANGES),
    flavors: z.string().trim().min(1, "Tell us your flavor preferences"),
    filling: z.string().trim().optional(),
    designDescription: z.string().trim().min(1, "Tell us about your design vision"),
    colorPalette: z.string().trim().optional(),
    dietaryNotes: z.string().trim().optional(),
    deliveryType: z.enum(DELIVERY_TYPES),
    deliveryAddress: z.string().trim().optional(),
    budgetRange: optionalEnum(BUDGET_RANGES),
    customerName: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Enter a valid email"),
    phone: z.string().trim().optional(),
    referralSource: optionalEnum(REFERRAL_SOURCES),
  })
  .refine((data) => data.deliveryType !== "Delivery" || !!data.deliveryAddress?.trim(), {
    message: "Delivery address is required for delivery orders",
    path: ["deliveryAddress"],
  });

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export const MIN_LEAD_TIME_DAYS = 14;

export function isShortNotice(eventDate: string): boolean {
  const parsed = new Date(eventDate);
  if (Number.isNaN(parsed.getTime())) return false;

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysUntil = (parsed.getTime() - Date.now()) / msPerDay;
  return daysUntil < MIN_LEAD_TIME_DAYS;
}

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
export const MAX_IMAGE_COUNT = 5;
