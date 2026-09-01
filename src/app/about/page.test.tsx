import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "./page";

describe("About page", () => {
  it("renders the bio and lead-time expectations", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { name: /about jordyn/i })).toBeInTheDocument();
    expect(screen.getByText(/2 weeks/i)).toBeInTheDocument();
  });
});
