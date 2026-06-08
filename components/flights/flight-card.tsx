import { Plane } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  isoLocalTime,
  localDayOffset,
  formatFullDate,
  formatDuration,
} from "@/lib/format";
import { flightStatusLabel, flightStatusVariant } from "@/lib/labels";
import type { Flight } from "@/lib/types";

const flightTypeLabel: Record<Flight["flightType"], string> = {
  international: "בינלאומית",
  domestic: "פנים",
  connection: "חיבור",
};

export function FlightCard({ flight }: { flight: Flight }) {
  const dayOffset = localDayOffset(flight.departureTime, flight.arrivalTime);

  return (
    <Card className="overflow-hidden">
      {/* Airline + status */}
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-[#dbeafe] text-[#3b82f6]">
            <Plane className="size-5" />
          </span>
          <div>
            <h3 className="font-semibold">
              {flight.airline}
              {flight.flightNumber && (
                <span className="font-mono text-muted-foreground"> · {flight.flightNumber}</span>
              )}
            </h3>
            <span className="text-xs text-muted-foreground">
              {flightTypeLabel[flight.flightType]}
            </span>
          </div>
        </div>
        <Badge variant={flightStatusVariant[flight.status]} className="shrink-0">
          {flightStatusLabel[flight.status]}
        </Badge>
      </div>

      {/* Route - boarding pass style. dir=ltr so the plane points origin->dest. */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2" dir="ltr">
          <div className="text-center">
            <div className="font-mono text-2xl font-bold">{flight.departureAirport}</div>
            <div className="font-mono text-sm">{isoLocalTime(flight.departureTime)}</div>
            <div className="max-w-24 truncate text-xs text-muted-foreground">
              {flight.departureAirportName}
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center px-2">
            <Plane className="size-5 rotate-90 text-lavender-400" />
            <div className="my-1 h-px w-full bg-border" />
            {flight.durationMinutes && (
              <span className="font-mono text-xs text-muted-foreground">
                {formatDuration(flight.durationMinutes)}
              </span>
            )}
          </div>

          <div className="text-center">
            <div className="font-mono text-2xl font-bold">{flight.arrivalAirport}</div>
            <div className="font-mono text-sm">
              {isoLocalTime(flight.arrivalTime)}
              {dayOffset > 0 && (
                <span className="align-super text-[10px] text-muted-foreground"> +{dayOffset}</span>
              )}
            </div>
            <div className="max-w-24 truncate text-xs text-muted-foreground">
              {flight.arrivalAirportName}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-3 text-sm text-muted-foreground">
          <span className="font-mono">{formatFullDate(flight.departureTime)}</span>
          {flight.seatClass && <span>· {flight.seatClass}</span>}
          {flight.bookingReference && (
            <span>
              · אישור <span className="font-mono">{flight.bookingReference}</span>
            </span>
          )}
        </div>

        {flight.notes && (
          <p className="mt-2 text-xs text-muted-foreground">{flight.notes}</p>
        )}
      </div>
    </Card>
  );
}
