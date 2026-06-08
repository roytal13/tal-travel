/**
 * Mock data layer for Tal Travel.
 * Mirrors docs/DB_SCHEMA.md and seeds the Japan 2026 trip from docs/JAPAN_TRIP.md.
 * When Supabase is connected, replace the getters below with queries; the
 * component layer should not need to change.
 */

import type {
  Attraction,
  Base,
  DailyPlanEntry,
  Expense,
  Flight,
  Hotel,
  PackingItem,
  Task,
  Trip,
  TripDocument,
  TripMember,
} from "@/lib/types";

/** Reference "today" so countdowns are stable between server and client. */
export const TODAY = "2026-06-08";

/**
 * The day the Today screen previews. The real trip is in the future, so we
 * feature a rich representative day (arrival in Sapporo) until the trip is live.
 */
export const FEATURED_TODAY = "2026-07-23";

// Members
const roy: TripMember = { id: "u-roy", name: "רוי טל", role: "owner" };
const leahy: TripMember = { id: "u-leahy", name: "לאהי טל", role: "editor" };
const ariel: TripMember = { id: "u-ariel", name: "אריאל", role: "viewer", isChild: true };
const itamar: TripMember = { id: "u-itamar", name: "איתמר", role: "viewer", isChild: true };
const michael: TripMember = { id: "u-michael", name: "מיכאל", role: "viewer", isChild: true };

const japanMembers = [roy, leahy, ariel, itamar, michael];

// Trips
const japanTrip: Trip = {
  id: "japan-2026",
  name: "יפן 2026",
  destinationCountry: "Japan",
  destinationCountryCode: "JP",
  startDate: "2026-07-20",
  endDate: "2026-08-06",
  coverImageUrl:
    "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1200&q=70",
  description: "טיול משפחתי של 16 לילות, טוקיו והוקאידו",
  status: "upcoming",
  members: japanMembers,
  budgetIls: 130000,
  enabledModules: [
    "today",
    "daily_plan",
    "hotels",
    "flights",
    "attractions",
    "tasks",
    "documents",
    "weather",
    "phrasebook",
    "currency",
    "expenses",
    "packing",
  ],
  // Japan-specific accent (vermilion) layered over the lavender platform.
  theme: { accent: "#c8362a" },
};

const greeceTrip: Trip = {
  id: "greece-2027",
  name: "יוון 2027",
  destinationCountry: "Greece",
  destinationCountryCode: "GR",
  startDate: "2027-06-01",
  endDate: "2027-06-10",
  coverImageUrl:
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=70",
  description: "טיוטה ראשונית",
  status: "planning",
  members: [roy, leahy],
  enabledModules: ["hotels", "flights", "attractions", "documents"],
};

const trips: Trip[] = [japanTrip, greeceTrip];

// Bases (Japan) - 7 stays, Tokyo appears at start and end
const bases: Base[] = [
  { id: "base-tokyo-1", tripId: "japan-2026", name: "טוקיו", nameLocal: "東京", displayOrder: 1, checkInDate: "2026-07-21", checkOutDate: "2026-07-23", region: "Kanto", latitude: 35.68, longitude: 139.76 },
  { id: "base-sapporo", tripId: "japan-2026", name: "סאפורו", nameLocal: "札幌", displayOrder: 2, checkInDate: "2026-07-23", checkOutDate: "2026-07-26", region: "Hokkaido", latitude: 43.06, longitude: 141.35 },
  { id: "base-asahikawa", tripId: "japan-2026", name: "אסהיקאווה", nameLocal: "旭川", displayOrder: 3, checkInDate: "2026-07-26", checkOutDate: "2026-07-28", region: "Hokkaido", latitude: 43.77, longitude: 142.36 },
  { id: "base-tomamu", tripId: "japan-2026", name: "טומאמו", nameLocal: "トマム", displayOrder: 4, checkInDate: "2026-07-28", checkOutDate: "2026-07-30", region: "Hokkaido", latitude: 43.06, longitude: 142.62 },
  { id: "base-toya", tripId: "japan-2026", name: "אגם טויה", nameLocal: "洞爺湖", displayOrder: 5, checkInDate: "2026-07-30", checkOutDate: "2026-08-01", region: "Hokkaido", latitude: 42.60, longitude: 140.84 },
  { id: "base-poroto", tripId: "japan-2026", name: "KAI Poroto", nameLocal: "白老", displayOrder: 6, checkInDate: "2026-08-01", checkOutDate: "2026-08-03", region: "Hokkaido", latitude: 42.55, longitude: 141.36 },
  { id: "base-tokyo-2", tripId: "japan-2026", name: "טוקיו", nameLocal: "東京", displayOrder: 7, checkInDate: "2026-08-03", checkOutDate: "2026-08-06", region: "Kanto", latitude: 35.68, longitude: 139.76 },
];

