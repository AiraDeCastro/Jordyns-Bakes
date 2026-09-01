import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NotifyMeForm } from "./NotifyMeForm";

vi.mock("@/app/order/actions", () => ({
  subscribeToNotify: vi.fn(async () => ({ status: "success" })),
}));

describe("NotifyMeForm", () => {
  it("renders an email field and submit button", () => {
    render(<NotifyMeForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /notify me/i })).toBeInTheDocument();
  });

  it("shows a thank-you message after a successful signup", async () => {
    const user = userEvent.setup();
    render(<NotifyMeForm />);

    await user.type(screen.getByLabelText(/email/i), "alex@example.com");
    await user.click(screen.getByRole("button", { name: /notify me/i }));

    expect(await screen.findByText(/you're on the list/i)).toBeInTheDocument();
  });
});
