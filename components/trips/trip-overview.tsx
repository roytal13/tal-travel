import Link from "next/link";
import {
  ArrowRight,
  Users,
  Clock,
  FileText,
  Hotel as HotelIcon,
  Plane,
  CheckCircle,
  Camera,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { TripTabs } from "./trip-tabs";
import { CoverImage } from "./cover-image";
import {
  formatHebrewRange,
  formatNights,
  nightsBetween,
  formatCountdown,
  formatNightsRange,
} from "@/lib/format";
import type {
  Base,
  Hotel,
  Flight,
  Task,
  TripDocument,
  Attraction,
  Trip,
} from "@/lib/types";

interface TripOverviewProps {
  trip: Trip;
  bases: Base[];
  hotels: Hotel[];
  flights: Flight[];
  tasks: Task[];
  documents: TripDocument[];
  attractions: Attraction[];
  today: string;
}

export function TripOverview({
  trip,
  bases,
  hotels,
  flights,
  tasks,
  documents,
  attractions,
  today,
}: TripOverviewProps) {
  const nights = nightsBetween(trip.startDate, trip.endDate);
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const urgentTasks = tasks.filter(
    (t) => t.category === "urgent" && t.status !== "done"
  );
  const accent = trip.theme?.accent ?? "var(--color-lavender-500)";

  const kpis: {
    key: string;
    icon: typeof FileText;
    value: string;
    label: string;
    href?: string;
  }[] = [
    { key: "docs", icon: FileText, value: String(documents.length), label: "מסמכים", href: `/trips/${trip.id}/documents` },
    { key: "hotels", icon: HotelIcon, value: String(hotels.length), label: "מלונות", href: `/trips/${trip.id}/hotels` },
    { key: "flights", icon: Plane, value: String(flights.length), label: "טיסות", href: `/trips/${trip.id}/flights` },
    { key: "tasks", icon: CheckCircle, value: `${doneTasks}/${tasks.length}`, label: "משימות", href: `/trips/${trip.id}/tasks` },
    { key: "attractions", icon: Camera, value: String(attractions.length), label: "אטרקציות", href: `/trips/${trip.id}/attractions` },
  ];

  return (
    <div className="page-enter pb-8">
      {/* Cover header */}
      <header
        className="relative flex min-h-44 flex-col justify-end px-4 py-6 md:px-8"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, var(--color-lavender-700) 100%)`,
        }}
      >
        <CoverImage
          src={trip.coverImageUrl}
          alt={trip.name}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/10" />
        <Link
          href="/trips"
          className="absolute end-4 top-4 flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-sm text-white backdrop-blur transition-colors hover:bg-white/25"
        >
          חזרה
          <ArrowRight className="size-4" />
        </Link>
        <div className="relative mx-auto w-full max-w-3xl text-white">
          <h1 className="text-3xl font-bold drop-shadow-sm">{trip.name}</h1>
          <p className="mt-1 text-white/90">
            {formatHebrewRange(trip.startDate, trip.endDate)} · {formatNights(nights)}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/90">
            <span className="flex items-center gap-1.5">
              <Users className="size-4" />
              {trip.members.length} משתתפים
            </span>
            {trip.status === "upcoming" && (
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" />
                {formatCountdown(trip.startDate, today)}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-8">
        {/* Module tabs (mobile only; desktop uses the right sidebar) */}
        <div className="md:hidden">
          <TripTabs tripId={trip.id} enabledModules={trip.enabledModules} />
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-5 gap-2">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            const inner = (
              <>
                <Icon className="size-5 text-primary" />
                <span className="font-mono text-lg font-bold leading-none">
                  {kpi.value}
                </span>
                <span className="text-[11px] text-muted-foreground">{kpi.label}</span>
              </>
            );
            const cls =
              "flex flex-col items-center gap-1 px-1 py-3 text-center transition-shadow hover:shadow-md";
            return kpi.href ? (
              <Link key={kpi.key} href={kpi.href}>
                <Card className={cls}>{inner}</Card>
              </Link>
            ) : (
              <Card key={kpi.key} className={cls}>
                {inner}
              </Card>
            );
          })}
        </div>

        {/* Urgent actions */}
        {urgentTasks.length > 0 && (
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <AlertTriangle className="size-5 text-[var(--status-warning,#f59e0b)] text-amber-500" />
              פעולות דחופות ({urgentTasks.length})
            </h2>
            <Card className="divide-y divide-border">
              {urgentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-4">
                  <span className="size-2 shrink-0 rounded-full bg-amber-500" />
                  <span className="text-sm">{task.title}</span>
                </div>
              ))}
            </Card>
          </section>
        )}

        {/* Trip structure (bases) */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <MapPin className="size-5 text-primary" />
            מבנה הטיול ({bases.length} בסיסים)
          </h2>
          <Card className="divide-y divide-border">
            {bases.map((base) => {
              const hotel = hotels.find((h) => h.baseId === base.id);
              return (
                <div key={base.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{base.name}</span>
                      {base.nameLocal && (
                        <span className="text-xs text-muted-foreground">
                          {base.nameLocal}
                        </span>
                      )}
                    </div>
                    {hotel && (
                      <p className="truncate text-sm text-muted-foreground">
                        {hotel.name}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-end font-mono text-xs text-muted-foreground">
                    {formatNightsRange(base.checkInDate, base.checkOutDate)}
                  </span>
                </div>
              );
            })}
          </Card>
        </section>
      </div>
    </div>
  );
}