// Hotels (Japan) - Mimaru is the same hotel for both Tokyo periods
const hotels: Hotel[] = [
  { id: "hotel-mimaru", tripId: "japan-2026", baseId: "base-tokyo-1", name: "Mimaru Tokyo", chain: "Mimaru", location: "טוקיו (סניף לבחירה)", checkInDate: "2026-07-21", checkOutDate: "2026-07-23", status: "to_book", currency: "JPY", notes: "אותו מלון לשתי התקופות בטוקיו (21.7 ו-3.8). סניף עוד לא נבחר." },
  { id: "hotel-omo3", tripId: "japan-2026", baseId: "base-sapporo", name: "OMO3 Sapporo Susukino", chain: "Hoshino", location: "סאפורו, סוסוקינו", checkInDate: "2026-07-23", checkOutDate: "2026-07-26", status: "to_book", pricePerNight: 35000, currency: "JPY", isRecommended: true },
  { id: "hotel-omo7", tripId: "japan-2026", baseId: "base-asahikawa", name: "OMO7 Asahikawa", chain: "Hoshino", location: "אסהיקאווה", checkInDate: "2026-07-26", checkOutDate: "2026-07-28", status: "to_book", currency: "JPY" },
  { id: "hotel-risonare", tripId: "japan-2026", baseId: "base-tomamu", name: "RISONARE Tomamu", chain: "Hoshino", location: "טומאמו", checkInDate: "2026-07-28", checkOutDate: "2026-07-30", status: "to_book", currency: "JPY" },
  { id: "hotel-toya", tripId: "japan-2026", baseId: "base-toya", name: "Toya Sun Palace", location: "אגם טויה", checkInDate: "2026-07-30", checkOutDate: "2026-08-01", status: "deciding", currency: "JPY", notes: "מתלבטים מול Nonokaze. Sun Palace מתאים יותר לילדים (פארק מים)." },
  { id: "hotel-poroto", tripId: "japan-2026", baseId: "base-poroto", name: "KAI Poroto", chain: "Hoshino", location: "שיראואי", checkInDate: "2026-08-01", checkOutDate: "2026-08-03", status: "to_book", currency: "JPY" },
];

