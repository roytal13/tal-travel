"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Pencil,
  X,
  Check,
  Navigation,
  Hotel as HotelIcon,
  Plane,
  Car,
  Camera,
  Utensils,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Plus,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeatherInline } from "@/components/weather/weather-inline";
import { formatHebrewDate } from "@/lib/format";
import { dayTagLabel, dayTagVariant } from "@/lib/labels";
import { mapsDirectionsUrl } from "@/lib/maps";
import { updateDay } from "@/lib/actions";
import { cn } from "@/lib/utils";
import type { Base, DailyPlanEntry, DailyPlanTag, Hotel, TimelineItem } from "@/lib/types";

type ItemKind = TimelineItem["kind"];

const KIND_META: { value: ItemKind; label: string; Icon: LucideIcon }[] = [
  { value: "activity", label: "פעילות", Icon: Camera },
  { value: "food",     label: "אוכל",   Icon: Utensils },
  { value: "transport",label: "תחבורה", Icon: Car },
  { value: "hotel",    label: "מלון",   Icon: HotelIcon },
  { value: "flight",   label: "טיסה",   Icon: Plane },
  { value: "document", label: "מסמך",   Icon: FileText },
];

const KIND_ICON: Record<ItemKind, LucideIcon> = Object.fromEntries(
  KIND_META.map(({ value, Icon }) => [value, Icon])
) as Record<ItemKind, LucideIcon>;

const TAGS: { value: DailyPlanTag | ""; label: string }[] = [
  { value: "",           label: "ללא תגית" },
  { value: "arrival",    label: "הגעה" },
  { value: "travel",     label: "מעבר" },
  { value: "exploration",label: "חקירה" },
  { value: "rest",       label: "מנוחה" },
  { value: "departure",  label: "יציאה" },
];

function emptyItem(): TimelineItem {
  return { kind: "activity", time: "", title: "", subtitle: "" };
}

