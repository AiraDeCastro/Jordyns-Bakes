import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DeleteOrderButton } from "./DeleteOrderButton";

const { deleteOrderMock } = vi.hoisted(() => ({
  deleteOrderMock: vi.fn(() => Promise.resolve()),
}));

vi.mock("@/app/admin/actions", () => ({
  deleteOrder: deleteOrderMock,
}));

describe("DeleteOrderButton", () => {
  afterEach(() => {
    deleteOrderMock.mockClear();
    vi.restoreAllMocks();
  });

  it("does not submit if the confirmation is cancelled", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const user = userEvent.setup();
    render(<DeleteOrderButton orderId="order-123" />);

    await user.click(screen.getByRole("button", { name: /delete order/i }));

    expect(window.confirm).toHaveBeenCalled();
    expect(deleteOrderMock).not.toHaveBeenCalled();
  });

  it("submits the delete action once confirmed", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const user = userEvent.setup();
    render(<DeleteOrderButton orderId="order-123" />);

    await user.click(screen.getByRole("button", { name: /delete order/i }));

    expect(deleteOrderMock).toHaveBeenCalledWith("order-123", expect.anything());
  });
});
