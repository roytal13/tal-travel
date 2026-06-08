"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { taskCategoryLabel } from "@/lib/labels";
import { setTaskDone } from "@/lib/actions";
import { cn } from "@/lib/utils";
import type { Task, TaskCategory } from "@/lib/types";

const CATEGORY_ORDER: TaskCategory[] = [
  "urgent",
  "soon",
  "before_departure",
  "during_trip",
];

export function TasksScreen({ tasks: initial }: { tasks: Task[] }) {
  // Local toggle only (no persistence until Supabase is wired).
  const [done, setDone] = useState<Set<string>>(
    () => new Set(initial.filter((t) => t.status === "done").map((t) => t.id))
  );

  const toggle = (id: string) => {
    const willBeDone = !done.has(id);
    setDone((prev) => {
      const next = new Set(prev);
      willBeDone ? next.add(id) : next.delete(id);
      return next;
    });
    // Persist (optimistic; RLS scopes to the trip).
    void setTaskDone(id, willBeDone);
  };

  const total = initial.length;
  const completed = done.size;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    tasks: initial.filter((t) => t.category === category),
  })).filter((g) => g.tasks.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
      <h2 className="mb-4 text-2xl font-bold">משימות</h2>

      {/* Progress */}
      <Card className="mb-6 p-4">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">התקדמות</span>
          <span className="font-mono text-sm font-medium">
            {completed}/{total} · {pct}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </Card>

      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.category}>
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {taskCategoryLabel[group.category]} ({group.tasks.length})
            </h3>
            <Card className="divide-y divide-border">
              {group.tasks.map((task) => {
                const checked = done.has(task.id);
                return (
                  <button
                    key={task.id}
                    onClick={() => toggle(task.id)}
                    className="flex w-full items-center gap-3 p-3.5 text-start transition-colors hover:bg-secondary/50"
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                        checked
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border"
                      )}
                    >
                      {checked && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        checked && "text-muted-foreground line-through"
                      )}
                    >
                      {task.title}
                    </span>
                  </button>
                );
              })}
            </Card>
          </section>
        ))}
      </div>
    </div>
  );
}
