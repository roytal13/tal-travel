import { redirect } from "next/navigation";
import { Sun } from "lucide-react";
import { ComingSoon } from "@/components/app/coming-soon";
import { getTrips, getDailyPlan } from "@/lib/db";

/**
 * The global "Today" tab. In-trip use opens straight to the active trip's day.
 * Until a trip is active we send the user to the nearest upcoming trip's
 * Today screen (preview), or show an empty state if there is none.
 */
export default async function TodayPage() {
  const trips = await getTrips();
  const candidate =
    trips.find((t) => t.status === "active") ??
    trips.find((t) => t.status === "upcoming");

  if (candidate && (await getDailyPlan(candidate.id)).length > 0) {
    redirect(`/trips/${candidate.id}/today`);
  }

  return (
    <ComingSoon
      icon={Sun}
      title="היום"
      note="מסך היום יציג את לוח הזמנים הנוכחי כשיש טיול פעיל"
    />
  );
}