// Flights (Japan) - 2 international (booked) + 2 internal (to book)
const flights: Flight[] = [
  { id: "flight-ly091", tripId: "japan-2026", flightType: "international", airline: "El Al", flightNumber: "LY091", departureAirport: "TLV", departureAirportName: "תל אביב", arrivalAirport: "NRT", arrivalAirportName: "טוקיו (נריטה)", departureTime: "2026-07-20T19:45:00+03:00", arrivalTime: "2026-07-21T13:20:00+09:00", durationMinutes: 695, seatClass: "economy", status: "booked", bookingReference: "ABC123", notes: "טיסה ישירה" },
  { id: "flight-hnd-cts", tripId: "japan-2026", flightType: "domestic", airline: "ANA / JAL", departureAirport: "HND", departureAirportName: "טוקיו (הנדה)", arrivalAirport: "CTS", arrivalAirportName: "סאפורו (צ'יטוסה)", departureTime: "2026-07-23T08:00:00+09:00", arrivalTime: "2026-07-23T09:35:00+09:00", durationMinutes: 95, status: "researching", notes: "לבחור טיסת בוקר. עדיין לא הוזמן." },
  { id: "flight-cts-hnd", tripId: "japan-2026", flightType: "domestic", airline: "ANA / JAL", departureAirport: "CTS", departureAirportName: "סאפורו (צ'יטוסה)", arrivalAirport: "HND", arrivalAirportName: "טוקיו (הנדה)", departureTime: "2026-08-03T11:30:00+09:00", arrivalTime: "2026-08-03T13:05:00+09:00", durationMinutes: 95, status: "researching", notes: "מספיק מוקדם כדי ליהנות מאחר הצהריים בטוקיו." },
  { id: "flight-ly92", tripId: "japan-2026", flightType: "international", airline: "El Al", flightNumber: "LY92", departureAirport: "NRT", departureAirportName: "טוקיו (נריטה)", arrivalAirport: "TLV", arrivalAirportName: "תל אביב", departureTime: "2026-08-06T15:35:00+09:00", arrivalTime: "2026-08-06T22:20:00+03:00", durationMinutes: 765, seatClass: "economy", status: "booked", notes: "טיסה ישירה" },
];

// Tasks (Japan) - subset of the 24 pre-trip tasks
const tasks: Task[] = [
  { id: "task-1", tripId: "japan-2026", title: "הזמנת טיסות בינלאומיות", category: "urgent", status: "done", displayOrder: 1 },
  { id: "task-2", tripId: "japan-2026", title: "להזמין OMO3 Sapporo Susukino", category: "urgent", status: "open", displayOrder: 2 },
  { id: "task-3", tripId: "japan-2026", title: "להזמין OMO7 Asahikawa", category: "urgent", status: "open", displayOrder: 3 },
  { id: "task-4", tripId: "japan-2026", title: "להזמין RISONARE Tomamu", category: "urgent", status: "open", displayOrder: 4 },
  { id: "task-5", tripId: "japan-2026", title: "להזמין KAI Poroto", category: "urgent", status: "open", displayOrder: 5 },
  { id: "task-6", tripId: "japan-2026", title: "להתחיל רישיון נהיגה בינלאומי + תרגום ליפנית", category: "urgent", status: "open", displayOrder: 6 },
  { id: "task-7", tripId: "japan-2026", title: "לבחור סניף Mimaru ולהזמין את שתי התקופות", category: "soon", status: "open", displayOrder: 7 },
  { id: "task-8", tripId: "japan-2026", title: "לבחור מלון באגם טויה ולהזמין", category: "soon", status: "in_progress", displayOrder: 8 },
  { id: "task-9", tripId: "japan-2026", title: "להזמין מיניוואן (5 מבוגרים + 3 כיסאות ילדים)", category: "soon", status: "open", displayOrder: 9 },
  { id: "task-10", tripId: "japan-2026", title: "להזמין טיסת HND → CTS (23.7)", category: "soon", status: "open", displayOrder: 10 },
  { id: "task-11", tripId: "japan-2026", title: "להזמין טיסת CTS → HND (3.8)", category: "soon", status: "open", displayOrder: 11 },
  { id: "task-12", tripId: "japan-2026", title: "להזמין TeamLab Planets (חודשיים מראש)", category: "soon", status: "open", displayOrder: 12 },
  { id: "task-13", tripId: "japan-2026", title: "ביטוח נסיעות משפחתי עם כיסוי לילדים", category: "before_departure", status: "open", displayOrder: 13 },
  { id: "task-14", tripId: "japan-2026", title: "להזמין רכבת Norokko (פורנו-ביאי)", category: "before_departure", status: "open", displayOrder: 14 },
  { id: "task-15", tripId: "japan-2026", title: "להזמין שייט באגם טויה", category: "before_departure", status: "open", displayOrder: 15 },
  { id: "task-16", tripId: "japan-2026", title: "להזמין ארוחות ילדים באל על (24ש' לפני)", category: "before_departure", status: "open", displayOrder: 16 },
  { id: "task-17", tripId: "japan-2026", title: "להפעיל רומינג בינלאומי בסלקום", category: "before_departure", status: "open", displayOrder: 17 },
  { id: "task-18", tripId: "japan-2026", title: "בגדים חמים לערבי הוקאידו (15-17°)", category: "before_departure", status: "open", displayOrder: 18 },
  { id: "task-19", tripId: "japan-2026", title: "iPad מלא בסדרות לילדים לטיסה", category: "before_departure", status: "open", displayOrder: 19 },
  { id: "task-20", tripId: "japan-2026", title: "מתאם חשמל יפני (2 פינים שטוחים)", category: "before_departure", status: "open", displayOrder: 20 },
];

