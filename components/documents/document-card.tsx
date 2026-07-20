import { AlertTriangle, Pencil, Trash2, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { documentCategoryIcon } from "@/lib/doc-icons";
import { formatMonthYear, formatFullDate, expiresWithin } from "@/lib/format";
import type { TripDocument } from "@/lib/types";

export function DocumentCard({
  doc,
  tripEndDate,
  onOpen,
  onEdit,
  onDelete,
}: {
  doc: TripDocument;
  tripEndDate: string;
  onOpen?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const Icon = documentCategoryIcon[doc.category];
  const isImage = doc.mimeType?.startsWith("image/");
  const canOpen = Boolean(onOpen && doc.fileUrl);
  // Passport rule of thumb: flag if valid for less than ~12 months past return.
  const expiringSoon =
    doc.expiryDate && expiresWithin(doc.expiryDate, tripEndDate, 12);

  return (
    <Card className="flex items-center gap-3 p-4">
      <button
        onClick={onOpen}
        disabled={!canOpen}
        className="flex min-w-0 flex-1 items-center gap-3 text-start disabled:cursor-default"
      >
        {isImage && doc.fileUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={doc.fileUrl}
            alt={doc.title}
            className="size-14 shrink-0 rounded-lg object-cover"
          />
        ) : doc.mimeType === "application/pdf" && doc.fileUrl ? (
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
            <iframe
              src={`${doc.fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=fitH`}
              title={doc.title}
              className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50 border-0"
              tabIndex={-1}
            />
          </div>
        ) : (
          <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#e0e7ff] text-[#6366f1]">
            <Icon className="size-6" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 truncate font-medium">
            {doc.title}
            {canOpen && <Eye className="size-3.5 shrink-0 text-muted-foreground" />}
          </p>
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
      </button>

      {(onEdit || onDelete) && (
        <div className="flex shrink-0 items-center">
          {onEdit && (
            <button
              onClick={onEdit}
              aria-label="עריכה"
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Pencil className="size-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              aria-label="מחיקה"
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
