import { Suspense } from "react";
import { Container } from "@/components/Container";
import { GalleryGrid } from "@/components/GalleryGrid";

export default function GalleryPage() {
  return (
    <div
      className="flex flex-1 flex-col bg-repeat py-16"
      style={{ backgroundImage: "url(/images/gallery-pattern.jpg)", backgroundSize: "320px" }}
    >
      <Container className="flex flex-col items-center">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface/90 px-10 py-5 text-center backdrop-blur-sm">
          <h1 className="font-display text-3xl font-semibold text-heading">Gallery</h1>
          <p className="max-w-md text-muted">
            A look at past cakes and cupcakes, filterable by occasion.
          </p>
        </div>
      </Container>
      <Container className="mt-10 flex flex-col items-center">
        <Suspense>
          <GalleryGrid />
        </Suspense>
      </Container>
    </div>
  );
}
