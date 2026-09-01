import { describe, expect, it, vi } from "vitest";
import { getAcceptingOrders } from "./settings";

const { mockSingle } = vi.hoisted(() => ({ mockSingle: vi.fn() }));

vi.mock("./supabase/server", () => ({
  createPublicSupabaseClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: mockSingle,
        }),
      }),
    }),
  }),
}));

describe("getAcceptingOrders", () => {
  it("returns true when the setting is true", async () => {
    mockSingle.mockResolvedValueOnce({ data: { accepting_orders: true }, error: null });
    expect(await getAcceptingOrders()).toBe(true);
  });

  it("returns false when the setting is false", async () => {
    mockSingle.mockResolvedValueOnce({ data: { accepting_orders: false }, error: null });
    expect(await getAcceptingOrders()).toBe(false);
  });

  it("fails closed (false) when the read errors", async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: new Error("network error") });
    expect(await getAcceptingOrders()).toBe(false);
  });
});
