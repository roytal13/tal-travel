import { notFound } from "next/navigation";
import { CurrencyConverter } from "@/components/currency/currency-converter";
import { Card } from "@/components/ui/card";
import { getTrip } from "@/lib/db";
import { getDestination } from "@/lib/destinations";

export default async function CurrencyPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const destination = getDestination(trip.destinationCountryCode);

  return (
    <div className="page-enter">
      {destination ? (
        <CurrencyConverter currency={destination.currency} />
      ) : (
        <div className="mx-auto max-w-xl px-4 py-8 md:px-8">
          <Card className="p-6 text-center text-muted-foreground">
            אין מטבע מוגדר ליעד הזה עדיין
          </Card>
        </div>
      )}
    </div>
  );
}
