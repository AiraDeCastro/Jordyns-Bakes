import type { Occasion } from "./occasions";

export type GalleryItem = {
  id: string;
  occasion: Occasion;
  title: string;
};

// Placeholder work samples — swap for Jordyn's real curated photos in
// Milestone 7 (Content & assets). Each item renders as an illustrated
// card rather than a fake photo until then.
export const GALLERY_ITEMS: GalleryItem[] = [
  { id: "1", occasion: "Weddings", title: "Three-tier wedding cake, blush florals" },
  { id: "2", occasion: "Weddings", title: "Naked wedding cake with fresh berries" },
  { id: "3", occasion: "Events", title: "Cupcake tower for a bridal shower" },
  { id: "4", occasion: "Events", title: "Custom cake for a corporate celebration" },
  { id: "5", occasion: "Birthdays", title: "Watercolor birthday cake" },
  { id: "6", occasion: "Birthdays", title: "Number-shaped birthday cupcakes" },
  { id: "7", occasion: "Holidays", title: "Holiday spice cake with sugared cranberries" },
  { id: "8", occasion: "Holidays", title: "Winter-themed cupcake set" },
  { id: "9", occasion: "Graduations", title: "Graduation cap cake topper design" },
  { id: "10", occasion: "Graduations", title: "Grad party cupcakes in school colors" },
];
