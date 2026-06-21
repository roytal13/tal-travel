import { notFound } from "next/navigation";
import { DayDetailScreen } from "@/components/plan/day-detail-screen";
import { getTrip, getDay, getDailyPlan, getBases, getHotels, getAttractions } from "@/lib/db";

export default async function DayPage({
  params,
}: {
  params: Promise<{ tripId: string; date: string }>;
}) {
  const { tripId, date } = await params;
  const [trip, day, days] = await Promise.all([
    getTrip(tripId),
    getDay(tripId, date),
    getDailyPlan(tripId),
  ]);
  if (!trip || !day) notFound();

  const [bases, hotels, attractions] = await Promise.all([
    getBases(tripId),
    getHotels(tripId),
    getAttractions(tripId),
  ]);

  const base = bases.find((b) => b.id === day.baseId);
  const idx = days.findIndex((d) => d.date === date);
  const prevDate = idx > 0 ? days[idx - 1].date : undefined;
  const nextDate = idx < days.length - 1 ? days[idx + 1].date : undefined;

  return (
    <DayDetailScreen
      tripId={tripId}
      day={day}
      base={base}
      hotel={hotels.find((h) => h.id === day.hotelId)}
      attractions={attractions.filter((a) => a.baseId === day.baseId)}
      totalDays={days.length}
      prevDate={prevDate}
      nextDate={nextDate}
    />
  );
}
