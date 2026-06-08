import { TripsScreen, type TripWithBases } from "@/components/trips/trips-screen";
import { getTrips, getBases, TODAY } from "@/lib/db";

export default async function TripsPage() {
  const trips = await getTrips();
  const items: TripWithBases[] = await Promise.all(
    trips.map(async (trip) => ({ trip, bases: await getBases(trip.id) }))
  );

  return <TripsScreen items={items} today={TODAY} />;
}
