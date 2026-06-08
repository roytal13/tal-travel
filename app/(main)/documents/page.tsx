import { redirect } from "next/navigation";
import { FileText } from "lucide-react";
import { ComingSoon } from "@/components/app/coming-soon";
import { getTrips, getDocuments } from "@/lib/db";

/**
 * Global "Documents" tab. For now it opens the documents of the nearest
 * active or upcoming trip. A cross-trip document view can come later.
 */
export default async function DocumentsPage() {
  const trips = await getTrips();
  const candidate =
    trips.find((t) => t.status === "active") ??
    trips.find((t) => t.status === "upcoming") ??
    trips[0];

  if (candidate && (await getDocuments(candidate.id)).length > 0) {
    redirect(`/trips/${candidate.id}/documents`);
  }

  return (
    <ComingSoon
      icon={FileText}
      title="מסמכים"
      note="דרכונים, אישורי טיסה, אישורי מלון ועוד, נגישים גם offline"
    />
  );
}
