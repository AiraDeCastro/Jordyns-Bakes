import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FaqPage from "./page";

describe("FAQ page", () => {
  it("renders every question", () => {
    render(<FaqPage />);
    expect(
      screen.getByText(/how far in advance do i need to order/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/how much will my cake cost/i)).toBeInTheDocument();
    expect(screen.getByText(/delivery, or is it pickup only/i)).toBeInTheDocument();
    expect(screen.getByText(/allergies or dietary restrictions/i)).toBeInTheDocument();
  });
});
