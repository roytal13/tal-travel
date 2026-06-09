import { notFound } from "next/navigation";
import { HotelCard } from "@/components/hotels/hotel-card";
import { getTrip, getHotels } from "@/lib/db";
import { getDestination } from "@/lib/destinations";

export default async function HotelsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const hotels = await getHotels(tripId);
  const countryName =
    getDestination(trip.destinationCountryCode)?.countryNameEn ??
    trip.destinationCountry;

  return (
    <div className="page-enter">
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">מלונות</h2>
          <span className="text-sm text-muted-foreground">{hotels.length} מלונות</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} countryName={countryName} />
          ))}
        </div>
      </div>
    </div>
  );
}
