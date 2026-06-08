import { notFound } from "next/navigation";
import { TripModuleHeader } from "@/components/trips/trip-module-header";
import { PhrasebookScreen } from "@/components/phrasebook/phrasebook-screen";
import { Card } from "@/components/ui/card";
import { getTrip } from "@/lib/db";
import { getDestination } from "@/lib/destinations";

export default async function PhrasebookPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const phrasebook = getDestination(trip.destinationCountryCode)?.phrasebook;

  return (
    <div className="page-enter">
      <TripModuleHeader trip={trip} />
      {phrasebook ? (
        <PhrasebookScreen
          localeName={phrasebook.localeName}
          categories={phrasebook.categories}
        />
      ) : (
        <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
          <Card className="p-6 text-center text-muted-foreground">
            אין עדיין מילון ליעד הזה
          </Card>
        </div>
      )}
    </div>
  );
}
