import { notFound } from "next/navigation";
import { getTrip } from "@/lib/db";
import { DrivingScreen } from "@/components/driving/driving-screen";

export default async function DrivingPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  return (
    <div className="page-enter">
      <DrivingScreen />
    </div>
  );
}
