import { TripModuleSidebar } from "@/components/trips/trip-module-sidebar";
import { getTrip } from "@/lib/db";

export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);

  return (
    <div className="md:flex">
      {trip && (
        <TripModuleSidebar
          tripId={trip.id}
          tripName={trip.name}
          enabledModules={trip.enabledModules}
        />
      )}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