// Attractions (Japan) - a representative selection
const attractions: Attraction[] = [
  { id: "attr-1", tripId: "japan-2026", baseId: "base-sapporo", name: "פסטיבל הקיץ של סאפורו", description: "פארק Odori, כל ערב", category: "entertainment", priority: "must", status: "selected" },
  { id: "attr-2", tripId: "japan-2026", baseId: "base-sapporo", name: "Shiroi Koibito Park", description: "מפעל שוקולד, סדנת עוגיות לילדים", category: "food", priority: "recommended", status: "selected" },
  { id: "attr-3", tripId: "japan-2026", baseId: "base-sapporo", name: "Mt. Moiwa Ropeway", description: "פנורמה של העיר", category: "nature", priority: "recommended", status: "suggested" },
  { id: "attr-4", tripId: "japan-2026", baseId: "base-sapporo", name: "טיול יום לאוטרו", description: "תעלה, אקווריום, LeTAO", category: "culture", priority: "recommended", status: "selected" },
  { id: "attr-5", tripId: "japan-2026", baseId: "base-asahikawa", name: "גן החיות Asahiyama", description: "גן החיות הטוב ביפן", category: "nature", priority: "must", status: "selected" },
  { id: "attr-6", tripId: "japan-2026", baseId: "base-tomamu", name: "Unkai Terrace", description: "ים העננים ברכבל", category: "nature", priority: "must", status: "selected" },
  { id: "attr-7", tripId: "japan-2026", baseId: "base-tomamu", name: "Farm Tomita", description: "שיא פריחת הלבנדר ביולי", category: "nature", priority: "must", status: "selected" },
  { id: "attr-8", tripId: "japan-2026", baseId: "base-tomamu", name: "רכבת Norokko", description: "שנת ההפעלה האחרונה ב-2026", category: "entertainment", priority: "must", status: "selected" },
  { id: "attr-9", tripId: "japan-2026", baseId: "base-toya", name: "זיקוקים באגם טויה", description: "20:45 כל ערב", category: "entertainment", priority: "must", status: "selected" },
  { id: "attr-10", tripId: "japan-2026", baseId: "base-poroto", name: "מוזיאון Upopoy לתרבות האיינו", description: "5 דקות מהמלון", category: "culture", priority: "recommended", status: "selected" },
  { id: "attr-11", tripId: "japan-2026", baseId: "base-tokyo-1", name: "TeamLab Planets", description: "להזמין חודשיים מראש", category: "entertainment", priority: "must", status: "suggested" },
  { id: "attr-12", tripId: "japan-2026", baseId: "base-tokyo-1", name: "Kagurazaka Matsuri Hozuki Market", description: "הפסטיבל היחיד שמתאים לתאריכים, ערב 22.7", category: "culture", priority: "recommended", status: "selected" },
];

// Documents (Japan) - a few examples
const documents: TripDocument[] = [
  { id: "doc-1", tripId: "japan-2026", category: "passport", title: "דרכון - רוי טל", relatedToUserId: "u-roy", expiryDate: "2028-12-01" },
  { id: "doc-2", tripId: "japan-2026", category: "passport", title: "דרכון - לאהי טל", relatedToUserId: "u-leahy", expiryDate: "2027-03-01" },
  { id: "doc-3", tripId: "japan-2026", category: "flight_ticket", title: "אל על LY091 - הלוך", createdAt: "2026-05-20" },
  { id: "doc-4", tripId: "japan-2026", category: "flight_ticket", title: "אל על LY92 - חזור", createdAt: "2026-05-20" },
];

