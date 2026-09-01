import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OrdersTable } from "./OrdersTable";

describe("OrdersTable", () => {
  it("shows an empty state with no orders", () => {
    render(<OrdersTable orders={[]} />);
    expect(screen.getByText(/no order requests yet/i)).toBeInTheDocument();
  });

  it("renders a row per order, linking to its detail page", () => {
    render(
      <OrdersTable
        orders={[
          {
            id: "order-1",
            created_at: "2026-09-01T00:00:00Z",
            occasion: "Wedding",
            event_date: "2027-01-15",
            customer_name: "Alex Smith",
            status: "New",
          },
        ]}
      />,
    );

    const link = screen.getByRole("link", { name: /alex smith/i });
    expect(link).toHaveAttribute("href", "/admin/orders/order-1");
    expect(screen.getByText("Wedding")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
  });
});
