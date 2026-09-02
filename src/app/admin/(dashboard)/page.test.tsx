import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminDashboardPage from "./page";

const orders = [
  {
    id: "1",
    created_at: "2026-09-01T00:00:00Z",
    occasion: "Wedding",
    event_date: "2027-01-01",
    customer_name: "Active Customer",
    status: "New",
  },
  {
    id: "2",
    created_at: "2026-09-01T00:00:00Z",
    occasion: "Birthday",
    event_date: "2027-01-02",
    customer_name: "Completed Customer",
    status: "Completed",
  },
  {
    id: "3",
    created_at: "2026-09-01T00:00:00Z",
    occasion: "Holiday",
    event_date: "2027-01-03",
    customer_name: "Declined Customer",
    status: "Declined",
  },
];

vi.mock("@/lib/supabase/server-session", () => ({
  createSessionSupabaseClient: async () => ({
    from: (table: string) => {
      if (table === "settings") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({ data: { accepting_orders: true } }),
            }),
          }),
        };
      }
      if (table === "orders") {
        return {
          select: () => ({
            order: async () => ({ data: orders }),
          }),
        };
      }
      return {
        select: () => ({
          order: async () => ({ data: [] }),
        }),
      };
    },
  }),
}));

describe("AdminDashboardPage", () => {
  it("splits orders into active and previous sections by status", async () => {
    render(await AdminDashboardPage());

    const activeHeading = screen.getByRole("heading", { name: "Order requests" });
    const previousHeading = screen.getByRole("heading", { name: "Previous order requests" });

    expect(activeHeading).toBeInTheDocument();
    expect(previousHeading).toBeInTheDocument();

    // Active Customer (status New) belongs above the "Previous" heading.
    expect(
      activeHeading.compareDocumentPosition(screen.getByText("Active Customer")) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      previousHeading.compareDocumentPosition(screen.getByText("Active Customer")) &
        Node.DOCUMENT_POSITION_PRECEDING,
    ).toBeTruthy();

    // Completed/Declined customers belong after the "Previous" heading.
    expect(
      previousHeading.compareDocumentPosition(screen.getByText("Completed Customer")) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      previousHeading.compareDocumentPosition(screen.getByText("Declined Customer")) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