// Daily plan (Japan) - 18 days. Weather is illustrative (static for MVP).
const dailyPlan: DailyPlanEntry[] = [
  {
    id: "day-1", tripId: "japan-2026", date: "2026-07-20", dayNumber: 1, tag: "travel",
    title: "יום טיסה", activities: "המראה מתל אביב 19:45, לינה במטוס",
    timeline: [
      { time: "19:45", title: "טיסה TLV → NRT", subtitle: "אל על LY091 · אישור ABC123", kind: "flight" },
    ],
  },
  {
    id: "day-2", tripId: "japan-2026", baseId: "base-tokyo-1", hotelId: "hotel-mimaru", date: "2026-07-21", dayNumber: 2, tag: "arrival",
    title: "נחיתה בטוקיו", activities: "נחיתה 13:20, מעבר ל-Mimaru Tokyo, ערב רגוע להתאוששות",
    weather: { tempMin: 26, tempMax: 33, conditions: "חם ולח" },
  },
  {
    id: "day-3", tripId: "japan-2026", baseId: "base-tokyo-1", hotelId: "hotel-mimaru", date: "2026-07-22", dayNumber: 3, tag: "exploration",
    title: "יום בטוקיו", activities: "TeamLab Planets / גן החיות אואנו / מקדש סנסוג'י, בערב Kagurazaka Matsuri",
    weather: { tempMin: 27, tempMax: 34, conditions: "בהיר" },
  },
  {
    id: "day-4", tripId: "japan-2026", baseId: "base-sapporo", hotelId: "hotel-omo3", date: "2026-07-23", dayNumber: 4, tag: "travel",
    title: "מעבר לסאפורו", activities: "טיסת בוקר HND → CTS, איסוף רכב, נסיעה לסאפורו, בערב פסטיבל הקיץ",
    weather: { tempMin: 17, tempMax: 23, conditions: "בהיר" },
    timeline: [
      { time: "08:00", title: "טיסה HND → CTS", subtitle: "ANA / JAL · ~1.5 שעות", kind: "flight" },
      { time: "10:30", title: "איסוף רכב שכור", subtitle: "מיניוואן · נמל התעופה CTS", kind: "transport" },
      { time: "14:00", title: "צ'ק-אין במלון", subtitle: "OMO3 Sapporo Susukino", kind: "hotel" },
      { time: "18:00", title: "פסטיבל הקיץ של סאפורו", subtitle: "פארק Odori", kind: "activity", done: false },
    ],
  },
  {
    id: "day-5", tripId: "japan-2026", baseId: "base-sapporo", hotelId: "hotel-omo3", date: "2026-07-24", dayNumber: 5, tag: "exploration",
    title: "סאפורו", activities: "Shiroi Koibito Park, רכבל Mt. Moiwa, עוד פסטיבל בערב",
    weather: { tempMin: 18, tempMax: 24, conditions: "מעונן חלקית" },
  },
  {
    id: "day-6", tripId: "japan-2026", baseId: "base-sapporo", hotelId: "hotel-omo3", date: "2026-07-25", dayNumber: 6, tag: "exploration",
    title: "טיול יום לאוטרו", activities: "תעלת אוטרו, סדנת זכוכית, LeTAO, אקווריום אוטרו",
    weather: { tempMin: 18, tempMax: 23, conditions: "בהיר" },
  },
  {
    id: "day-7", tripId: "japan-2026", baseId: "base-asahikawa", hotelId: "hotel-omo7", date: "2026-07-26", dayNumber: 7, tag: "travel",
    title: "מעבר לאסהיקאווה", activities: "נסיעה צפונה כשעתיים, מוזיאון מדע Sci-Pal, ראמן מקומי",
    weather: { tempMin: 16, tempMax: 25, conditions: "בהיר" },
  },
  {
    id: "day-8", tripId: "japan-2026", baseId: "base-asahikawa", hotelId: "hotel-omo7", date: "2026-07-27", dayNumber: 8, tag: "exploration",
    title: "גן החיות Asahiyama", activities: "יום שלם בגן החיות הטוב ביפן, אחה\"צ פארק Kamui no Mori",
    weather: { tempMin: 17, tempMax: 26, conditions: "בהיר" },
  },
  {
    id: "day-9", tripId: "japan-2026", baseId: "base-tomamu", hotelId: "hotel-risonare", date: "2026-07-28", dayNumber: 9, tag: "travel",
    title: "מעבר לטומאמו", activities: "נסיעה דרומה כשעה וחצי, צ'ק-אין RISONARE, Unkai Terrace, בריכת המלון",
    weather: { tempMin: 15, tempMax: 24, conditions: "מעונן חלקית" },
  },
  {
    id: "day-10", tripId: "japan-2026", baseId: "base-tomamu", hotelId: "hotel-risonare", date: "2026-07-29", dayNumber: 10, tag: "exploration",
    title: "פרחים ורכבת Norokko", activities: "רכבת Norokko, Farm Tomita (שיא הלבנדר), Blue Pond, Ningle Terrace בערב",
    weather: { tempMin: 16, tempMax: 25, conditions: "בהיר" },
  },
  {
    id: "day-11", tripId: "japan-2026", baseId: "base-toya", hotelId: "hotel-toya", date: "2026-07-30", dayNumber: 11, tag: "travel",
    title: "מעבר לאגם טויה", activities: "נסיעה דרומה, עצירה ב-Niseko Milk Kobo, אונסן, בערב זיקוקים",
    weather: { tempMin: 18, tempMax: 26, conditions: "בהיר" },
    timeline: [
      { time: "10:00", title: "יציאה מטומאמו", subtitle: "נסיעה ~2.5 שעות", kind: "transport" },
      { time: "12:30", title: "Niseko Milk Kobo", subtitle: "גלידה טרייה בדרך", kind: "food" },
      { time: "15:00", title: "צ'ק-אין + אונסן", subtitle: "Toya Sun Palace", kind: "hotel" },
      { time: "20:45", title: "זיקוקים באגם טויה", subtitle: "כל ערב מהמלון", kind: "activity" },
    ],
  },
  {
    id: "day-12", tripId: "japan-2026", baseId: "base-toya", hotelId: "hotel-toya", date: "2026-07-31", dayNumber: 12, tag: "exploration",
    title: "פעילויות אגם טויה", activities: "שייט באגם, Noboribetsu Bear Park, עוד זיקוקים בערב",
    weather: { tempMin: 19, tempMax: 27, conditions: "בהיר" },
  },
  {
    id: "day-13", tripId: "japan-2026", baseId: "base-poroto", hotelId: "hotel-poroto", date: "2026-08-01", dayNumber: 13, tag: "travel",
    title: "מעבר ל-KAI Poroto", activities: "נסיעה קצרה, אונסן, ארכיטקטורת איינו, ארוחת kaiseki",
    weather: { tempMin: 19, tempMax: 26, conditions: "מעונן חלקית" },
  },
  {
    id: "day-14", tripId: "japan-2026", baseId: "base-poroto", hotelId: "hotel-poroto", date: "2026-08-02", dayNumber: 14, tag: "rest",
    title: "KAI Poroto + מוזיאון איינו", activities: "מוזיאון Upopoy, אונסן ומנוחה, kaiseki אחרון",
    weather: { tempMin: 20, tempMax: 27, conditions: "בהיר" },
  },
  {
    id: "day-15", tripId: "japan-2026", baseId: "base-tokyo-2", hotelId: "hotel-mimaru", date: "2026-08-03", dayNumber: 15, tag: "travel",
    title: "חזרה לטוקיו", activities: "החזרת רכב ב-CTS, טיסה CTS → HND, צ'ק-אין Mimaru, מנוחה",
    weather: { tempMin: 27, tempMax: 34, conditions: "חם ולח" },
    timeline: [
      { time: "09:00", title: "יציאה מהמלון", subtitle: "נסיעה ~50 דקות ל-CTS", kind: "transport" },
      { time: "11:30", title: "טיסה CTS → HND", subtitle: "ANA / JAL", kind: "flight" },
      { time: "15:00", title: "צ'ק-אין במלון", subtitle: "Mimaru Tokyo", kind: "hotel" },
    ],
  },
  {
    id: "day-16", tripId: "japan-2026", baseId: "base-tokyo-2", hotelId: "hotel-mimaru", date: "2026-08-04", dayNumber: 16, tag: "exploration",
    title: "קניות בטוקיו", activities: "אקיהברה / הראג'וקו / גינזה",
    weather: { tempMin: 27, tempMax: 35, conditions: "בהיר" },
  },
  {
    id: "day-17", tripId: "japan-2026", baseId: "base-tokyo-2", hotelId: "hotel-mimaru", date: "2026-08-05", dayNumber: 17, tag: "exploration",
    title: "יום אחרון בטוקיו", activities: "אטרקציה אחרונה, ארוחה מסכמת, אריזה",
    weather: { tempMin: 28, tempMax: 35, conditions: "חם ולח" },
  },
  {
    id: "day-18", tripId: "japan-2026", date: "2026-08-06", dayNumber: 18, tag: "departure",
    title: "טיסה הביתה", activities: "אריזה אחרונה, נסיעה ל-NRT, טיסה 15:35",
    timeline: [
      { time: "15:35", title: "טיסה NRT → TLV", subtitle: "אל על LY92", kind: "flight" },
      { time: "22:20", title: "נחיתה בתל אביב", subtitle: "סוף הטיול", kind: "flight" },
    ],
  },
];

