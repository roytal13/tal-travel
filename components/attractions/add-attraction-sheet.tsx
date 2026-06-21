"use client";

import { useState, useTransition } from "react";
import { X, Plus } from "lucide-react";
import { addAttraction } from "@/lib/actions";
import { attractionCategoryLabel, attractionPriorityLabel } from "@/lib/labels";
import type { AttractionCategory, AttractionPriority, Base } from "@/lib/types";

const CATEGORIES: AttractionCategory[] = ["nature", "culture", "food", "entertainment", "shopping"];
const PRIORITIES: AttractionPriority[] = ["must", "recommended", "optional"];

export function AddAttractionSheet({
  tripId,
  bases,
  onClose,
  onAdded,
}: {
  tripId: string;
  bases: Base[];
  onClose: () => void;
  onAdded: () => void;
}) {
  const [name, setName] = useState("");
  const [nameLocal, setNameLocal] = useState("");
  const [baseId, setBaseId] = useState(bases[0]?.id ?? "");
  const [category, setCategory] = useState<AttractionCategory | "">("");
  const [priority, setPriority] = useState<AttractionPriority | "">("");
  const [description, setDescription] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    startTransition(async () => {
      await addAttraction(tripId, {
        baseId: baseId || undefined,
        name: name.trim(),
        nameLocal: nameLocal.trim() || undefined,
        category: category || undefined,
        priority: priority || undefined,
        description: description.trim() || undefined,
      });
      onAdded();
    });
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-background shadow-xl">
        <div className="mx-auto max-w-2xl">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-border" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3">
            <h2 className="text-lg font-semibold">הוספת אטרקציה</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-5 pb-8">
            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium">שם האטרקציה *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="למשל: הר פוג'י"
                autoFocus
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Local name */}
            <div>
              <label className="mb-1 block text-sm font-medium">שם מקומי</label>
              <input
                type="text"
                value={nameLocal}
                onChange={(e) => setNameLocal(e.target.value)}
                placeholder="למשל: 富士山"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Base + Category row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">אזור</label>
                <select
                  value={baseId}
                  onChange={(e) => setBaseId(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">ללא אזור</option>
                  {bases.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">קטגוריה</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AttractionCategory | "")}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">בחר...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{attractionCategoryLabel[c]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">עדיפות</label>
              <div className="flex gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(priority === p ? "" : p)}
                    className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                      priority === p
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {attractionPriorityLabel[p]}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium">תיאור</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="כמה משפטים על האטרקציה..."
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending || !name.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Plus className="size-4" />
              {pending ? "מוסיף..." : "הוסף אטרקציה"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
