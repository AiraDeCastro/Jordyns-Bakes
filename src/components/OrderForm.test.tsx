import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OrderForm } from "./OrderForm";
import { MAX_IMAGE_COUNT } from "@/lib/validation/order";

vi.mock("@/app/order/actions", () => ({
  submitOrder: vi.fn(async () => ({ status: "idle" })),
}));

describe("OrderForm", () => {
  beforeEach(() => {
    // jsdom doesn't implement object URLs.
    URL.createObjectURL = vi.fn(() => "blob:mock-url");
    URL.revokeObjectURL = vi.fn();
  });

  it("renders the core required fields", () => {
    render(<OrderForm />);

    expect(screen.getByLabelText(/occasion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cake or cupcakes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/servings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/flavor\(s\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tell us your vision/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /submit order request/i }),
    ).toBeInTheDocument();
  });

  it("shows the delivery address field only when delivery is selected", async () => {
    const user = userEvent.setup();
    render(<OrderForm />);

    expect(screen.getByLabelText(/delivery address/i)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/delivery or pickup/i), "Pickup");
    expect(screen.queryByLabelText(/delivery address/i)).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/delivery or pickup/i), "Delivery");
    expect(screen.getByLabelText(/delivery address/i)).toBeInTheDocument();
  });

  it("keeps previously entered values after a validation error comes back", async () => {
    const { submitOrder } = await import("@/app/order/actions");
    vi.mocked(submitOrder).mockResolvedValueOnce({
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: { budgetRange: "Invalid option" },
    });

    const user = userEvent.setup();
    render(<OrderForm />);

    // Fill in every required field so the browser's own HTML5 validation
    // lets the submit through to the (mocked) server action at all.
    await user.selectOptions(screen.getByLabelText(/occasion/i), "Wedding");
    fireEvent.change(screen.getByLabelText(/event date/i), {
      target: { value: "2027-06-01" },
    });
    await user.selectOptions(screen.getByLabelText(/cake or cupcakes/i), "Cake");
    await user.selectOptions(screen.getByLabelText(/servings/i), "21–35");
    await user.type(screen.getByLabelText(/flavor\(s\)/i), "Chocolate");
    await user.type(screen.getByLabelText(/tell us your vision/i), "Simple design");
    await user.type(screen.getByLabelText(/delivery address/i), "123 Main St");
    await user.type(screen.getByLabelText(/^name/i), "Alex Smith");
    await user.type(screen.getByLabelText(/^email/i), "alex@example.com");

    await user.click(screen.getByRole("button", { name: /submit order request/i }));

    expect(
      await screen.findByText(/please fix the highlighted fields/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/flavor\(s\)/i)).toHaveValue("Chocolate");
    expect(screen.getByLabelText(/^name/i)).toHaveValue("Alex Smith");
  });

  it("warns when the event date is within the minimum lead time", () => {
    render(<OrderForm />);
    const dateInput = screen.getByLabelText(/event date/i);

    const soon = new Date();
    soon.setDate(soon.getDate() + 2);
    fireEvent.change(dateInput, { target: { value: soon.toISOString().slice(0, 10) } });
    expect(screen.getByText(/less than 2 weeks away/i)).toBeInTheDocument();

    const later = new Date();
    later.setDate(later.getDate() + 30);
    fireEvent.change(dateInput, { target: { value: later.toISOString().slice(0, 10) } });
    expect(screen.queryByText(/less than 2 weeks away/i)).not.toBeInTheDocument();
  });

  it("shows a thumbnail preview after selecting reference images", async () => {
    const user = userEvent.setup();
    render(<OrderForm />);

    const file = new File(["fake-image-content"], "inspo.jpg", { type: "image/jpeg" });
    await user.upload(screen.getByLabelText(/reference images/i), file);

    expect(screen.getByAltText("inspo.jpg")).toBeInTheDocument();
    expect(screen.getByText("inspo.jpg")).toBeInTheDocument();
  });

  it("warns when more than the allowed number of images is selected", async () => {
    const user = userEvent.setup();
    render(<OrderForm />);

    const files = Array.from(
      { length: MAX_IMAGE_COUNT + 1 },
      (_, i) => new File(["x"], `photo-${i}.jpg`, { type: "image/jpeg" }),
    );
    await user.upload(screen.getByLabelText(/reference images/i), files);

    expect(screen.getByText(/please select at most/i)).toBeInTheDocument();
  });
});
