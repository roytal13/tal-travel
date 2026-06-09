import { TripHamburgerNav } from "./trip-hamburger-nav";
import type { Trip } from "@/lib/types";

export function TripModuleHeader({ trip }: { trip: Trip }) {
  return (
    <TripHamburgerNav
      tripId={trip.id}
      tripName={trip.name}
      enabledModules={trip.enabledModules}
    />
  );
}
