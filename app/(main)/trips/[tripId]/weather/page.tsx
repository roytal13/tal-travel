import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { WeatherCard } from "@/components/weather/weather-card";
import { getTrip, getBases } from "@/lib/db";
import { fetchForecast } from "@/lib/weather";

export default async function WeatherPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  // Unique locations (Tokyo appears at start and end), with coordinates.
  const seen = new Set<string>();
  const locations = (await getBases(tripId)).filter((b) => {
    if (b.latitude == null || b.longitude == null) return false;
    const key = `${b.latitude},${b.longitude}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Fetch all forecasts in parallel.
  const forecasts = await Promise.all(
    locations.map((b) => fetchForecast(b.latitude!, b.longitude!))
  );

  return (
    <div className="page-enter">
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
        <h2 className="mb-1 text-2xl font-bold">מזג אוויר</h2>
        <p className="mb-5 flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          תחזית חיה ל-7 הימים הקרובים לכל יעד (Open-Meteo). בזמן הטיול תוצג התחזית בפועל לתאריכים.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {locations.map((base, i) => (
            <WeatherCard
              key={base.id}
              name={base.name}
              nameLocal={base.nameLocal}
              forecast={forecasts[i]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
