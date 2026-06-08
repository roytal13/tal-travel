"use client";

import { useState } from "react";
import { AttractionCard } from "./attraction-card";
import { cn } from "@/lib/utils";
import type { Attraction, Base } from "@/lib/types";

export function AttractionsScreen({
  attractions,
  bases,
  countryName,
}: {
  attractions: Attraction[];
  bases: Base[];
  countryName?: string;
}) {
  const [baseFilter, setBaseFilter] = useState<string | "all">("all");

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

      <div className="grid gap-3 sm:grid-cols-2">
        {visible.map((a) => (
          <AttractionCard
            key={a.id}
            attraction={a}
            base={bases.find((b) => b.id === a.baseId)}
            countryName={countryName}
          />
        ))}
      </div>
    </div>
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
