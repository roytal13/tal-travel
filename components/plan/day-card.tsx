import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeatherInline } from "@/components/weather/weather-inline";
import { formatHebrewDate, formatShortDate } from "@/lib/format";
import { dayTagLabel, dayTagVariant } from "@/lib/labels";
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
          <span className="font-mono text-sm font-bold leading-none text-foreground">
            {formatShortDate(day.date)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {formatHebrewDate(day.date).split(" ")[0]}
            </span>
            {day.tag && (
              <Badge variant={dayTagVariant[day.tag]}>{dayTagLabel[day.tag]}</Badge>
            )}
            {base && <span className="text-sm font-medium">{base.name}</span>}
          </div>

          {day.title && <h3 className="mt-1 font-semibold">{day.title}</h3>}
          {day.activities && (
            <p className="mt-1 text-sm text-muted-foreground">{day.activities}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            {day.weather && <WeatherInline weather={day.weather} />}
            {hotel && (
              <span className="text-sm text-muted-foreground">לינה: {hotel.name}</span>
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
