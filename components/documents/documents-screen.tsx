"use client";

import { useRef, useState } from "react";
import { Plus, Camera, Upload, Info, Loader2, X, Download } from "lucide-react";
import { DocumentCard } from "./document-card";
import { Card } from "@/components/ui/card";
import { documentCategoryIcon } from "@/lib/doc-icons";
import { documentCategoryLabel } from "@/lib/labels";
import { createClient } from "@/lib/supabase/client";
import { addDocument, updateDocument, deleteDocument } from "@/lib/actions";
import { cn } from "@/lib/utils";
import type { DocumentCategory, TripDocument } from "@/lib/types";

// Display order for category sections.
const CATEGORY_ORDER: DocumentCategory[] = [
  "passport",
  "visa",
  "flight_ticket",
  "hotel_confirmation",
  "insurance",
  "license",
  "receipt",
  "other",
];

export function DocumentsScreen({
  tripId,
  documents,
  tripEndDate,
}: {
  tripId: string;
  documents: TripDocument[];
  tripEndDate: string;
}) {
  const [docs, setDocs] = useState<TripDocument[]>(documents);
  const [filter, setFilter] = useState<DocumentCategory | "all">("all");
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<TripDocument | null>(null);

  const openDoc = (doc: TripDocument) => {
    if (!doc.fileUrl) return;
    if (doc.mimeType?.startsWith("image/")) {
      setLightbox(doc);
    } else {
      window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  const removeDoc = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    if (editingId === id) setEditingId(null);
    void deleteDocument(id);
  };

  const saveEdit = (
    id: string,
    values: { category: DocumentCategory; title: string; expiryDate?: string }
  ) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, category: values.category, title: values.title, expiryDate: values.expiryDate }
          : d
      )
    );
    setEditingId(null);
    void updateDocument(id, {
      category: values.category,
      title: values.title,
      expiryDate: values.expiryDate ?? null,
    });
  };

  const cameraInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null, category: DocumentCategory) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    const supabase = createClient();
    for (const file of Array.from(files)) {
      const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
      const path = `${tripId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("trip-documents")
        .upload(path, file);
      if (upErr) {
        setError(upErr.message);
        continue;
      }
      const created = await addDocument(tripId, {
        category,
        title: file.name,
        filePath: path,
        mimeType: file.type,
        sizeBytes: file.size,
      });
      if (created) setDocs((prev) => [created, ...prev]);
    }
    setUploading(false);
    setShowUpload(false);
  };

  const presentCategories = CATEGORY_ORDER.filter((c) =>
    docs.some((d) => d.category === c)
  );
  const visibleCategories =
    filter === "all" ? presentCategories : presentCategories.filter((c) => c === filter);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">מסמכים</h2>
        <button
          onClick={() => setShowUpload((v) => !v)}
          className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-3.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-lavender)] transition-colors hover:bg-lavender-600"
        >
          <Plus className="size-4" />
          הוסף
        </button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={cameraInput}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files, "receipt")}
      />
      <input
        ref={fileInput}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files, "other")}
      />

      {showUpload && (
        <Card className="mb-5 space-y-3 p-4">
          {uploading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              מעלה...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => cameraInput.current?.click()}
                className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-5 text-center text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <Camera className="size-7 text-lavender-400" />
                <span className="text-sm font-medium">צילום קבלה</span>
              </button>
              <button
                onClick={() => fileInput.current?.click()}
                className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-5 text-center text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <Upload className="size-7 text-lavender-400" />
                <span className="text-sm font-medium">העלאת קובץ / PDF</span>
              </button>
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            הקבצים נשמרים מאובטח ב-Supabase Storage, נגישים רק לחברי הטיול. צילום קבלה נשמר בקטגוריית "קבלות".
          </p>
        </Card>
      )}

      {/* Filter pills */}
      <div className="mb-5 flex flex-wrap gap-2">
        <Pill active={filter === "all"} onClick={() => setFilter("all")}>
          הכל
        </Pill>
        {presentCategories.map((c) => (
          <Pill key={c} active={filter === c} onClick={() => setFilter(c)}>
            {documentCategoryLabel[c]}
          </Pill>
        ))}
      </div>

      <div className="space-y-6">
        {visibleCategories.map((category) => {
          const items = docs.filter((d) => d.category === category);
          const Icon = documentCategoryIcon[category];
          return (
            <section key={category}>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon className="size-4" />
                {documentCategoryLabel[category]} ({items.length})
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((doc) =>
                  editingId === doc.id ? (
                    <DocumentEditForm
                      key={doc.id}
                      doc={doc}
                      onSave={(v) => saveEdit(doc.id, v)}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <DocumentCard
                      key={doc.id}
                      doc={doc}
                      tripEndDate={tripEndDate}
                      onOpen={() => openDoc(doc)}
                      onEdit={() => setEditingId(doc.id)}
                      onDelete={() => removeDoc(doc.id)}
                    />
                  )
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Image lightbox */}
      {lightbox?.fileUrl && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <a
              href={lightbox.fileUrl}
              download={lightbox.title}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm text-white backdrop-blur transition-colors hover:bg-white/25"
            >
              <Download className="size-4" />
              הורדה
            </a>
            <button
              onClick={() => setLightbox(null)}
              aria-label="סגור"
              className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
            >
              <X className="size-5" />
            </button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.fileUrl}
            alt={lightbox.title}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function DocumentEditForm({
  doc,
  onSave,
  onCancel,
}: {
  doc: TripDocument;
  onSave: (v: { category: DocumentCategory; title: string; expiryDate?: string }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(doc.title);
  const [category, setCategory] = useState<DocumentCategory>(doc.category);
  const [expiry, setExpiry] = useState(doc.expiryDate ?? "");

  const save = () => {
    const t = title.trim();
    if (!t) return;
    onSave({ category, title: t, expiryDate: expiry || undefined });
  };

  return (
    <Card className="space-y-3 p-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="שם המסמך"
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="flex flex-wrap gap-1.5">
        {CATEGORY_ORDER.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              category === c
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {documentCategoryLabel[c]}
          </button>
        ))}
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted-foreground">
          תוקף (אופציונלי)
        </label>
        <input
          type="date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={save}
          className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-lavender-600"
        >
          שמירה
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
        >
          ביטול
        </button>
      </div>
    </Card>
  );
}
