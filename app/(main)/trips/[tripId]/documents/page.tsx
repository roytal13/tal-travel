import { notFound } from "next/navigation";
import { DocumentsScreen } from "@/components/documents/documents-screen";
import { getTrip, getDocuments } from "@/lib/db";

export default async function TripDocumentsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const documents = await getDocuments(tripId);

  return (
    <div className="page-enter">
      <DocumentsScreen tripId={tripId} documents={documents} tripEndDate={trip.endDate} />
    </div>
  );
}
