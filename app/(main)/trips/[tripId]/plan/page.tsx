import { notFound } from "next/navigation";
import { DayCard } from "@/components/plan/day-card";
import { getTrip, getDailyPlan, getBases, getHotels } from "@/lib/db";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const [days, bases, hotels] = await Promise.all([
    getDailyPlan(tripId),
    getBases(tripId),
    getHotels(tripId),
  ]);

  return (
    <div className="page-enter">
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">לוח זמנים</h2>
          <span className="text-sm text-muted-foreground">{days.length} ימים</span>
        </div>
        <div className="space-y-3">
          {days.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              base={bases.find((b) => b.id === day.baseId)}
              hotel={hotels.find((h) => h.id === day.hotelId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
