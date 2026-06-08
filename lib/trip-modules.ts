import {
  LayoutGrid,
  Sun,
  CalendarDays,
  Hotel,
  Plane,
  Camera,
  CheckCircle,
  FileText,
  Languages,
  Coins,
  Wallet,
  Luggage,
  CloudSun,
  type LucideIcon,
} from "lucide-react";
import type { ModuleKey } from "@/lib/types";

/**
 * Central registry of trip modules. Both the tab strip and the module menu
 * read from this, so adding a module is a single entry here plus its page.
 * `overview` is the special always-present landing module.
 */
export interface TripModuleDef {
  key: ModuleKey | "overview";
  label: string;
  segment: string; // "" for the overview
  icon: LucideIcon;
  /** Shown in the compact tab strip. The rest live in the "more" menu. */
  primary?: boolean;
}

export const TRIP_MODULES: TripModuleDef[] = [
  { key: "overview", label: "סקירה", segment: "", icon: LayoutGrid, primary: true },
  { key: "today", label: "היום", segment: "today", icon: Sun, primary: true },
  { key: "daily_plan", label: "לוח זמנים", segment: "plan", icon: CalendarDays, primary: true },
  { key: "hotels", label: "מלונות", segment: "hotels", icon: Hotel, primary: true },
  { key: "flights", label: "טיסות", segment: "flights", icon: Plane, primary: true },
  { key: "attractions", label: "אטרקציות", segment: "attractions", icon: Camera },
  { key: "tasks", label: "משימות", segment: "tasks", icon: CheckCircle },
  { key: "documents", label: "מסמכים", segment: "documents", icon: FileText },
  { key: "expenses", label: "הוצאות", segment: "expenses", icon: Wallet },
  { key: "packing", label: "אריזה", segment: "packing", icon: Luggage },
  { key: "weather", label: "מזג אוויר", segment: "weather", icon: CloudSun },
  { key: "phrasebook", label: "מילון", segment: "phrasebook", icon: Languages },
  { key: "currency", label: "ממיר מטבע", segment: "currency", icon: Coins },
];

/** Modules enabled for a trip (overview is always included), in registry order. */
export function tripModulesFor(enabled: ModuleKey[]): TripModuleDef[] {
  return TRIP_MODULES.filter(
    (m) => m.key === "overview" || enabled.includes(m.key as ModuleKey)
  );
}
