"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { packingCategoryLabel } from "@/lib/labels";
import { setPacked, addPackingItem } from "@/lib/actions";
import type { PackingCategory, PackingItem } from "@/lib/types";

const CATEGORY_ORDER: PackingCategory[] = [
  "clothing",
  "kids",
  "electronics",
  "documents",
  "toiletries",
  "misc",
];

export function PackingScreen({
  tripId,
  initial,
}: {
  tripId: string;
  initial: PackingItem[];
}) {
  const [items, setItems] = useState<PackingItem[]>(initial);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<PackingCategory>("misc");

  const toggle = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const willBePacked = !item.packed;
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, packed: willBePacked } : it))
    );
    void setPacked(id, willBePacked);
  };

  const add = async () => {
    const name = newName.trim();
    if (!name) return;
    setNewName("");
    const created = await addPackingItem(tripId, newCategory, name);
    if (created) setItems((prev) => [...prev, created]);
  };

  const packed = items.filter((i) => i.packed).length;
  const total = items.length;
  const pct = total === 0 ? 0 : Math.round((packed / total) * 100);

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((i) => i.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <h2 className="mb-4 text-2xl font-bold">רשימת אריזה</h2>

      {/* Progress */}
      <Card className="mb-5 p-4">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">ארוז</span>
          <span className="font-mono text-sm font-medium">
            {packed}/{total} · {pct}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </Card>

      {/* Add item */}
      <div className="mb-5 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="הוסף פריט..."
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as PackingCategory)}
          className="shrink-0 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {CATEGORY_ORDER.map((c) => (
            <option key={c} value={c}>
              {packingCategoryLabel[c]}
            </option>
          ))}
        </select>
        <button
          onClick={add}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-lavender-600"
          aria-label="הוסף"
        >
          <Plus className="size-5" />
        </button>
      </div>

      <div className="space-y-6">
        {groups.map((group) => {
          const groupPacked = group.items.filter((i) => i.packed).length;
          return (
            <section key={group.category}>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {packingCategoryLabel[group.category]} ({groupPacked}/{group.items.length})
              </h3>
              <Card className="divide-y divide-border">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className="flex w-full items-center gap-3 p-3.5 text-start transition-colors hover:bg-secondary/50"
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                        item.packed
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border"
                      )}
                    >
                      {item.packed && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        item.packed && "text-muted-foreground line-through"
                      )}
                    >
                      {item.name}
                    </span>
                    {item.quantity && item.quantity > 1 && (
                      <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
                        x{item.quantity}
                      </span>
                    )}
                  </button>
                ))}
              </Card>
            </section>
          );
        })}
      </div>
    </div>
  );
}
