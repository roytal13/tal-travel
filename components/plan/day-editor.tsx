"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateDay } from "@/lib/actions";
import { dayTagLabel } from "@/lib/labels";
import type { DailyPlanEntry } from "@/lib/types";
import type { DailyPlanTag } from "@/lib/types";

const TAGS: { value: DailyPlanTag | ""; label: string }[] = [
  { value: "", label: "ללא תגית" },
  { value: "arrival", label: "הגעה" },
  { value: "travel", label: "מעבר" },
  { value: "exploration", label: "חקירה" },
  { value: "rest", label: "מנוחה" },
  { value: "departure", label: "יציאה" },
];

export function DayEditor({ day }: { day: DailyPlanEntry }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(day.title ?? "");
  const [activities, setActivities] = useState(day.activities ?? "");
  const [notes, setNotes] = useState(day.notes ?? "");
  const [tag, setTag] = useState<DailyPlanTag | "">(day.tag ?? "");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSave() {
    startTransition(async () => {
      await updateDay(day.id, day.tripId, { title, activities, notes, tag });
      setEditing(false);
      router.refresh();
    });
  }

  function handleCancel() {
    setTitle(day.title ?? "");
    setActivities(day.activities ?? "");
    setNotes(day.notes ?? "");
    setTag(day.tag ?? "");
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Pencil className="size-3.5" />
        עריכה
      </button>
    );
  }

  return (
    <div className="mt-4 space-y-3 rounded-xl border border-border bg-secondary/30 p-4">
      {/* Tag */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">תגית</label>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTag(t.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                tag === t.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">כותרת</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="כותרת היום..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Activities */}
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">פעילויות</label>
        <textarea
          value={activities}
          onChange={(e) => setActivities(e.target.value)}
          placeholder="מה מתוכנן היום..."
          rows={4}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">הערות</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="הערות נוספות..."
          rows={2}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleCancel}
          disabled={pending}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary"
        >
          <X className="size-4" />
          ביטול
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Check className="size-4" />
          {pending ? "שומר..." : "שמירה"}
        </button>
      </div>
    </div>
  );
}
