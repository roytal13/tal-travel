import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { documentCategoryIcon } from "@/lib/doc-icons";
import { formatMonthYear, formatFullDate, expiresWithin } from "@/lib/format";
import type { TripDocument } from "@/lib/types";

export function DocumentCard({
  doc,
  tripEndDate,
}: {
  doc: TripDocument;
  tripEndDate: string;
}) {
  const Icon = documentCategoryIcon[doc.category];
  // Passport rule of thumb: flag if valid for less than ~12 months past return.
  const expiringSoon =
    doc.expiryDate && expiresWithin(doc.expiryDate, tripEndDate, 12);

  return (
    <Card className="flex items-center gap-3 p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e0e7ff] text-[#6366f1]">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{doc.title}</p>
        {doc.expiryDate && (
          <p
            className={`flex items-center gap-1 text-sm ${
              expiringSoon ? "text-amber-600" : "text-muted-foreground"
            }`}
          >
            בתוקף עד {formatMonthYear(doc.expiryDate)}
            {expiringSoon && <AlertTriangle className="size-3.5" />}
          </p>
        )}
        {doc.createdAt && (
          <p className="text-xs text-muted-foreground">
            הועלה: {formatFullDate(doc.createdAt)}
          </p>
        )}
      </div>
    </Card>
  );
}
