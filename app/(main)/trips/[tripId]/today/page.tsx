import { notFound } from "next/navigation";
import { TripModuleHeader } from "@/components/trips/trip-module-header";
import { TodayScreen } from "@/components/today/today-screen";
import { Card } from "@/components/ui/card";
import {
  getTrip,
  getDailyPlan,
  getDay,
  getBases,
  getHotels,
  TODAY,
  FEATURED_TODAY,
} from "@/lib/db";

export default async function TripTodayPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const days = await getDailyPlan(tripId);
  // Use the real "today" if the trip is in progress, otherwise a preview day.
  const inProgress = TODAY >= trip.startDate && TODAY <= trip.endDate;
  const targetDate = inProgress ? TODAY : FEATURED_TODAY;
  const [day, bases, hotels] = await Promise.all([
    getDay(tripId, targetDate),
    getBases(tripId),
    getHotels(tripId),
  ]);
  const today = day ?? days[0];

  return (
    <div className="page-enter">
      <TripModuleHeader trip={trip} />
      {today ? (
        <TodayScreen
          trip={trip}
          day={today}
          base={bases.find((b) => b.id === today.baseId)}
          hotel={hotels.find((h) => h.id === today.hotelId)}
          totalDays={days.length}
          isPreview={!inProgress}
        />
      ) : (
        <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
          <Card className="p-6 text-center text-muted-foreground">
            אין עדיין לוח זמנים יומי לטיול הזה
          </Card>
        </div>
      )}
    </div>
  );
}
