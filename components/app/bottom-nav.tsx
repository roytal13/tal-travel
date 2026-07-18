"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Coins, CreditCard, CalendarDays, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";

const TRIP_NAV = (tripId: string) => [
  { key: "today",    label: "היום",    href: `/trips/${tripId}/today`,    icon: Sun },
  { key: "currency", label: "מטבע",    href: `/trips/${tripId}/currency`,  icon: Coins },
  { key: "expenses", label: "הוצאות",  href: `/trips/${tripId}/expenses`,  icon: CreditCard },
  { key: "plan",     label: 'לו"ז',    href: `/trips/${tripId}/plan`,      icon: CalendarDays },
];

/** Mobile bottom tab bar. Hidden on desktop (md+), where the sidebar takes over. */
export function BottomNav() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  const tripMatch = pathname.match(/^\/trips\/([^/]+)/);
  const tripId = tripMatch?.[1];
  const items = tripId ? TRIP_NAV(tripId) : [];

  if (!items.length) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <li key={item.key} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-xs transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("size-6", active && "fill-lavender-100")} />
                <span className={cn(active && "font-medium")}>{item.label}</span>
              </Link>
            </li>
          );
        })}

        {/* Dark mode toggle */}
        <li className="flex w-12 shrink-0 items-center justify-center border-s border-border">
          <button
            onClick={toggle}
            aria-label="החלף מצב תאורה"
            className="flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            {theme === "dark"
              ? <Sun className="size-5" />
              : <Moon className="size-5" />}
          </button>
        </li>
      </ul>
    </nav>
  );
}
