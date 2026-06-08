import { notFound } from "next/navigation";
import { TripOverview } from "@/components/trips/trip-overview";
import {
  getTrip,
  getBases,
  getHotels,
  getFlights,
  getTasks,
  getDocuments,
  getAttractions,
  TODAY,
} from "@/lib/db";

export default async function TripOverviewPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const [bases, hotels, flights, tasks, documents, attractions] = await Promise.all([
    getBases(tripId),
    getHotels(tripId),
    getFlights(tripId),
    getTasks(tripId),
    getDocuments(tripId),
    getAttractions(tripId),
  ]);

  return (
    <TripOverview
      trip={trip}
      bases={bases}
      hotels={hotels}
      flights={flights}
      tasks={tasks}
      documents={documents}
      attractions={attractions}
      today={TODAY}
    />
  );
}
