import { Briefcase, Sun, FileText, User, type LucideIcon } from "lucide-react";

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Bottom tab bar (mobile) and sidebar (desktop) share these 4 destinations. */
export const NAV_ITEMS: NavItem[] = [
  { key: "trips", label: "טיולים", href: "/trips", icon: Briefcase },
  { key: "today", label: "היום", href: "/today", icon: Sun },
  { key: "documents", label: "מסמכים", href: "/documents", icon: FileText },
  { key: "profile", label: "פרופיל", href: "/profile", icon: User },
];
