import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the brand name and tagline", () => {
    render(<Footer />);
    expect(screen.getByText(/jordyn's bakes/i)).toBeInTheDocument();
    expect(screen.getByText(/weddings, events, birthdays/i)).toBeInTheDocument();
  });
});
