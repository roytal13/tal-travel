import { notFound } from "next/navigation";
import { TripModuleHeader } from "@/components/trips/trip-module-header";
import { TasksScreen } from "@/components/tasks/tasks-screen";
import { getTrip, getTasks } from "@/lib/db";

export default async function TripTasksPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const tasks = await getTasks(tripId);

  return (
    <div className="page-enter">
      <TripModuleHeader trip={trip} />
      <TasksScreen tasks={tasks} />
    </div>
  );
}
