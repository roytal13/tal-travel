import { notFound } from "next/navigation";
import { TripModuleHeader } from "@/components/trips/trip-module-header";
import { FlightCard } from "@/components/flights/flight-card";
import { getTrip, getFlights } from "@/lib/db";
import type { Flight } from "@/lib/types";

const GROUP_ORDER: Flight["flightType"][] = ["international", "domestic", "connection"];
const GROUP_LABEL: Record<Flight["flightType"], string> = {
  international: "בינלאומיות",
  domestic: "פנים",
  connection: "חיבורים",
};

export default async function FlightsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const flights = await getFlights(tripId);
  const groups = GROUP_ORDER.map((type) => ({
    type,
    flights: flights.filter((f) => f.flightType === type),
  })).filter((g) => g.flights.length > 0);

  return (
    <div className="page-enter">
      <TripModuleHeader trip={trip} />
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">טיסות</h2>
          <span className="text-sm text-muted-foreground">{flights.length} טיסות</span>
        </div>

        {groups.map((group) => (
          <section key={group.type}>
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {GROUP_LABEL[group.type]} ({group.flights.length})
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.flights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
