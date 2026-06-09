"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Bell, User } from "lucide-react";
import { TripCard } from "./trip-card";
import { cn } from "@/lib/utils";
import type { Base, Trip } from "@/lib/types";

export interface TripWithBases {
  trip: Trip;
  bases: Base[];
}

type Tab = "upcoming" | "past";

const PAST_STATUSES = new Set(["completed", "archived"]);

export function TripsScreen({
  items,
  today,
}: {
  items: TripWithBases[];
  today: string;
}) {
  const [tab, setTab] = useState<Tab>("upcoming");

  const upcoming = items.filter((i) => !PAST_STATUSES.has(i.trip.status));
  const past = items.filter((i) => PAST_STATUSES.has(i.trip.status));
  const visible = tab === "upcoming" ? upcoming : past;

  return (
    <div className="page-enter mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8">
      {/* Desktop top bar (replaces the side nav on this screen) */}
      <div className="mb-6 hidden items-center justify-between md:flex">
        <Link href="/trips" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground">
            ט
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Tal Travel</span>
        </Link>
        <Link
          href="/profile"
          aria-label="פרופיל"
          className="flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <User className="size-5" />
        </Link>
      </div>

      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">הטיולים שלי</h1>
        <div className="flex items-center gap-2">
          <button
            className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="התראות"
          >
            <Bell className="size-5" />
          </button>
          <button
            className="flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[var(--shadow-lavender)] transition-colors hover:bg-lavender-600"
          >
            <Plus className="size-5" />
            <span className="hidden sm:inline">טיול חדש</span>
          </button>
        </div>
      </header>

      <div className="mb-6 flex gap-2">
        <TabPill active={tab === "upcoming"} onClick={() => setTab("upcoming")}>
          קרובים ({upcoming.length})
        </TabPill>
        <TabPill active={tab === "past"} onClick={() => setTab("past")}>
          עבר ({past.length})
        </TabPill>
      </div>

      {visible.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(({ trip, bases }) => (
            <TripCard key={trip.id} trip={trip} bases={bases} today={today} />
          ))}
        </div>
      )}
    </div>
  );
}

function TabPill({
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
        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
      {tab === "upcoming" ? "אין טיולים קרובים עדיין" : "אין טיולים שהסתיימו"}
    </div>
  );
}
