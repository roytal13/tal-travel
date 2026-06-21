"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AttractionCard } from "./attraction-card";
import { AddAttractionSheet } from "./add-attraction-sheet";
import { cn } from "@/lib/utils";
import type { Attraction, Base } from "@/lib/types";

export function AttractionsScreen({
  tripId,
  attractions,
  bases,
  countryName,
}: {
  tripId: string;
  attractions: Attraction[];
  bases: Base[];
  countryName?: string;
}) {
  const [baseFilter, setBaseFilter] = useState<string | "all">("all");
  const [showAdd, setShowAdd] = useState(false);

  // Bases that actually have attractions, in trip order.
  const basesWithAttractions = bases.filter((b) =>
    attractions.some((a) => a.baseId === b.id)
  );

  const visible =
    baseFilter === "all"
      ? attractions
      : attractions.filter((a) => a.baseId === baseFilter);

  const mustCount = attractions.filter((a) => a.priority === "must").length;

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">אטרקציות</h2>
          <span className="text-sm text-muted-foreground">
            {attractions.length} אטרקציות · {mustCount} חובה
          </span>
        </div>

        {/* Filter by base */}
        <div className="mb-5 flex flex-wrap gap-2">
          <Pill active={baseFilter === "all"} onClick={() => setBaseFilter("all")}>
            הכל
          </Pill>
          {basesWithAttractions.map((b) => (
            <Pill key={b.id} active={baseFilter === b.id} onClick={() => setBaseFilter(b.id)}>
              {b.name}
            </Pill>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {visible.map((a) => (
            <AttractionCard
              key={a.id}
              attraction={a}
              base={bases.find((b) => b.id === a.baseId)}
              countryName={countryName}
            />
          ))}
        </div>

        {/* Bottom padding so FAB doesn't overlap last card */}
        <div className="h-20" />
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-6 end-6 z-30 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
      >
        <Plus className="size-5" />
        הוסף אטרקציה
      </button>

      {showAdd && (
        <AddAttractionSheet
          tripId={tripId}
          bases={bases}
          onClose={() => setShowAdd(false)}
          onAdded={() => setShowAdd(false)}
        />
      )}
    </>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
