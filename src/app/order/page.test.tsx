import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import OrderPage from "./page";

vi.mock("@/lib/settings", () => ({
  getAcceptingOrders: vi.fn(),
}));

vi.mock("@/components/OrderForm", () => ({
  OrderForm: () => <div data-testid="order-form" />,
}));

vi.mock("@/components/NotifyMeForm", () => ({
  NotifyMeForm: () => <div data-testid="notify-form" />,
}));

describe("Order page", () => {
  it("shows the order form when accepting orders", async () => {
    const { getAcceptingOrders } = await import("@/lib/settings");
    vi.mocked(getAcceptingOrders).mockResolvedValueOnce(true);

    render(await OrderPage());

    expect(screen.getByTestId("order-form")).toBeInTheDocument();
    expect(screen.queryByTestId("notify-form")).not.toBeInTheDocument();
  });

  it("shows the notify-me form when not accepting orders", async () => {
    const { getAcceptingOrders } = await import("@/lib/settings");
    vi.mocked(getAcceptingOrders).mockResolvedValueOnce(false);

    render(await OrderPage());

    expect(screen.getByTestId("notify-form")).toBeInTheDocument();
    expect(screen.queryByTestId("order-form")).not.toBeInTheDocument();
    expect(screen.getByText(/not currently accepting new orders/i)).toBeInTheDocument();
  });
});
