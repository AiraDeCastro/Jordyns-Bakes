import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GalleryGrid, GalleryMedia } from "./GalleryGrid";
import { GALLERY_ITEMS } from "@/lib/gallery-items";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe("GalleryGrid", () => {
  it("shows every item under the 'All' filter", () => {
    render(<GalleryGrid />);
    const weddingCount = GALLERY_ITEMS.filter((item) => item.occasion === "Weddings").length;
    expect(screen.getAllByText("Weddings")).toHaveLength(weddingCount + 1); // +1 for the filter button itself
  });

  it("narrows to one occasion when its filter is clicked", async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);

    await user.click(screen.getByRole("button", { name: "Birthdays" }));

    const birthdayCount = GALLERY_ITEMS.filter((item) => item.occasion === "Birthdays").length;
    expect(screen.getAllByText("Birthdays")).toHaveLength(birthdayCount + 1); // +1 for the filter button itself
    expect(screen.getAllByText("Weddings")).toHaveLength(1); // only the filter button remains, no cards
  });

  it("opens and closes a lightbox for a selected item", async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);

    await user.click(screen.getByRole("button", { name: /three-tier wedding cake/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("moves focus into the dialog on open and back to the card on close", async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);

    const card = screen.getByRole("button", { name: /three-tier wedding cake/i });
    await user.click(card);

    expect(screen.getByRole("button", { name: /close/i })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(card).toHaveFocus();
  });
});

describe("GalleryMedia", () => {
  it("renders the illustrated placeholder when an item has no photo yet", () => {
    render(
      <GalleryMedia
        item={{ id: "x", occasion: "Weddings", title: "Test cake" }}
        sizes="100vw"
        illustrationClassName="h-16 w-16"
      />,
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders the real photo once an item has an imageSrc", () => {
    render(
      <GalleryMedia
        item={{
          id: "x",
          occasion: "Weddings",
          title: "Test cake",
          imageSrc: "/gallery/test-cake.jpg",
        }}
        sizes="100vw"
        illustrationClassName="h-16 w-16"
      />,
    );
    expect(screen.getByRole("img", { name: "Test cake" })).toBeInTheDocument();
  });
});
