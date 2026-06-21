"use client";

import { useState, useTransition } from "react";
import { MapPin, Navigation, Pencil, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  attractionCategoryLabel,
  attractionPriorityLabel,
  attractionPriorityVariant,
  attractionStatusLabel,
  attractionStatusVariant,
} from "@/lib/labels";
import { mapsDirectionsUrl } from "@/lib/maps";
import { updateAttractionDescription } from "@/lib/actions";
import type { Attraction, Base } from "@/lib/types";

export function AttractionCard({
  attraction,
  base,
  countryName,
}: {
  attraction: Attraction;
  base?: Base;
  countryName?: string;
}) {
  const navUrl = mapsDirectionsUrl([attraction.name, base?.name, countryName]);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(attraction.description ?? "");
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      await updateAttractionDescription(attraction.id, attraction.tripId, text);
      setEditing(false);
    });
  }

  function cancel() {
    setText(attraction.description ?? "");
    setEditing(false);
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold">{attraction.name}</h3>
            {attraction.nameLocal && (
              <span className="text-xs text-muted-foreground">{attraction.nameLocal}</span>
            )}
          </div>
          {base && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {base.name}
            </span>
          )}
        </div>
        {attraction.priority && (
          <Badge variant={attractionPriorityVariant[attraction.priority]} className="shrink-0">
            {attractionPriorityLabel[attraction.priority]}
          </Badge>
        )}
      </div>

      {/* Description */}
      <div className="mt-2">
        {editing ? (
          <div className="space-y-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
              rows={3}
              placeholder="כמה משפטים על האטרקציה..."
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end gap-2">
              <button onClick={cancel} disabled={pending}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary transition-colors">
                <X className="size-3.5" />ביטול
              </button>
              <button onClick={save} disabled={pending}
                className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity">
                <Check className="size-3.5" />{pending ? "שומר..." : "שמירה"}
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setEditing(true)}
            className="group flex cursor-pointer items-start gap-1.5 rounded-lg p-1 -mx-1 hover:bg-secondary/60 transition-colors"
          >
            {text ? (
              <p className="flex-1 text-sm text-muted-foreground leading-relaxed">{text}</p>
            ) : (
              <p className="flex-1 text-sm text-muted-foreground/50 italic">הוסף תיאור...</p>
            )}
            <Pencil className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-colors" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant={attractionStatusVariant[attraction.status]}>
            {attractionStatusLabel[attraction.status]}
          </Badge>
          {attraction.category && (
            <span className="text-xs text-muted-foreground">
              {attractionCategoryLabel[attraction.category]}
            </span>
          )}
        </div>
        <a
          href={navUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <Navigation className="size-4" />
          ניווט
        </a>
      </div>
    </Card>
  );
}
