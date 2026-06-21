import { notFound } from "next/navigation";
import { AttractionsScreen } from "@/components/attractions/attractions-screen";
import { getTrip, getAttractions, getBases } from "@/lib/db";
import { getDestination } from "@/lib/destinations";

export default async function TripAttractionsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const countryName =
    getDestination(trip.destinationCountryCode)?.countryNameEn ??
    trip.destinationCountry;
  const [attractions, bases] = await Promise.all([
    getAttractions(tripId),
    getBases(tripId),
  ]);

  return (
    <div className="page-enter">
      <AttractionsScreen
        tripId={tripId}
        attractions={attractions}
        bases={bases}
        countryName={countryName}
      />
    </div>
  );
}
