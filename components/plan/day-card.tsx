import Link from "next/link";
import { Hotel as HotelIcon, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { WeatherInline } from "@/components/weather/weather-inline";
import { formatHebrewDate, formatShortDate } from "@/lib/format";
import type { Base, DailyPlanEntry, Hotel } from "@/lib/types";

export function DayCard({
  day,
  base,
  hotel,
  href,
}: {
  day: DailyPlanEntry;
  base?: Base;
  hotel?: Hotel;
  href?: string;
}) {
  const body = (
    <Card className="p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        {/* Day number marker */}
        <div className="flex shrink-0 flex-col items-center">
          <span className="text-xs text-muted-foreground">יום</span>
          <span className="font-mono text-2xl font-bold leading-none text-primary">
            {day.dayNumber}
          </span>
          <span className="font-mono text-sm font-bold leading-none text-primary">
            {formatShortDate(day.date)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {formatHebrewDate(day.date).split(" ")[0]}
            </span>
            {base && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <MapPin className="size-3" />
                {base.name}
              </span>
            )}
          </div>

          {day.title && <h3 className="mt-1 font-semibold">{day.title}</h3>}
          {day.activities && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{day.activities}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            {day.weather && <WeatherInline weather={day.weather} />}
            {hotel && (
              <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                <HotelIcon className="size-3.5 text-primary" />
                {hotel.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  return href ? (
    <Link href={href} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}
