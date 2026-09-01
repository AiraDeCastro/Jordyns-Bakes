export function StatusBanner({ acceptingOrders }: { acceptingOrders: boolean }) {
  return (
    <div
      className={
        acceptingOrders
          ? "bg-accent-tint text-accent-deep"
          : "bg-surface text-muted border-b border-border"
      }
    >
      <p className="mx-auto max-w-5xl px-4 py-2 text-center text-sm font-medium sm:px-6 lg:px-8">
        {acceptingOrders
          ? "Currently accepting new orders — reach out at least 2 weeks before your event."
          : "Not currently accepting new orders — check back soon."}
      </p>
    </div>
  );
}
