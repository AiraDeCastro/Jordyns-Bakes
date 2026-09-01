import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Header } from "./Header";

describe("Header", () => {
  it("renders the site name and primary navigation", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /jordyn's bakes/i })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /gallery/i })).toHaveAttribute("href", "/gallery");
  });
});
