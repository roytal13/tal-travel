import { notFound } from "next/navigation";
import { TripModuleHeader } from "@/components/trips/trip-module-header";
import { PackingScreen } from "@/components/packing/packing-screen";
import { getTrip, getPackingItems } from "@/lib/db";

export default async function PackingPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const items = await getPackingItems(tripId);

  return (
    <div className="page-enter">
      <TripModuleHeader trip={trip} />
      <PackingScreen tripId={tripId} initial={items} />
    </div>
  );
}
