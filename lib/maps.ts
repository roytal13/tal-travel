/**
 * Build a Google Maps directions link to a place. Opens turn-by-turn
 * navigation from the user's current location to the destination.
 * Works on web and deep-links into the Google Maps app on mobile.
 */
export function mapsDirectionsUrl(parts: Array<string | undefined>): string {
  const query = parts.filter(Boolean).join(", ");
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}
