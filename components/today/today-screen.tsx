import Link from "next/link";
import {
  Plane,
  Hotel as HotelIcon,
  Car,
  Camera,
  Utensils,
  FileText,
  MapPin,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeatherInline } from "@/components/weather/weather-inline";
import { formatHebrewDate } from "@/lib/format";
import type { Base, DailyPlanEntry, Hotel, TimelineItem, Trip } from "@/lib/types";

const KIND_ICON: Record<TimelineItem["kind"], LucideIcon> = {
  flight: Plane,
  hotel: HotelIcon,
  transport: Car,
  activity: Camera,
  food: Utensils,
  document: FileText,
};

export function TodayScreen({
  trip,
  day,
  base,
  hotel,
  totalDays,
  isPreview = false,
}: {
  trip: Trip;
  day: DailyPlanEntry;
  base?: Base;
  hotel?: Hotel;
  totalDays: number;
  isPreview?: boolean;
}) {
  const timeline = day.timeline ?? [];

  return (
    <div className="page-enter mx-auto max-w-2xl px-4 py-6 md:px-8 md:py-8">
      {/* Header */}
      <header className="mb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">היום</h1>
          <span className="font-mono text-lg text-muted-foreground">
            · {formatHebrewDate(day.date)}
          </span>
        </div>
        <p className="mt-1 text-muted-foreground">
          יום {day.dayNumber} מתוך {totalDays}
          {isPreview && (
            <Badge variant="secondary" className="ms-2">
              תצוגה מקדימה
            </Badge>
          )}
        </p>
      </header>

      {/* Weather + tonight */}
      <div className="mb-5 space-y-3">
        {(base || day.weather) && (
          <Card className="flex items-center justify-between gap-2 p-4">
            <span className="flex items-center gap-2 font-medium">
              <MapPin className="size-4 text-primary" />
              {base?.name ?? trip.name}
            </span>
            {day.weather && <WeatherInline weather={day.weather} />}
          </Card>
        )}

        {hotel && (
          <Card className="flex items-center gap-3 p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-lavender-100 text-lavender-700">
              <HotelIcon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">הלילה ב</p>
              <p className="truncate font-medium">{hotel.name}</p>
            </div>
          </Card>
        )}
      </div>

      {/* Timeline */}
      {timeline.length > 0 ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold">מה צפוי היום</h2>
          <ol className="relative space-y-1">
            {timeline.map((item, i) => {
              const Icon = KIND_ICON[item.kind];
              return (
                <li key={i} className="flex gap-3">
                  {/* time + rail */}
                  <div className="flex flex-col items-center">
                    <span className="w-12 pt-1 text-end font-mono text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                  <div className="relative flex flex-col items-center">
                    <span className="mt-1.5 flex size-7 items-center justify-center rounded-full bg-lavender-100 text-lavender-700">
                      <Icon className="size-4" />
                    </span>
                    {i < timeline.length - 1 && (
                      <span className="my-0.5 w-px flex-1 bg-border" />
                    )}
                  </div>
                  <Card className="mb-2 flex-1 p-3">
                    <p className="font-medium">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                    )}
                  </Card>
                </li>
              );
            })}
          </ol>
        </section>
      ) : (
        <Card className="p-4 text-sm text-muted-foreground">
          {day.activities ?? "אין פעילויות מתוכננות ליום זה"}
        </Card>
      )}

      <Link
        href={`/trips/${trip.id}/plan`}
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        ראה את כל לוח הזמנים
        <ArrowLeft className="size-4" />
      </Link>
    </div>
  );
}
