"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { tripModulesFor } from "@/lib/trip-modules";
import type { ModuleKey } from "@/lib/types";

/**
 * Desktop-only vertical module navigation, shown on the right (RTL start) of
 * the trip area. On mobile the horizontal tab strip + "more" sheet is used.
 */
export function TripModuleSidebar({
  tripId,
  tripName,
  enabledModules,
}: {
  tripId: string;
  tripName: string;
  enabledModules: ModuleKey[];
}) {
  const pathname = usePathname();
  const base = `/trips/${tripId}`;
  const modules = tripModulesFor(enabledModules);

  const hrefFor = (segment: string) => (segment ? `${base}/${segment}` : base);
  const isActive = (segment: string) =>
    segment === "" ? pathname === base : pathname.startsWith(`${base}/${segment}`);

  return (
    <aside className="sticky top-0 hidden h-dvh w-52 shrink-0 flex-col border-e border-border bg-card md:flex">
      <div className="border-b border-border px-4 py-4">
        <Link
          href="/trips"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRight className="size-3.5" />
          כל הטיולים
        </Link>
        <h2 className="mt-1 truncate font-bold">{tripName}</h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-0.5">
          {modules.map((m) => {
            const active = isActive(m.segment);
            const Icon = m.icon;
            return (
              <li key={m.key}>
                <Link
                  href={hrefFor(m.segment)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {m.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