export function DayDetailScreen({
  tripId,
  day,
  base,
  hotel,
  totalDays,
  prevDate,
  nextDate,
}: {
  tripId: string;
  day: DailyPlanEntry;
  base?: Base;
  hotel?: Hotel;
  totalDays: number;
  prevDate?: string;
  nextDate?: string;
}) {
  const [editing, setEditing]       = useState(false);
  const [title, setTitle]           = useState(day.title ?? "");
  const [activities, setActivities] = useState(day.activities ?? "");
  const [notes, setNotes]           = useState(day.notes ?? "");
  const [tag, setTag]               = useState<DailyPlanTag | "">(day.tag ?? "");
  const [items, setItems]           = useState<TimelineItem[]>(day.timeline ?? []);
  const [pending, startTransition]  = useTransition();
  const router = useRouter();

  const mapsUrl = hotel
    ? mapsDirectionsUrl([hotel.name, hotel.location])
    : undefined;

  function handleSave() {
    const cleanItems = items
      .filter((it) => it.title.trim())
      .map((it) => ({ ...it, subtitle: it.subtitle || undefined, time: it.time || undefined }));
    startTransition(async () => {
      await updateDay(day.id, day.tripId, { title, activities, notes, tag, timeline: cleanItems });
      setEditing(false);
      router.refresh();
    });
  }

  function handleCancel() {
    setTitle(day.title ?? "");
    setActivities(day.activities ?? "");
    setNotes(day.notes ?? "");
    setTag(day.tag ?? "");
    setItems(day.timeline ?? []);
    setEditing(false);
  }

  function updateItem(i: number, patch: Partial<TimelineItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function moveItem(i: number, dir: -1 | 1) {
    const j = i + dir;
    setItems((prev) => {
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  const displayTimeline = day.timeline ?? [];

  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-lavender-700 via-lavender-500 to-lavender-300 md:h-64">
        {hotel?.coverImageUrl && (
          <Image src={hotel.coverImageUrl} alt={base?.name ?? ""} fill className="object-cover opacity-70" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-4">
          <Link
            href={`/trips/${tripId}/plan`}
            className="flex items-center gap-1 rounded-full bg-black/30 px-3 py-1.5 text-sm text-white backdrop-blur-sm"
          >
            <ArrowRight className="size-4" />
            לוח זמנים
          </Link>
          <button
            onClick={() => setEditing((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm backdrop-blur-sm transition-colors",
              editing ? "bg-white text-black" : "bg-black/30 text-white hover:bg-black/50"
            )}
          >
            <Pencil className="size-3.5" />
            עריכה
          </button>
        </div>

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
          <div className="flex items-end gap-3">
            <span className="font-mono text-5xl font-bold text-white leading-none">{day.dayNumber}</span>
            <div className="mb-1 text-white/70 text-xs leading-tight">
              <div>יום</div>
              <div>מתוך {totalDays}</div>
            </div>
            <div className="mb-1 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-white font-semibold">{formatHebrewDate(day.date)}</span>
                {base && (
                  <span className="text-white/80 text-sm">
                    · {base.name}
                    {base.nameLocal && <span className="ms-1 opacity-70">{base.nameLocal}</span>}
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {day.tag && <Badge variant={dayTagVariant[day.tag]}>{dayTagLabel[day.tag]}</Badge>}
                {day.weather && <WeatherInline weather={day.weather} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2 text-sm">
        {prevDate ? (
          <Link href={`/trips/${tripId}/plan/${prevDate}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="size-4" />יום קודם
          </Link>
        ) : <span />}
        {nextDate ? (
          <Link href={`/trips/${tripId}/plan/${nextDate}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            יום הבא<ChevronLeft className="size-4" />
          </Link>
        ) : <span />}
      </div>

      {/* Body */}
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-5 md:px-8">

        {/* ── Edit form ── */}
        {editing && (
          <div className="space-y-4 rounded-xl border border-primary/30 bg-secondary/40 p-4">

            {/* Tag */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">תגית</label>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((t) => (
                  <button key={t.value} type="button" onClick={() => setTag(t.value)}
                    className={cn("rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      tag === t.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">כותרת</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="כותרת היום..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            {/* Timeline items */}
            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">פריטי לוח הזמנים</label>
              <div className="space-y-2">
                {items.map((item, i) => {
                  const meta = KIND_META.find((m) => m.value === item.kind)!;
                  return (
                    <div key={i} className="rounded-lg border border-border bg-background p-3 space-y-2">
                      {/* Row 1: kind + reorder */}
                      <div className="flex items-center gap-2">
                        <div className="flex shrink-0 flex-col">
                          <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0}
                            className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors">
                            <ChevronUp className="size-3.5" />
                          </button>
                          <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1}
                            className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors">
                            <ChevronDown className="size-3.5" />
                          </button>
                        </div>
                        {/* Kind selector */}
                        <div className="flex flex-wrap gap-1">
                          {KIND_META.map(({ value, label, Icon }) => (
                            <button key={value} type="button"
                              onClick={() => updateItem(i, { kind: value })}
                              title={label}
                              className={cn(
                                "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors",
                                item.kind === value
                                  ? "bg-lavender-100 text-lavender-700 font-medium"
                                  : "text-muted-foreground hover:text-foreground"
                              )}>
                              <Icon className="size-3" />{label}
                            </button>
                          ))}
                        </div>
                        <button onClick={() => removeItem(i)} type="button"
                          className="ms-auto shrink-0 rounded p-1 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      {/* Row 2: time + title */}
                      <div className="flex gap-2">
                        <input value={item.time ?? ""} onChange={(e) => updateItem(i, { time: e.target.value })}
                          placeholder="08:00" maxLength={5}
                          className="w-16 shrink-0 rounded-lg border border-border bg-secondary px-2 py-1.5 text-center font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                        <input value={item.title} onChange={(e) => updateItem(i, { title: e.target.value })}
                          placeholder="כותרת פריט..." autoFocus={item.title === ""}
                          className="flex-1 rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      {/* Row 3: subtitle */}
                      <input value={item.subtitle ?? ""} onChange={(e) => updateItem(i, { subtitle: e.target.value })}
                        placeholder="פרטים נוספים (אופציונלי)..."
                        className="w-full rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  );
                })}

                <button type="button"
                  onClick={() => setItems((prev) => [...prev, emptyItem()])}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-primary/40 py-2.5 text-sm text-primary hover:bg-primary/5 transition-colors">
                  <Plus className="size-4" />הוסף פריט
                </button>
              </div>
            </div>

            {/* Activities (free text, shown only if no timeline items) */}
            {items.length === 0 && (
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">פעילויות (טקסט חופשי)</label>
                <textarea value={activities} onChange={(e) => setActivities(e.target.value)}
                  placeholder="מה מתוכנן היום..." rows={3}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">הערות</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="הערות נוספות..." rows={2}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={handleCancel} disabled={pending}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors">
                <X className="size-4" />ביטול
              </button>
              <button onClick={handleSave} disabled={pending}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity">
                <Check className="size-4" />{pending ? "שומר..." : "שמירה"}
              </button>
            </div>
          </div>
        )}

        {/* ── View mode ── */}
        {day.title && <h2 className="text-2xl font-bold">{day.title}</h2>}

        {/* Hotel card */}
        {hotel && (
          <Card className="flex items-center gap-3 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lavender-100 text-lavender-700">
              <HotelIcon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">לינה</p>
              <p className="truncate font-semibold">{hotel.name}</p>
              {hotel.location && <p className="truncate text-xs text-muted-foreground">{hotel.location}</p>}
            </div>
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                <Navigation className="size-3.5" />נווט
              </a>
            )}
          </Card>
        )}

        {/* Timeline */}
        {displayTimeline.length > 0 ? (
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">תוכנית היום</h3>
            <ol className="relative space-y-1">
              {displayTimeline.map((item, i) => {
                const Icon = KIND_ICON[item.kind];
                return (
                  <li key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="w-14 pt-1.5 text-end font-mono text-xs text-muted-foreground">{item.time}</span>
                    </div>
                    <div className="relative flex flex-col items-center">
                      <span className="mt-1 flex size-8 items-center justify-center rounded-full bg-lavender-100 text-lavender-700">
                        <Icon className="size-4" />
                      </span>
                      {i < displayTimeline.length - 1 && <span className="my-1 w-px flex-1 bg-border" />}
                    </div>
                    <Card className="mb-2 flex-1 p-3">
                      <p className="font-medium">{item.title}</p>
                      {item.subtitle && <p className="text-sm text-muted-foreground">{item.subtitle}</p>}
                    </Card>
                  </li>
                );
              })}
            </ol>
          </section>
        ) : day.activities ? (
          <Card className="p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">פעילויות</h3>
            <p className="whitespace-pre-line text-sm leading-relaxed">{day.activities}</p>
          </Card>
        ) : !editing ? (
          <Card className="py-10 text-center text-muted-foreground">
            <p className="text-sm">אין תוכן ליום הזה עדיין</p>
            <p className="mt-1 text-xs">לחץ על "עריכה" בראש הדף</p>
          </Card>
        ) : null}

        {/* Notes */}
        {day.notes && !editing && (
          <Card className="border-dashed p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">הערות</h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{day.notes}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
