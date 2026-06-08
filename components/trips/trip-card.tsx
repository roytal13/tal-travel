import Link from "next/link";
import { MapPin, Users, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoverImage } from "./cover-image";
import { cn } from "@/lib/utils";
import { formatHebrewRange, formatNights, nightsBetween, formatCountdown } from "@/lib/format";
import { tripStatusLabel, tripStatusVariant } from "@/lib/labels";
import type { Base, Trip } from "@/lib/types";

interface TripCardProps {
  trip: Trip;
  bases: Base[];
  today: string;
}

export function TripCard({ trip, bases, today }: TripCardProps) {
  const nights = nightsBetween(trip.startDate, trip.endDate);
  const hasDates = Boolean(trip.startDate && trip.endDate);

  // Unique base names (Tokyo appears twice in Japan), preserving order.
  const destinations = Array.from(new Set(bases.map((b) => b.name)));
  const accent = trip.theme?.accent;

  return (
    <Link href={`/trips/${trip.id}`} className="group block">
      <Card className="overflow-hidden transition-all group-hover:-translate-y-0.5 group-hover:shadow-lg">
        {/* Cover: gradient placeholder until real images exist */}
        <div
          className="relative flex aspect-[2/1] items-end overflow-hidden p-5"
          style={{
            background: accent
              ? `linear-gradient(135deg, ${accent} 0%, var(--color-lavender-700) 100%)`
              : "linear-gradient(135deg, var(--color-lavender-500) 0%, var(--color-lavender-700) 100%)",
          }}
        >
          <CoverImage
            src={trip.coverImageUrl}
            alt={trip.name}
            className="absolute inset-0 size-full object-cover"
          />
          {/* Darken for legible white text over any photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/0" />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-6 start-2 select-none text-[7rem] font-bold leading-none text-white/10"
          >
            {trip.destinationCountryCode}
          </span>
          <Badge
            variant={tripStatusVariant[trip.status]}
            className="absolute end-4 top-4"
          >
            {tripStatusLabel[trip.status]}
          </Badge>
          <h3 className="relative text-2xl font-bold text-white drop-shadow-sm">
            {trip.name}
          </h3>
        </div>

        <div className="space-y-2 p-5">
          <p className="text-sm text-muted-foreground">
            {hasDates ? (
              <>
                {formatHebrewRange(trip.startDate, trip.endDate)} · {formatNights(nights)}
              </>
            ) : (
              "תאריכים: לא נקבעו"
            )}
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4" />
            {trip.members.length} משתתפים
          </div>

          {destinations.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              <span className="truncate">{destinations.join(" · ")}</span>
            </div>
          )}

          {trip.status === "upcoming" && hasDates && (
            <div
              className={cn(
                "flex items-center gap-2 pt-1 text-sm font-medium text-primary"
              )}
            >
              <Clock className="size-4" />
              {formatCountdown(trip.startDate, today)}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
