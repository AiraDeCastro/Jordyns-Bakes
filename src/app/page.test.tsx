import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

vi.mock("@/lib/settings", () => ({
  getAcceptingOrders: vi.fn(),
}));

describe("Home page", () => {
  it("shows the accepting-orders banner and hero content when open for orders", async () => {
    const { getAcceptingOrders } = await import("@/lib/settings");
    vi.mocked(getAcceptingOrders).mockResolvedValueOnce(true);

    render(await Home());

    expect(screen.getByText(/currently accepting new orders/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /life's sweetest moments/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /request an order/i })).toHaveAttribute(
      "href",
      "/order",
    );
  });

  it("shows the not-accepting message when orders are closed", async () => {
    const { getAcceptingOrders } = await import("@/lib/settings");
    vi.mocked(getAcceptingOrders).mockResolvedValueOnce(false);

    render(await Home());

    expect(screen.getByText(/not currently accepting new orders/i)).toBeInTheDocument();
  });
});
