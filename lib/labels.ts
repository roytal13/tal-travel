/**
 * Hebrew labels and badge variants for the various status enums.
 * Centralized so the same status reads the same everywhere.
 */

import type { BadgeProps } from "@/components/ui/badge";
import type {
  AttractionCategory,
  AttractionPriority,
  AttractionStatus,
  DailyPlanTag,
  DocumentCategory,
  ExpenseCategory,
  FlightStatus,
  PackingCategory,
  HotelStatus,
  TaskCategory,
  TaskStatus,
  TripStatus,
} from "@/lib/types";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

export const tripStatusLabel: Record<TripStatus, string> = {
  planning: "בתכנון",
  upcoming: "קרוב",
  active: "בטיול עכשיו",
  completed: "הסתיים",
  archived: "בארכיון",
};

export const tripStatusVariant: Record<TripStatus, BadgeVariant> = {
  planning: "warning",
  upcoming: "default",
  active: "success",
  completed: "neutral",
  archived: "neutral",
};

export const hotelStatusLabel: Record<HotelStatus, string> = {
  researching: "לחקור",
  deciding: "להחליט",
  to_book: "להזמין",
  booked: "הוזמן",
  paid: "שולם",
  cancelled: "בוטל",
};

export const hotelStatusVariant: Record<HotelStatus, BadgeVariant> = {
  researching: "neutral",
  deciding: "warning",
  to_book: "warning",
  booked: "info",
  paid: "success",
  cancelled: "error",
};

export const flightStatusLabel: Record<FlightStatus, string> = {
  researching: "לחקור",
  booked: "הוזמן",
  checked_in: "צ'ק-אין בוצע",
  completed: "הושלם",
  cancelled: "בוטל",
};

export const flightStatusVariant: Record<FlightStatus, BadgeVariant> = {
  researching: "warning",
  booked: "info",
  checked_in: "success",
  completed: "neutral",
  cancelled: "error",
};

export const taskCategoryLabel: Record<TaskCategory, string> = {
  urgent: "דחוף",
  soon: "בקרוב",
  before_departure: "לפני יציאה",
  during_trip: "בטיול",
};

export const dayTagLabel: Record<DailyPlanTag, string> = {
  arrival: "הגעה",
  travel: "מעבר",
  exploration: "חקירה",
  rest: "מנוחה",
  departure: "יציאה",
};

export const dayTagVariant: Record<DailyPlanTag, BadgeVariant> = {
  arrival: "success",
  travel: "info",
  exploration: "default",
  rest: "neutral",
  departure: "warning",
};

export const taskStatusLabel: Record<TaskStatus, string> = {
  open: "פתוח",
  in_progress: "בתהליך",
  done: "בוצע",
  cancelled: "בוטל",
};

export const documentCategoryLabel: Record<DocumentCategory, string> = {
  passport: "דרכונים",
  flight_ticket: "אישורי טיסה",
  hotel_confirmation: "אישורי מלון",
  visa: "ויזות",
  insurance: "ביטוח",
  license: "רישיון נהיגה",
  receipt: "קבלות",
  other: "אחר",
};

export const attractionCategoryLabel: Record<AttractionCategory, string> = {
  nature: "טבע",
  culture: "תרבות",
  food: "אוכל",
  entertainment: "בידור",
  shopping: "קניות",
};

export const attractionPriorityLabel: Record<AttractionPriority, string> = {
  must: "חובה",
  recommended: "מומלץ",
  optional: "אופציונלי",
};

export const attractionPriorityVariant: Record<AttractionPriority, BadgeVariant> = {
  must: "error",
  recommended: "warning",
  optional: "neutral",
};

export const attractionStatusLabel: Record<AttractionStatus, string> = {
  suggested: "מוצע",
  selected: "נבחר",
  scheduled: "נקבע",
  visited: "ביקרנו",
  skipped: "דילגנו",
};

export const attractionStatusVariant: Record<AttractionStatus, BadgeVariant> = {
  suggested: "neutral",
  selected: "info",
  scheduled: "default",
  visited: "success",
  skipped: "neutral",
};

export const expenseCategoryLabel: Record<ExpenseCategory, string> = {
  food: "אוכל",
  transport: "תחבורה",
  accommodation: "לינה",
  attraction: "אטרקציות",
  shopping: "קניות",
  other: "אחר",
};

/** Hex color per expense category (for breakdown bars). */
export const expenseCategoryColor: Record<ExpenseCategory, string> = {
  food: "#ef4444",
  transport: "#14b8a6",
  accommodation: "#8b6fb8",
  attraction: "#f59e0b",
  shopping: "#3b82f6",
  other: "#78716c",
};

export const packingCategoryLabel: Record<PackingCategory, string> = {
  clothing: "בגדים",
  kids: "ילדים",
  electronics: "אלקטרוניקה",
  documents: "מסמכים",
  toiletries: "טואלטיקה",
  misc: "שונות",
};
