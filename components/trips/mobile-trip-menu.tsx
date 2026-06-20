"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { tripModulesFor } from "@/lib/trip-modules";
import { NAV_ITEMS } from "@/components/app/nav-items";
import type { ModuleKey } from "@/lib/types";

/**
 * Mobile in-trip navigation: a hamburger button that opens a drawer listing
 * all the trip's modules (plus a global nav footer). Replaces the old
 * horizontal tab strip + "more" sheet.
 */
export function MobileTripMenu({
  tripId,
  tripName,
  enabledModules,
}: {
  tripId: string;
  tripName: string;
  enabledModules: ModuleKey[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const base = `/trips/${tripId}`;
  const modules = tripModulesFor(enabledModules);

  const hrefFor = (segment: string) => (segment ? `${base}/${segment}` : base);
  const isActive = (segment: string) =>
    segment === "" ? pathname === base : pathname.startsWith(`${base}/${segment}`);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="תפריט הטיול"
        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary"
      >
        <Menu className="size-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 start-0 flex w-72 max-w-[85%] flex-col bg-card shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="truncate font-bold">{tripName}</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="סגור"
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
              >
                <X className="size-5" />
              </button>
            </div>

            <Link
              href="/trips"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1 border-b border-border px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowRight className="size-3.5" />
              כל הטיולים
            </Link>

            {/* Modules */}
            <nav className="flex-1 overflow-y-auto p-2">
              <ul className="space-y-0.5">
                {modules.map((m) => {
                  const active = isActive(m.segment);
                  const Icon = m.icon;
                  return (
                    <li key={m.key}>
                      <Link
                        href={hrefFor(m.segment)}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                          active
                            ? "bg-accent font-medium text-accent-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <Icon className="size-5" />
                        {m.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Global nav footer */}
            <div className="flex items-center justify-around border-t border-border px-2 py-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-label={item.label}
                    className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Icon className="size-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
