"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { tripModulesFor } from "@/lib/trip-modules";
import type { ModuleKey } from "@/lib/types";

export function TripHamburgerNav({
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

  const activeModule = modules.find((m) => isActive(m.segment));

  return (
    <>
      {/* Header bar */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:hidden">
        <Link
          href="/trips"
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="חזרה לטיולים"
        >
          <ArrowRight className="size-5" />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-xs text-muted-foreground">{tripName}</span>
          {activeModule && (
            <span className="truncate text-sm font-semibold leading-tight">
              {activeModule.label}
            </span>
          )}
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="תפריט"
          aria-expanded={open}
        >
          <Menu className="size-5" />
        </button>
      </header>

      {/* Drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Drawer panel — slides in from the right (RTL start) */}
      <div
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-72 flex-col bg-card shadow-2xl transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
        style={{ willChange: "transform" }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground">
              ט
            </div>
            <span className="font-bold">{tripName}</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
            aria-label="סגור תפריט"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Module list */}
        <nav className="flex-1 overflow-y-auto py-2">
          <ul>
            {modules.map((m) => {
              const active = isActive(m.segment);
              const Icon = m.icon;
              return (
                <li key={m.key}>
                  <Link
                    href={hrefFor(m.segment)}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3 text-sm transition-colors",
                      active
                        ? "bg-accent font-semibold text-accent-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-lavender-100 text-lavender-700"
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    {m.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Back to trips */}
        <div className="border-t border-border p-4">
          <Link
            href="/trips"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowRight className="size-4" />
            כל הטיולים
          </Link>
        </div>
      </div>
    </>
  );
}
