"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { tripModulesFor } from "@/lib/trip-modules";
import { NAV_ITEMS } from "@/components/app/nav-items";
import type { ModuleKey } from "@/lib/types";

/**
 * The single desktop sidebar while inside a trip. Combines the brand, the
 * trip's module nav, and a compact global nav footer, so there is only one
 * side panel (the global Sidebar hides itself on trip routes).
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
    <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-e border-border bg-card md:flex">
      {/* Brand */}
      <Link
        href="/trips"
        className="flex items-center gap-3 border-b border-border px-5 py-4"
      >
        <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground">
          ט
        </div>
        <span className="font-display font-bold tracking-tight">Tal Travel</span>
      </Link>

      {/* Trip header */}
      <div className="border-b border-border px-4 py-3">
        <Link
          href="/trips"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRight className="size-3.5" />
          כל הטיולים
        </Link>
        <h2 className="mt-1 truncate font-bold">{tripName}</h2>
      </div>

      {/* Trip modules */}
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

      {/* Compact global nav footer */}
      <div className="flex items-center justify-around border-t border-border px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Icon className="size-5" />
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
