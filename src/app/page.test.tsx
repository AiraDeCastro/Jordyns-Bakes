import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

vi.mock("@/lib/settings", () => ({
  getAcceptingOrders: vi.fn(),
}));

describe("Home page", () => {
  it("shows the accepting-orders banner and hero content when open for orders", async () => {
    const { getAcceptingOrders } = await import("@/lib/settings");
    vi.mocked(getAcceptingOrders).mockResolvedValueOnce(true);

    render(await Home());

    expect(screen.getByText(/currently accepting new orders/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /life's sweetest moments/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /request an order/i })).toHaveAttribute(
      "href",
      "/order",
    );
  });

  it("shows the not-accepting message when orders are closed", async () => {
    const { getAcceptingOrders } = await import("@/lib/settings");
    vi.mocked(getAcceptingOrders).mockResolvedValueOnce(false);

    render(await Home());

    expect(screen.getByText(/not currently accepting new orders/i)).toBeInTheDocument();
  });

  it("renders the hero video muted/looping with a reduced-motion fallback", async () => {
    const { getAcceptingOrders } = await import("@/lib/settings");
    vi.mocked(getAcceptingOrders).mockResolvedValueOnce(true);

    const { container } = render(await Home());

    const video = container.querySelector("video");
    expect(video).toBeTruthy();
    // React sets `muted` as a DOM property rather than reflecting it as an
    // HTML attribute, so check the property directly.
    expect((video as HTMLVideoElement).muted).toBe(true);
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
    // Hidden under prefers-reduced-motion — the section's own poster
    // background is the fallback in that case.
    expect(video?.className).toContain("motion-reduce:hidden");

    const sources = container.querySelectorAll("source");
    expect(Array.from(sources).map((s) => s.getAttribute("src"))).toEqual([
      "/video/hero-mobile.mp4",
      "/video/hero-desktop.mp4",
    ]);
  });
});
