/**
 * Supabase-backed data layer. Replaces the former mock getters with real
 * queries; RLS scopes everything to the signed-in user. Each getter creates a
 * server client (cookie-bound) and maps snake_case rows to the camelCase
 * domain types in lib/types.ts.
 */

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type {
  Attraction,
  Base,
  DailyPlanEntry,
  Expense,
  Flight,
  Hotel,
  ModuleKey,
  PackingItem,
  Task,
  Trip,
  TripDocument,
  TripMember,
} from "@/lib/types";

/** Reference "today" so countdowns are stable between server and client. */
export const TODAY = "2026-06-08";
/** The day the Today screen previews while the trip is still in the future. */
export const FEATURED_TODAY = "2026-07-23";

// ---- mappers -------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapTrip(t: any, mods: any[], mems: any[]): Trip {
  return {
    id: t.id,
    name: t.name,
    destinationCountry: t.destination_country ?? undefined,
    destinationCountryCode: t.destination_country_code ?? undefined,
    startDate: t.start_date,
    endDate: t.end_date,
    coverImageUrl: t.cover_image_url ?? undefined,
    description: t.description ?? undefined,
    status: t.status,
    budgetIls: t.budget_ils ?? undefined,
    travelers: t.settings?.travelers ?? undefined,
    theme: t.theme?.accent ? { accent: t.theme.accent } : undefined,
    members: mems.map(
      (m): TripMember => ({
        id: m.user_id,
        name: m.users?.full_name ?? "משתמש",
        role: m.role,
      })
    ),
    enabledModules: mods
      .filter((m) => m.enabled !== false)
      .map((m) => m.module_key as ModuleKey),
  };
}

function mapBase(b: any): Base {
  return {
    id: b.id,
    tripId: b.trip_id,
    name: b.name,
    nameLocal: b.name_local ?? undefined,
    displayOrder: b.display_order,
    checkInDate: b.check_in_date,
    checkOutDate: b.check_out_date,
    region: b.region ?? undefined,
    notes: b.notes ?? undefined,
    latitude: b.latitude ?? undefined,
    longitude: b.longitude ?? undefined,
  };
}

function mapHotel(h: any): Hotel {
  return {
    id: h.id,
    tripId: h.trip_id,
    baseId: h.base_id ?? undefined,
    name: h.name,
    chain: h.chain ?? undefined,
    location: h.location ?? undefined,
    checkInDate: h.check_in_date ?? undefined,
    checkOutDate: h.check_out_date ?? undefined,
    status: h.status,
    pricePerNight: h.price_per_night ?? undefined,
    currency: h.currency ?? undefined,
    url: h.url ?? undefined,
    bookingReference: h.booking_reference ?? undefined,
    notes: h.notes ?? undefined,
    coverImageUrl: h.cover_image_url ?? undefined,
    isRecommended: h.is_recommended ?? undefined,
  };
}

function mapFlight(f: any): Flight {
  return {
    id: f.id,
    tripId: f.trip_id,
    flightType: f.flight_type,
    airline: f.airline,
    flightNumber: f.flight_number ?? undefined,
    departureAirport: f.departure_airport,
    departureAirportName: f.departure_airport_name ?? undefined,
    arrivalAirport: f.arrival_airport,
    arrivalAirportName: f.arrival_airport_name ?? undefined,
    departureTime: f.departure_time,
    arrivalTime: f.arrival_time,
    durationMinutes: f.duration_minutes ?? undefined,
    seatClass: f.seat_class ?? undefined,
    bookingReference: f.booking_reference ?? undefined,
    status: f.status,
    notes: f.notes ?? undefined,
  };
}

function mapDay(d: any): DailyPlanEntry {
  return {
    id: d.id,
    tripId: d.trip_id,
    baseId: d.base_id ?? undefined,
    date: d.date,
    dayNumber: d.day_number ?? undefined,
    title: d.title ?? undefined,
    activities: d.activities ?? undefined,
    tag: d.tag ?? undefined,
    hotelId: d.hotel_id ?? undefined,
    notes: d.notes ?? undefined,
    weather: d.weather ?? undefined,
    timeline: d.timeline ?? undefined,
  };
}

function mapAttraction(a: any): Attraction {
  return {
    id: a.id,
    tripId: a.trip_id,
    baseId: a.base_id ?? undefined,
    name: a.name,
    nameLocal: a.name_local ?? undefined,
    description: a.description ?? undefined,
    coverImageUrl: a.cover_image_url ?? undefined,
    category: a.category ?? undefined,
    priority: a.priority ?? undefined,
    status: a.status,
    notes: a.notes ?? undefined,
  };
}

function mapTask(t: any): Task {
  return {
    id: t.id,
    tripId: t.trip_id,
    title: t.title,
    description: t.description ?? undefined,
    category: t.category ?? undefined,
    status: t.status,
    assignedTo: t.assigned_to ?? undefined,
    dueDate: t.due_date ?? undefined,
    displayOrder: t.display_order ?? undefined,
  };
}