// Expenses (Japan) - mostly pre-trip bookings. amountIls precomputed (¥ x ~0.024).
const expenses: Expense[] = [
  { id: "exp-1", tripId: "japan-2026", category: "transport", amount: 28500, currency: "ILS", amountIls: 28500, description: "טיסות בינלאומיות אל על", expenseDate: "2026-05-20", paidBy: "u-roy" },
  { id: "exp-2", tripId: "japan-2026", category: "accommodation", amount: 35000, currency: "JPY", amountIls: 840, description: "מקדמה OMO3 Sapporo", expenseDate: "2026-06-01", paidBy: "u-roy", location: "סאפורו" },
  { id: "exp-3", tripId: "japan-2026", category: "attraction", amount: 13800, currency: "JPY", amountIls: 331, description: "כרטיסים TeamLab Planets", expenseDate: "2026-06-05", paidBy: "u-leahy", location: "טוקיו" },
  { id: "exp-4", tripId: "japan-2026", category: "other", amount: 1200, currency: "ILS", amountIls: 1200, description: "ביטוח נסיעות משפחתי", expenseDate: "2026-06-03", paidBy: "u-roy" },
  { id: "exp-5", tripId: "japan-2026", category: "shopping", amount: 90, currency: "ILS", amountIls: 90, description: "מתאמי חשמל יפניים", expenseDate: "2026-06-06", paidBy: "u-leahy" },
];

