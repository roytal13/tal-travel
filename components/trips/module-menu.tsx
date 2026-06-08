"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TripModuleDef } from "@/lib/trip-modules";

/**
 * "All modules" launcher. Opens a bottom sheet on mobile and a dropdown on
 * desktop with every enabled module as a labeled icon, so the trip never needs
 * a long scrolling tab strip to be fully navigable.
 */
export function ModuleMenu({
  tripId,
  modules,
}: {
  tripId: string;
  modules: TripModuleDef[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const base = `/trips/${tripId}`;

  const hrefFor = (segment: string) => (segment ? `${base}/${segment}` : base);
  const isActive = (segment: string) =>
    segment === "" ? pathname === base : pathname.startsWith(`${base}/${segment}`);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
          open
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground hover:text-foreground"
        )}
        aria-expanded={open}
        aria-label="כל המודולים"
      >
        <LayoutGrid className="size-4" />
        עוד
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          {/* Panel: bottom sheet on mobile, dropdown on desktop */}
          <div
            className={cn(
              "z-50 border border-border bg-card shadow-xl",
              "fixed inset-x-0 bottom-0 rounded-t-2xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]",
              "md:absolute md:inset-x-auto md:bottom-auto md:end-0 md:top-full md:mt-2 md:w-96 md:rounded-2xl md:pb-4"
            )}
          >
            <div className="mb-3 flex items-center justify-between md:hidden">
              <span className="font-semibold">כל המודולים</span>
              <button
                onClick={() => setOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
                aria-label="סגור"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
              {modules.map((m) => {
                const active = isActive(m.segment);
                const Icon = m.icon;
                return (
                  <Link
                    key={m.key}
                    href={hrefFor(m.segment)}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-colors",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-secondary"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-full",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-lavender-100 text-lavender-700"
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <span className="text-xs font-medium">{m.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
