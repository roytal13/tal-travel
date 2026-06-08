import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TripTabs } from "./trip-tabs";
import type { Trip } from "@/lib/types";

/** Compact sticky header for trip module pages: back link, name, module tabs. */
export function TripModuleHeader({ trip }: { trip: Trip }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur md:hidden">
      <div className="mx-auto max-w-3xl px-4 py-3 md:px-8">
        <div className="mb-3 flex items-center gap-3">
          <Link
            href="/trips"
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="חזרה לטיולים"
          >
            <ArrowRight className="size-5" />
          </Link>
          <h1 className="text-lg font-bold">{trip.name}</h1>
        </div>
        <TripTabs tripId={trip.id} enabledModules={trip.enabledModules} />
      </div>
    </header>
  );
}
