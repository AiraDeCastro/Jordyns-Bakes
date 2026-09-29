import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the brand name and tagline", () => {
    render(<Footer />);
    expect(screen.getByText(/jordyn's bakes/i)).toBeInTheDocument();
    expect(screen.getByText(/weddings, events, birthdays/i)).toBeInTheDocument();
  });

  it("links to Jordyn's Bakes Instagram", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /jordyn's bakes on instagram/i });
    expect(link).toHaveAttribute("href", "https://www.instagram.com/jordynsbakes");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
