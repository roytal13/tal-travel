/**
 * Domain types for Tal Travel.
 * These mirror docs/DB_SCHEMA.md so moving from the mock layer to Supabase
 * is a thin swap. Dates are ISO strings (YYYY-MM-DD) or full ISO timestamps.
 */

export type TripStatus =
  | "planning"
  | "upcoming"
  | "active"
  | "completed"
  | "archived";

export type ModuleKey =
  | "today"
  | "daily_plan"
  | "hotels"
  | "flights"
  | "attractions"
  | "tasks"
  | "documents"
  | "weather"
  | "phrasebook"
  | "currency"
  | "expenses"
  | "packing"
  | "journal"
  | "photos";

export interface TripMember {
  id: string;
  name: string;
  role: "owner" | "editor" | "viewer";
  avatarUrl?: string;
  isChild?: boolean;
}

export interface Trip {
  id: string;
  name: string;
  destinationCountry?: string;
  destinationCountryCode?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  coverImageUrl?: string;
  description?: string;
  status: TripStatus;
  members: TripMember[];
  enabledModules: ModuleKey[];
  /** Party size for display (e.g. family of 5), stored in settings. */
  travelers?: number;
  /** Optional total budget in ILS, for the expenses module. */
  budgetIls?: number;
  /** Optional per-trip theme accent (platform default is lavender). */
  theme?: { accent?: string };
}

export interface Base {
  id: string;
  tripId: string;
  name: string;
  nameLocal?: string;
  displayOrder: number;
  checkInDate: string;
  checkOutDate: string;
  region?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
}

export type HotelStatus =
  | "researching"
  | "deciding"
  | "to_book"
  | "booked"
  | "paid"
  | "cancelled";

export interface Hotel {
  id: string;
  tripId: string;
  baseId?: string;
  name: string;
  chain?: string;
  location?: string;
  checkInDate?: string;
  checkOutDate?: string;
  status: HotelStatus;
  pricePerNight?: number;
  currency?: string;
  url?: string;
  bookingReference?: string;
  notes?: string;
  coverImageUrl?: string;
  isRecommended?: boolean;
}

export type FlightType = "international" | "domestic" | "connection";
export type FlightStatus =
  | "researching"
  | "booked"
  | "checked_in"
  | "completed"
  | "cancelled";

export interface Flight {
  id: string;
  tripId: string;
  flightType: FlightType;
  airline: string;
  flightNumber?: string;
  departureAirport: string;
  departureAirportName?: string;
  arrivalAirport: string;
  arrivalAirportName?: string;
  departureTime: string; // ISO timestamp
  arrivalTime: string; // ISO timestamp
  durationMinutes?: number;
  seatClass?: string;
  bookingReference?: string;
  status: FlightStatus;
  notes?: string;
}

export type DailyPlanTag =
  | "arrival"
  | "travel"
  | "exploration"
  | "rest"
  | "departure";

export interface DayWeather {
  tempMin: number;
  tempMax: number;
  conditions: string; // "בהיר", "מעונן חלקית"
}

/** A single scheduled item within a day, for the Today timeline. */
export interface TimelineItem {
  time?: string; // "08:00"
  title: string;
  subtitle?: string;
  kind: "flight" | "hotel" | "transport" | "activity" | "food" | "document";
  done?: boolean;
}

export interface DailyPlanEntry {
  id: string;
  tripId: string;
  baseId?: string;
  date: string; // YYYY-MM-DD
  dayNumber?: number;
  title?: string;
  activities?: string;
  tag?: DailyPlanTag;
  hotelId?: string;
  notes?: string;
  weather?: DayWeather;
  /** Mock convenience: a richer per-day schedule for the Today screen. */
  timeline?: TimelineItem[];
}

export type AttractionCategory =
  | "nature"
  | "culture"
  | "food"
  | "entertainment"
  | "shopping";
export type AttractionPriority = "must" | "recommended" | "optional";
export type AttractionStatus =
  | "suggested"
  | "selected"
  | "scheduled"
  | "visited"
  | "skipped";

export interface Attraction {
  id: string;
  tripId: string;
  baseId?: string;
  name: string;
  nameLocal?: string;
  description?: string;
  coverImageUrl?: string;
  category?: AttractionCategory;
  priority?: AttractionPriority;
  status: AttractionStatus;
  notes?: string;
}

export type TaskCategory =
  | "urgent"
  | "soon"
  | "before_departure"
  | "during_trip";
export type TaskStatus = "open" | "in_progress" | "done" | "cancelled";

export interface Task {
  id: string;
  tripId: string;
  title: string;
  description?: string;
  category?: TaskCategory;
  status: TaskStatus;
  assignedTo?: string;
  dueDate?: string;
  displayOrder?: number;
}

export type ExpenseCategory =
  | "food"
  | "transport"
  | "accommodation"
  | "attraction"
  | "shopping"
  | "other";

export interface Expense {
  id: string;
  tripId: string;
  category: ExpenseCategory;
  amount: number;
  currency: string; // "JPY", "ILS"
  amountIls: number; // converted to base currency
  description?: string;
  expenseDate: string; // YYYY-MM-DD
  paidBy?: string;
  location?: string;
}

export type PackingCategory =
  | "clothing"
  | "kids"
  | "electronics"
  | "documents"
  | "toiletries"
  | "misc";

export interface PackingItem {
  id: string;
  tripId: string;
  category: PackingCategory;
  name: string;
  quantity?: number;
  packed: boolean;
}

export type DocumentCategory =
  | "passport"
  | "flight_ticket"
  | "hotel_confirmation"
  | "visa"
  | "insurance"
  | "license"
  | "receipt"
  | "other";

export interface TripDocument {
  id: string;
  tripId: string;
  category: DocumentCategory;
  title: string;
  relatedToUserId?: string;
  expiryDate?: string;
  notes?: string;
  createdAt?: string;
  filePath?: string;
  mimeType?: string;
  /** Short-lived signed URL for viewing/downloading the file (private bucket). */
  fileUrl?: string;
}