// Packing list (Japan) - family trip, Hokkaido layers + Tokyo heat + 3 kids.
const packingItems: PackingItem[] = [
  { id: "pk-1", tripId: "japan-2026", category: "clothing", name: "שכבות חמות להוקאידו (15-17°)", packed: false },
  { id: "pk-2", tripId: "japan-2026", category: "clothing", name: "בגדים קלים לטוקיו (32°+)", packed: false },
  { id: "pk-3", tripId: "japan-2026", category: "clothing", name: "מעיל גשם / מטרייה (עונת טייפונים)", packed: false },
  { id: "pk-4", tripId: "japan-2026", category: "clothing", name: "נעלי הליכה נוחות לכולם", packed: true },
  { id: "pk-5", tripId: "japan-2026", category: "clothing", name: "כובעים והגנה מהשמש", packed: false },
  { id: "pk-6", tripId: "japan-2026", category: "kids", name: "בגדים להחלפה לכל ילד", quantity: 3, packed: false },
  { id: "pk-7", tripId: "japan-2026", category: "kids", name: "צעצוע / חפץ מנחם", packed: true },
  { id: "pk-8", tripId: "japan-2026", category: "kids", name: "עגלה קלה / מנשא", packed: false },
  { id: "pk-9", tripId: "japan-2026", category: "kids", name: "אוזניות לילדים לטיסה", quantity: 3, packed: false },
  { id: "pk-10", tripId: "japan-2026", category: "kids", name: "חטיפים מוכרים מהבית", packed: false },
  { id: "pk-11", tripId: "japan-2026", category: "electronics", name: "מתאמי חשמל יפניים", quantity: 3, packed: true },
  { id: "pk-12", tripId: "japan-2026", category: "electronics", name: "מטען נייד (פאוורבנק)", packed: false },
  { id: "pk-13", tripId: "japan-2026", category: "electronics", name: "iPad מלא בסדרות בעברית", packed: false },
  { id: "pk-14", tripId: "japan-2026", category: "electronics", name: "מצלמה + כרטיס זיכרון", packed: false },
  { id: "pk-15", tripId: "japan-2026", category: "electronics", name: "כבלי טעינה", packed: true },
  { id: "pk-16", tripId: "japan-2026", category: "documents", name: "דרכונים (5)", packed: false },
  { id: "pk-17", tripId: "japan-2026", category: "documents", name: "רישיון נהיגה בינלאומי + תרגום", packed: false },
  { id: "pk-18", tripId: "japan-2026", category: "documents", name: "אישורי הזמנה (מודפסים)", packed: false },
  { id: "pk-19", tripId: "japan-2026", category: "documents", name: "פוליסת ביטוח", packed: false },
  { id: "pk-20", tripId: "japan-2026", category: "toiletries", name: "תרופות בסיס + מד חום", packed: false },
  { id: "pk-21", tripId: "japan-2026", category: "toiletries", name: "קרם הגנה", packed: true },
  { id: "pk-22", tripId: "japan-2026", category: "toiletries", name: "מטליות לחות", packed: false },
  { id: "pk-23", tripId: "japan-2026", category: "misc", name: "בקבוקי מים רב פעמיים", packed: false },
  { id: "pk-24", tripId: "japan-2026", category: "misc", name: "ספרים בעברית לזמן מנוחה", packed: false },
];

