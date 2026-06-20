import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WeatherInline } from "@/components/weather/weather-inline";
import { DayEditor } from "@/components/plan/day-editor";
import { getTrip, getDay, getBases, getHotels } from "@/lib/db";
import { formatHebrewDate } from "@/lib/format";
import { dayTagLabel, dayTagVariant } from "@/lib/labels";

export default async function DayPage({
  params,
}: {
  params: Promise<{ tripId: string; date: string }>;
}) {
  const { tripId, date } = await params;
  const [trip, day] = await Promise.all([getTrip(tripId), getDay(tripId, date)]);
  if (!trip || !day) notFound();

  const [bases, hotels] = await Promise.all([getBases(tripId), getHotels(tripId)]);
  const base = bases.find((b) => b.id === day.baseId);
  const hotel = hotels.find((h) => h.id === day.hotelId);

  return (
    <div className="page-enter">
      <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
        {/* Back */}
        <Link
          href={`/trips/${tripId}/plan`}
          className="mb-5 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          חזרה ללוח הזמנים
        </Link>

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-4xl font-bold text-primary">{day.dayNumber}</span>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">{formatHebrewDate(day.date)}</span>
                {base && <span className="font-semibold">{base.name}</span>}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {day.tag && (
                <Badge variant={dayTagVariant[day.tag]}>{dayTagLabel[day.tag]}</Badge>
              )}
              {day.weather && <WeatherInline weather={day.weather} />}
            </div>
          </div>
          <DayEditor day={day} />
        </div>

        {/* Content */}
        <div className="space-y-5">
          {day.title && (
            <div>
              <h2 className="text-xl font-bold">{day.title}</h2>
            </div>
          )}

          {day.activities && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                פעילויות
              </h3>
              <p className="whitespace-pre-line text-sm leading-relaxed">{day.activities}</p>
            </div>
          )}

          {day.notes && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                הערות
              </h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {day.notes}
              </p>
            </div>
          )}

          {hotel && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                לינה
              </h3>
              <p className="font-medium">{hotel.name}</p>
              {hotel.location && (
                <p className="text-sm text-muted-foreground">{hotel.location}</p>
              )}
            </div>
          )}

          {!day.title && !day.activities && !day.notes && (
            <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
              <p className="text-sm">אין תוכן ליום הזה עדיין</p>
              <p className="mt-1 text-xs">לחץ על "עריכה" כדי להוסיף פרטים</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
