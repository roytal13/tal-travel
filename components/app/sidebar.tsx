"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

/** Desktop left sidebar (md+). Hidden on mobile, where the bottom nav takes over. */
export function Sidebar() {
  const pathname = usePathname();

  // Inside a trip the trip sidebar takes over, so this global one steps aside
  // (keeps a single side panel on desktop).
  if (/^\/trips\/[^/]+/.test(pathname)) return null;

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-e border-border bg-card md:flex">
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
          ט
        </div>
        <span className="font-display text-lg font-bold tracking-tight">
          Tal Travel
        </span>
      </div>

      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-6 py-4 text-xs text-muted-foreground">
        משפחת טל
      </div>
    </aside>
  );
}
