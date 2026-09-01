import { Suspense } from "react";
import { Container } from "@/components/Container";
import { GalleryGrid } from "@/components/GalleryGrid";

export default function GalleryPage() {
  return (
    <div className="flex flex-1 flex-col py-16">
      <Container className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-display text-3xl font-semibold text-heading">Gallery</h1>
        <p className="max-w-md text-muted">
          A look at past cakes and cupcakes, filterable by occasion.
        </p>
      </Container>
      <Container className="mt-10 flex flex-col items-center">
        <Suspense>
          <GalleryGrid />
        </Suspense>
      </Container>
    </div>
  );
}
