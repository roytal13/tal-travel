/**
 * Hebrew date and number formatting helpers.
 * Roy's conventions (see docs/CLAUDE.md):
 *   - Date: "ה' 23.7" (day-of-week letter + DD.MM)
 *   - Ranges: check-in -> check-out, "23.7 → 26.7 · 3 לילות"
 *   - No em dashes anywhere.
 */

const HEBREW_DAY_LETTERS = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"];

/** Parse a YYYY-MM-DD date as local noon to avoid timezone drift. */
function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

/** "ה' 23.7" - day-of-week letter + day.month */
export function formatHebrewDate(iso: string): string {
  const date = parseDate(iso);
  const letter = HEBREW_DAY_LETTERS[date.getDay()];
  return `${letter} ${date.getDate()}.${date.getMonth() + 1}`;
}

/** "23.7" - day.month only */
export function formatShortDate(iso: string): string {
  const date = parseDate(iso);
  return `${date.getDate()}.${date.getMonth() + 1}`;
}

/** "23.7.2026" - day.month.year */
export function formatFullDate(iso: string): string {
  const date = parseDate(iso);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

/** "3.2027" - month.year, used for passport / visa expiry. */
export function formatMonthYear(iso: string): string {
  const date = parseDate(iso);
  return `${date.getMonth() + 1}.${date.getFullYear()}`;
}

/** True if `expiry` falls within `months` after `reference` (passport rule). */
export function expiresWithin(
  expiry: string,
  reference: string,
  months: number
): boolean {
  const ref = parseDate(reference);
  ref.setMonth(ref.getMonth() + months);
  return parseDate(expiry).getTime() < ref.getTime();
}

/** Whole nights between two dates. */
export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = parseDate(checkIn).getTime();
  const end = parseDate(checkOut).getTime();
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

/** "3 לילות" / "לילה אחד" */
export function formatNights(nights: number): string {
  if (nights === 1) return "לילה אחד";
  return `${nights} לילות`;
}

/** "23.7 → 26.7 · 3 לילות" - the canonical range form. */
export function formatNightsRange(checkIn: string, checkOut: string): string {
  const nights = nightsBetween(checkIn, checkOut);
  return `${formatShortDate(checkIn)} → ${formatShortDate(checkOut)} · ${formatNights(nights)}`;
}

/** "ב' 20.7 → ה' 6.8" - range with day-of-week letters (for trip headers). */
export function formatHebrewRange(checkIn: string, checkOut: string): string {
  return `${formatHebrewDate(checkIn)} → ${formatHebrewDate(checkOut)}`;
}

/**
 * Days from `today` until a date. Positive means future.
 * `today` is injected so server and client agree (avoids hydration drift).
 */
export function daysUntil(iso: string, today: string): number {
  const target = parseDate(iso).getTime();
  const now = parseDate(today).getTime();
  return Math.round((target - now) / (1000 * 60 * 60 * 24));
}

/** "עוד 42 ימים" / "עוד יום" / "היום" / "הסתיים" */
export function formatCountdown(startIso: string, today: string): string {
  const days = daysUntil(startIso, today);
  if (days === 0) return "מתחיל היום";
  if (days === 1) return "עוד יום";
  if (days > 1) return `עוד ${days} ימים`;
  if (days === -1) return "התחיל אתמול";
  return "בטיול";
}

/** "19:45" from an ISO timestamp, in the given IANA timezone. */
export function formatTime(iso: string, timeZone?: string): string {
  return new Intl.DateTimeFormat("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(new Date(iso));
}

/**
 * Read the local wall-clock time straight from an ISO string that already
 * carries its own offset (e.g. "2026-07-20T19:45:00+03:00" -> "19:45").
 * This shows the time as it reads at that airport, no timezone conversion.
 */
export function isoLocalTime(iso: string): string {
  const m = iso.match(/T(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : "";
}

/** The local calendar date portion of an ISO string ("2026-07-21"). */
export function isoLocalDate(iso: string): string {
  return iso.split("T")[0];
}

/** Day offset between two ISO local dates (e.g. arrival next day -> 1). */
export function localDayOffset(fromIso: string, toIso: string): number {
  return nightsBetween(isoLocalDate(fromIso), isoLocalDate(toIso));
}

/** "11h 35m" from minutes. */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
