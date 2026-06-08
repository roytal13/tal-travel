import type { LucideIcon } from "lucide-react";

/** Placeholder for tabs whose module is not built yet (Phase 1). */
export function ComingSoon({
  icon: Icon,
  title,
  note,
}: {
  icon: LucideIcon;
  title: string;
  note: string;
}) {
  return (
    <div className="page-enter mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-8">
      <h1 className="mb-8 text-3xl font-bold">{title}</h1>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
        <Icon className="mb-4 size-12 text-lavender-300" />
        <p className="text-muted-foreground">{note}</p>
        <p className="mt-1 text-sm text-muted-foreground">בקרוב</p>
      </div>
    </div>
  );
}
