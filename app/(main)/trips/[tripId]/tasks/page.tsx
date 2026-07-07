import { notFound } from "next/navigation";
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
      <TasksScreen tasks={tasks} tripId={tripId} />
    </div>
  );
}
