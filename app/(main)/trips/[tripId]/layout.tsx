import { TripModuleSidebar } from "@/components/trips/trip-module-sidebar";
import { TripModuleHeader } from "@/components/trips/trip-module-header";
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
      {/* Desktop: vertical module sidebar on the right (RTL start) */}
      {trip && (
        <TripModuleSidebar
          tripId={trip.id}
          tripName={trip.name}
          enabledModules={trip.enabledModules}
        />
      )}
      <div className="min-w-0 flex-1">
        {/* Mobile: sticky module nav, stays on screen while pages load */}
        {trip && <TripModuleHeader trip={trip} />}
        {children}
      </div>
    </div>
  );
}