function mapDocument(d: any): TripDocument {
  return {
    id: d.id,
    tripId: d.trip_id,
    category: d.category,
    title: d.title,
    relatedToUserId: d.related_to_user_id ?? undefined,
    expiryDate: d.expiry_date ?? undefined,
    notes: d.notes ?? undefined,
    createdAt: d.created_at ?? undefined,
    filePath: d.file_path ?? undefined,
    mimeType: d.mime_type ?? undefined,
  };
}

function mapExpense(e: any): Expense {
  return {
    id: e.id,
    tripId: e.trip_id,
    category: e.category,
    amount: e.amount,
    currency: e.currency,
    amountIls: e.amount_ils ?? 0,
    description: e.description ?? undefined,
    expenseDate: e.expense_date,
    paidBy: e.paid_by ?? undefined,
    location: e.location ?? undefined,
  };
}

function mapPacking(p: any): PackingItem {
  return {
    id: p.id,
    tripId: p.trip_id,
    category: p.category,
    name: p.name,
    quantity: p.quantity ?? undefined,
    packed: p.packed ?? false,
  };
}

// ---- queries -------------------------------------------------------------

export const getTrips = cache(async (): Promise<Trip[]> => {
  const supabase = await createClient();
  const { data: trips } = await supabase
    .from("trips")
    .select("*")
    .is("deleted_at", null)
    .order("start_date");
  if (!trips?.length) return [];

  const ids = trips.map((t) => t.id);
  const [{ data: mods }, { data: mems }] = await Promise.all([
    supabase.from("trip_modules").select("trip_id, module_key, enabled").in("trip_id", ids),
    supabase
      .from("trip_members")
      .select("trip_id, user_id, role, users(full_name)")
      .in("trip_id", ids),
  ]);

  return trips.map((t) =>
    mapTrip(
      t,
      (mods ?? []).filter((m) => m.trip_id === t.id),
      (mems ?? []).filter((m) => m.trip_id === t.id)
    )
  );
});

export const getTrip = cache(async (id: string): Promise<Trip | undefined> => {
  const supabase = await createClient();
  const { data: t } = await supabase.from("trips").select("*").eq("id", id).maybeSingle();
  if (!t) return undefined;

  const [{ data: mods }, { data: mems }] = await Promise.all([
    supabase.from("trip_modules").select("module_key, enabled").eq("trip_id", id),
    supabase
      .from("trip_members")
      .select("user_id, role, users(full_name)")
      .eq("trip_id", id),
  ]);

  return mapTrip(t, mods ?? [], mems ?? []);
});

export const getBases = cache(async (tripId: string): Promise<Base[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bases")
    .select("*")
    .eq("trip_id", tripId)
    .order("display_order");
  return (data ?? []).map(mapBase);
});

export const getHotels = cache(async (tripId: string): Promise<Hotel[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hotels")
    .select("*")
    .eq("trip_id", tripId)
    .order("check_in_date");
  return (data ?? []).map(mapHotel);
});

export const getFlights = cache(async (tripId: string): Promise<Flight[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("flights")
    .select("*")
    .eq("trip_id", tripId)
    .order("departure_time");
  return (data ?? []).map(mapFlight);
});

export const getTasks = cache(async (tripId: string): Promise<Task[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("trip_id", tripId)
    .order("display_order");
  return (data ?? []).map(mapTask);
});

export const getAttractions = cache(async (tripId: string): Promise<Attraction[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("attractions")
    .select("*")
    .eq("trip_id", tripId);
  return (data ?? []).map(mapAttraction);
});

export const getDocuments = cache(async (tripId: string): Promise<TripDocument[]> => {
  const supabase = await createClient();
  const { data } = await supabase.from("documents").select("*").eq("trip_id", tripId);
  const docs = (data ?? []).map(mapDocument);

  // Sign URLs (1h) so the private files can be previewed/downloaded.
  const paths = docs.map((d) => d.filePath).filter((p): p is string => Boolean(p));
  if (paths.length) {
    const { data: signed } = await supabase.storage
      .from("trip-documents")
      .createSignedUrls(paths, 3600);
    const urlByPath = new Map(
      (signed ?? []).filter((s) => s.signedUrl).map((s) => [s.path, s.signedUrl])
    );
    for (const d of docs) {
      if (d.filePath) d.fileUrl = urlByPath.get(d.filePath) ?? undefined;
    }
  }
  return docs;
});

export const getDailyPlan = cache(async (tripId: string): Promise<DailyPlanEntry[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("daily_plan")
    .select("*")
    .eq("trip_id", tripId)
    .order("date");
  return (data ?? []).map(mapDay);
});

export const getDay = cache(
  async (tripId: string, date: string): Promise<DailyPlanEntry | undefined> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("daily_plan")
      .select("*")
      .eq("trip_id", tripId)
      .eq("date", date)
      .maybeSingle();
    return data ? mapDay(data) : undefined;
  }
);

export const getExpenses = cache(async (tripId: string): Promise<Expense[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("expenses")
    .select("*")
    .eq("trip_id", tripId)
    .order("expense_date", { ascending: false });
  return (data ?? []).map(mapExpense);
});

export const getPackingItems = cache(async (tripId: string): Promise<PackingItem[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("packing_items")
    .select("*")
    .eq("trip_id", tripId)
    .order("display_order");
  return (data ?? []).map(mapPacking);
});
