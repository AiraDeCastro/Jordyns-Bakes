import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotifySignupsList } from "./NotifySignupsList";

describe("NotifySignupsList", () => {
  it("shows an empty state with no signups", () => {
    render(<NotifySignupsList signups={[]} />);
    expect(screen.getByText(/no one has signed up/i)).toBeInTheDocument();
  });

  it("renders a row per signup", () => {
    render(
      <NotifySignupsList
        signups={[{ email: "alex@example.com", created_at: "2026-09-01T00:00:00Z" }]}
      />,
    );

    expect(screen.getByText("alex@example.com")).toBeInTheDocument();
  });
});
