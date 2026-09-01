// Mirrors Jordyn's existing Instagram highlight categories — keep these
// names in sync with the brand direction in PLANNING.md; don't rename
// without checking with her.
export const OCCASIONS = [
  "Weddings",
  "Events",
  "Birthdays",
  "Holidays",
  "Graduations",
] as const;

export type Occasion = (typeof OCCASIONS)[number];