// Query API (swap these for Supabase queries later)
export function getTrips(): Trip[] {
  return trips;
}

export function getTrip(id: string): Trip | undefined {
  return trips.find((t) => t.id === id);
}

export function getBases(tripId: string): Base[] {
  return bases.filter((b) => b.tripId === tripId).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getHotels(tripId: string): Hotel[] {
  return hotels.filter((h) => h.tripId === tripId);
}

export function getFlights(tripId: string): Flight[] {
  return flights
    .filter((f) => f.tripId === tripId)
    .sort((a, b) => a.departureTime.localeCompare(b.departureTime));
}

export function getTasks(tripId: string): Task[] {
  return tasks
    .filter((t) => t.tripId === tripId)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export function getAttractions(tripId: string): Attraction[] {
  return attractions.filter((a) => a.tripId === tripId);
}

export function getDocuments(tripId: string): TripDocument[] {
  return documents.filter((d) => d.tripId === tripId);
}

export function getDailyPlan(tripId: string): DailyPlanEntry[] {
  return dailyPlan
    .filter((d) => d.tripId === tripId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getDay(tripId: string, date: string): DailyPlanEntry | undefined {
  return dailyPlan.find((d) => d.tripId === tripId && d.date === date);
}

export function getExpenses(tripId: string): Expense[] {
  return expenses
    .filter((e) => e.tripId === tripId)
    .sort((a, b) => b.expenseDate.localeCompare(a.expenseDate));
}

export function getPackingItems(tripId: string): PackingItem[] {
  return packingItems.filter((p) => p.tripId === tripId);
}
