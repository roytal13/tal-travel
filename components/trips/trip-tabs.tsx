"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { tripModulesFor } from "@/lib/trip-modules";
import { ModuleMenu } from "./module-menu";
import type { ModuleKey } from "@/lib/types";

export function TripTabs({
  tripId,
  enabledModules,
}: {
  tripId: string;
  enabledModules: ModuleKey[];
}) {
  const pathname = usePathname();
  const base = `/trips/${tripId}`;

  const modules = tripModulesFor(enabledModules);
  // Primary modules sit in the always-visible strip; everything is in "more".
  const primary = modules.filter((m) => m.primary);
  const hasExtra = modules.some((m) => !m.primary);

  return (
    // The menu sits OUTSIDE the scroll container, otherwise overflow-x-auto
    // clips its dropdown/sheet.
    <nav className="flex items-center gap-1">
      <div className="flex min-w-0 gap-1 overflow-x-auto">
        {primary.map((tab) => {
          const href = tab.segment ? `${base}/${tab.segment}` : base;
          const active =
            tab.segment === ""
              ? pathname === base
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={tab.key}
              href={href}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {hasExtra && <ModuleMenu tripId={tripId} modules={modules} />}
    </nav>
  );
}
