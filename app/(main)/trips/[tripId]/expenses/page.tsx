import { notFound } from "next/navigation";
import { TripModuleHeader } from "@/components/trips/trip-module-header";
import { ExpensesScreen } from "@/components/expenses/expenses-screen";
import { getTrip, getExpenses } from "@/lib/db";
import { getDestination } from "@/lib/destinations";

// Fallback currency when the destination has no config.
const DEFAULT_CURRENCY = {
  code: "USD",
  symbol: "$",
  name: "דולר",
  ilsPerUnit: 3.7,
};

export default async function ExpensesPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const currency = getDestination(trip.destinationCountryCode)?.currency ?? DEFAULT_CURRENCY;
  const expenses = await getExpenses(tripId);

  return (
    <div className="page-enter">
      <TripModuleHeader trip={trip} />
      <ExpensesScreen
        tripId={tripId}
        initial={expenses}
        budgetIls={trip.budgetIls}
        currency={currency}
      />
    </div>
  );
}
