/** Skeleton for the trips list while it loads. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6 h-9 w-44 rounded bg-secondary" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border">
            <div className="aspect-[2/1] bg-secondary" />
            <div className="space-y-2 p-5">
              <div className="h-4 w-3/4 rounded bg-secondary" />
              <div className="h-3 w-1/2 rounded bg-secondary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
