import { describe, expect, it } from "vitest";
import { orderFormSchema, isShortNotice, MIN_LEAD_TIME_DAYS } from "./order";

const validOrder = {
  occasion: "Wedding",
  eventDate: "2027-01-01",
  cakeType: "Cake",
  servings: "21–35",
  flavors: "Vanilla, chocolate",
  designDescription: "Three-tier with blush florals",
  deliveryType: "Pickup",
  customerName: "Alex Smith",
  email: "alex@example.com",
};

describe("orderFormSchema", () => {
  it("accepts a complete, valid order", () => {
    const result = orderFormSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it("rejects a missing required field", () => {
    const withoutDesign: Partial<typeof validOrder> = { ...validOrder };
    delete withoutDesign.designDescription;
    const result = orderFormSchema.safeParse(withoutDesign);
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = orderFormSchema.safeParse({ ...validOrder, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("requires a delivery address when delivery type is Delivery", () => {
    const result = orderFormSchema.safeParse({ ...validOrder, deliveryType: "Delivery" });
    expect(result.success).toBe(false);
  });

  it("accepts a Delivery order once an address is provided", () => {
    const result = orderFormSchema.safeParse({
      ...validOrder,
      deliveryType: "Delivery",
      deliveryAddress: "123 Main St",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty string for optional dropdowns left unselected", () => {
    // A native <select> submits "" for its unselected placeholder option
    // rather than omitting the field entirely.
    const result = orderFormSchema.safeParse({
      ...validOrder,
      budgetRange: "",
      referralSource: "",
    });
    expect(result.success).toBe(true);
  });
});

describe("isShortNotice", () => {
  it("flags a date closer than the minimum lead time", () => {
    const soon = new Date();
    soon.setDate(soon.getDate() + 3);
    expect(isShortNotice(soon.toISOString().slice(0, 10))).toBe(true);
  });

  it("does not flag a date beyond the minimum lead time", () => {
    const later = new Date();
    later.setDate(later.getDate() + MIN_LEAD_TIME_DAYS + 5);
    expect(isShortNotice(later.toISOString().slice(0, 10))).toBe(false);
  });
});
