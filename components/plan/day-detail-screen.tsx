"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Hotel as HotelIcon,
  Navigation,
  Plane,
  Car,
  Camera,
  Utensils,
  FileText,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeatherInline } from "@/components/weather/weather-inline";
import { DayEditor } from "@/components/plan/day-editor";
import { formatHebrewDate } from "@/lib/format";
import { dayTagLabel, dayTagVariant } from "@/lib/labels";
import { mapsDirectionsUrl } from "@/lib/maps";
import type { Base, DailyPlanEntry, Hotel, TimelineItem } from "@/lib/types";

const KIND_ICON: Record<TimelineItem["kind"], LucideIcon> = {
  flight: Plane,
  hotel: HotelIcon,
  transport: Car,
  activity: Camera,
  food: Utensils,
  document: FileText,
};

export function DayDetailScreen({
  tripId,
  day,
  base,
  hotel,
  totalDays,
  prevDate,
  nextDate,
}: {
  tripId: string;
  day: DailyPlanEntry;
  base?: Base;
  hotel?: Hotel;
  totalDays: number;
  prevDate?: string;
  nextDate?: string;
}) {
  const timeline = day.timeline ?? [];
  const coverImage = hotel?.coverImageUrl;
  const mapsUrl = hotel
    ? mapsDirectionsUrl([hotel.name, hotel.location])
    : base?.latitude && base?.longitude
      ? mapsDirectionsUrl([base.name])
      : null;

  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-lavender-700 via-lavender-500 to-lavender-300 md:h-72">
        {coverImage && (
          <Image
            src={coverImage}
            alt={base?.name ?? ""}
            fill
            className="object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-4">
          <Link
            href={`/trips/${tripId}/plan`}
            className="flex items-center gap-1 rounded-full bg-black/30 px-3 py-1.5 text-sm text-white backdrop-blur-sm"
          >
            <ArrowRight className="size-4" />
            לוח זמנים
          </Link>
          <DayEditor day={day} />
        </div>

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-5xl font-bold text-white leading-none">
                  {day.dayNumber}
                </span>
                <div className="text-white/80 text-sm leading-tight">
                  <div>יום</div>
                  <div>מתוך {totalDays}</div>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-white font-semibold text-lg">{formatHebrewDate(day.date)}</span>
                {base && (
                  <span className="text-white/80 text-sm">
                    · {base.name}
                    {base.nameLocal && <span className="ms-1 opacity-70">{base.nameLocal}</span>}
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                {day.tag && (
                  <Badge variant={dayTagVariant[day.tag]}>{dayTagLabel[day.tag]}</Badge>
                )}
                {day.weather && (
                  <span className="text-white/90">
                    <WeatherInline weather={day.weather} />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2 text-sm">
        {prevDate ? (
          <Link
            href={`/trips/${tripId}/plan/${prevDate}`}
            className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronRight className="size-4" />
            יום קודם
          </Link>
        ) : (
          <span />
        )}
        {nextDate ? (
          <Link
            href={`/trips/${tripId}/plan/${nextDate}`}
            className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            יום הבא
            <ChevronLeft className="size-4" />
          </Link>
        ) : (
          <span />
        )}
      </div>

      {/* Body */}
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-5 md:px-8">
        {/* Title */}
        {day.title && (
          <h2 className="text-2xl font-bold">{day.title}</h2>
        )}

        {/* Hotel card */}
        {hotel && (
          <Card className="flex items-center gap-3 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lavender-100 text-lavender-700">
              <HotelIcon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">לינה</p>
              <p className="truncate font-semibold">{hotel.name}</p>
              {hotel.location && (
                <p className="truncate text-xs text-muted-foreground">{hotel.location}</p>
              )}
            </div>
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Navigation className="size-3.5" />
                נווט
              </a>
            )}
          </Card>
        )}

        {/* Timeline or activities */}
        {timeline.length > 0 ? (
          <section>
            <h3 className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
              תוכנית היום
            </h3>
            <ol className="relative space-y-1">
              {timeline.map((item, i) => {
                const Icon = KIND_ICON[item.kind];
                return (
                  <li key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="w-14 pt-1.5 text-end font-mono text-xs text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                    <div className="relative flex flex-col items-center">
                      <span className="mt-1 flex size-8 items-center justify-center rounded-full bg-lavender-100 text-lavender-700">
                        <Icon className="size-4" />
                      </span>
                      {i < timeline.length - 1 && (
                        <span className="my-1 w-px flex-1 bg-border" />
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
        ) : day.activities ? (
          <Card className="p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              פעילויות
            </h3>
            <p className="whitespace-pre-line text-sm leading-relaxed">{day.activities}</p>
          </Card>
        ) : (
          <Card className="py-10 text-center text-muted-foreground">
            <p className="text-sm">אין תוכן ליום הזה עדיין</p>
            <p className="mt-1 text-xs">לחץ על "עריכה" בראש הדף</p>
          </Card>
        )}

        {/* Notes */}
        {day.notes && (
          <Card className="border-dashed p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              הערות
            </h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {day.notes}
            </p>
          </Card>
        )}

        {/* Location nav (when no hotel) */}
        {!hotel && mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-border p-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
          >
            <MapPin className="size-4" />
            פתח ב-Google Maps
          </a>
        )}
      </div>
    </div>
  );
}
