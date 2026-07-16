export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { DayDetailScreen } from "@/components/plan/day-detail-screen";
import { getTrip, getDailyPlan, getDay, getBases, getHotels, getAttractions, TODAY, FEATURED_TODAY } from "@/lib/db";

export default async function TripTodayPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const [trip, days] = await Promise.all([getTrip(tripId), getDailyPlan(tripId)]);
  if (!trip) notFound();

  const inProgress = TODAY >= trip.startDate && TODAY <= trip.endDate;
  const targetDate = inProgress ? TODAY : FEATURED_TODAY;

  const [day, bases, hotels, attractions] = await Promise.all([
    getDay(tripId, targetDate),
    getBases(tripId),
    getHotels(tripId),
    getAttractions(tripId),
  ]);

  const today = day ?? days[0];
  if (!today) notFound();

  const idx = days.findIndex((d) => d.date === today.date);
  const prevDate = idx > 0 ? days[idx - 1].date : undefined;
  const nextDate = idx < days.length - 1 ? days[idx + 1].date : undefined;
  const base = bases.find((b) => b.id === today.baseId);

  return (
    <div className="page-enter">
      <DayDetailScreen
        tripId={tripId}
        day={today}
        base={base}
        hotel={hotels.find((h) => h.id === today.hotelId)}
        attractions={attractions.filter((a) => a.baseId === today.baseId)}
        totalDays={days.length}
        prevDate={prevDate}
        nextDate={nextDate}
      />
    </div>
  );
}
