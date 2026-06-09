"use client";

import { useState } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { taskCategoryLabel } from "@/lib/labels";
import { setTaskDone, updateTask, deleteTask } from "@/lib/actions";
import { cn } from "@/lib/utils";
import type { Task, TaskCategory } from "@/lib/types";

const CATEGORY_ORDER: TaskCategory[] = [
  "urgent",
  "soon",
  "before_departure",
  "during_trip",
];

export function TasksScreen({ tasks: initial }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<TaskCategory>("soon");

  const toggle = (task: Task) => {
    const done = task.status !== "done";
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: done ? "done" : "open" } : t))
    );
    void setTaskDone(task.id, done);
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditCategory((task.category as TaskCategory) ?? "soon");
  };

  const saveEdit = () => {
    const title = editTitle.trim();
    if (!editingId || !title) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingId ? { ...t, title, category: editCategory } : t
      )
    );
    void updateTask(editingId, { title, category: editCategory });
    setEditingId(null);
  };

  const remove = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);
    void deleteTask(id);
  };

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    tasks: tasks.filter((t) => t.category === category),
  })).filter((g) => g.tasks.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
      <h2 className="mb-4 text-2xl font-bold">משימות</h2>

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
              {group.tasks.map((task) =>
                editingId === task.id ? (
                  <div key={task.id} className="space-y-3 p-3.5">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      autoFocus
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <div className="flex flex-wrap gap-2">
                      {CATEGORY_ORDER.map((c) => (
                        <button
                          key={c}
                          onClick={() => setEditCategory(c)}
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                            editCategory === c
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          )}
                        >
                          {taskCategoryLabel[c]}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-lavender-600"
                      >
                        שמירה
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
                      >
                        ביטול
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={task.id} className="group flex items-center gap-3 p-3.5">
                    <button
                      onClick={() => toggle(task)}
                      className="flex items-center gap-3 text-start"
                    >
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                          task.status === "done"
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border"
                        )}
                      >
                        {task.status === "done" && (
                          <Check className="size-3.5" strokeWidth={3} />
                        )}
                      </span>
                    </button>
                    <span
                      onClick={() => toggle(task)}
                      className={cn(
                        "flex-1 cursor-pointer text-sm",
                        task.status === "done" && "text-muted-foreground line-through"
                      )}
                    >
                      {task.title}
                    </span>
                    <button
                      onClick={() => startEdit(task)}
                      aria-label="עריכה"
                      className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => remove(task.id)}
                      aria-label="מחיקה"
                      className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )
              )}
            </Card>
          </section>
        ))}
      </div>
    </div>
  );
}
