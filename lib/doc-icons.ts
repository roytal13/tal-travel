import {
  Shield,
  Plane,
  Hotel,
  Stamp,
  HeartPulse,
  Car,
  Receipt,
  FileText,
  type LucideIcon,
} from "lucide-react";
import type { DocumentCategory } from "@/lib/types";

/** Icon per document category (shared by the documents module). */
export const documentCategoryIcon: Record<DocumentCategory, LucideIcon> = {
  passport: Shield,
  flight_ticket: Plane,
  hotel_confirmation: Hotel,
  visa: Stamp,
  insurance: HeartPulse,
  license: Car,
  receipt: Receipt,
  other: FileText,
};
