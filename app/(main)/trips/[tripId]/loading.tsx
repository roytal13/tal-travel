/** Instant skeleton shown while a trip module page loads (nav stays via layout). */
export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse px-4 py-6 md:px-8">
      <div className="mb-6 h-7 w-40 rounded bg-secondary" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-secondary" />
        ))}
      </div>
    </div>
  );
}
