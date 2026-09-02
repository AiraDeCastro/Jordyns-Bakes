"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CakeIllustration } from "./CakeIllustration";
import { OCCASIONS, type Occasion } from "@/lib/occasions";
import { GALLERY_ITEMS, type GalleryItem } from "@/lib/gallery-items";

const FILTERS = ["All", ...OCCASIONS] as const;
type Filter = (typeof FILTERS)[number];

function isOccasion(value: string | null): value is Occasion {
  return OCCASIONS.includes(value as Occasion);
}

// Renders the real photo (responsive + optimized via next/image) once an
// item has one, falling back to the illustrated placeholder — see the
// `imageSrc` comment in src/lib/gallery-items.ts.
export function GalleryMedia({
  item,
  sizes,
  illustrationClassName,
}: {
  item: GalleryItem;
  sizes: string;
  illustrationClassName: string;
}) {
  if (!item.imageSrc) {
    return <CakeIllustration className={illustrationClassName} />;
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl">
      <Image
        src={item.imageSrc}
        alt={item.title}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

export function GalleryGrid() {
  const searchParams = useSearchParams();
  const initialOccasion = searchParams.get("occasion");
  const [activeFilter, setActiveFilter] = useState<Filter>(
    isOccasion(initialOccasion) ? initialOccasion : "All",
  );
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const visibleItems = useMemo(
    () =>
      activeFilter === "All"
        ? GALLERY_ITEMS
        : GALLERY_ITEMS.filter((item) => item.occasion === activeFilter),
    [activeFilter],
  );

  function openItem(item: GalleryItem, event: React.MouseEvent<HTMLButtonElement>) {
    triggerRef.current = event.currentTarget;
    setSelected(item);
  }

  function closeDialog() {
    setSelected(null);
    // Return keyboard focus to whatever card opened the dialog, rather
    // than dropping it back to the top of the page.
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!selected) return;
    // Move focus into the dialog so keyboard/screen-reader users land
    // somewhere sensible instead of it opening silently around them.
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeDialog();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
            className={
              activeFilter === filter
                ? "rounded-full bg-accent-deep px-4 py-2 text-sm font-medium text-surface"
                : "rounded-full bg-accent-tint px-4 py-2 text-sm font-medium text-accent-deep transition-colors hover:bg-accent hover:text-surface"
            }
          >
            {filter}
          </button>
        ))}
      </div>

      {visibleItems.length === 0 ? (
        <p className="mt-12 text-center text-muted">No examples in this category yet.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-haspopup="dialog"
              onClick={(event) => openItem(item, event)}
              className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center transition-shadow hover:shadow-md"
            >
              <GalleryMedia
                item={item}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                illustrationClassName="h-16 w-16"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-deep">
                  {item.occasion}
                </p>
                <p className="mt-1 text-sm text-heading">{item.title}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-heading/60 p-4"
          onClick={closeDialog}
        >
          <div
            className="flex max-w-sm flex-col items-center gap-4 rounded-2xl bg-surface p-10 text-center"
            onClick={(event) => event.stopPropagation()}
          >
            <GalleryMedia item={selected} sizes="24rem" illustrationClassName="h-28 w-28" />
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-deep">
              {selected.occasion}
            </p>
            <p className="text-heading">{selected.title}</p>
            {!selected.imageSrc && (
              <p className="text-xs text-muted">Sample placeholder — real photos coming soon.</p>
            )}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeDialog}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-heading hover:border-accent-deep hover:text-accent-deep"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
