"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatFullDate } from "@/lib/format";
import { expenseCategoryLabel, expenseCategoryColor } from "@/lib/labels";
import { addExpense, updateExpense, deleteExpense } from "@/lib/actions";
import type { CurrencyConfig } from "@/lib/destinations";
import type { Expense, ExpenseCategory } from "@/lib/types";

const CATEGORIES: ExpenseCategory[] = [
  "food",
  "transport",
  "accommodation",
  "attraction",
  "shopping",
  "other",
];

const ils = (n: number) => `₪${Math.round(n).toLocaleString("he-IL")}`;

interface ExpenseValues {
  category: ExpenseCategory;
  amount: number;
  currency: string;
  amountIls: number;
  description?: string;
}

export function ExpensesScreen({
  tripId,
  initial,
  budgetIls,
  currency,
}: {
  tripId: string;
  initial: Expense[];
  budgetIls?: number;
  currency: CurrencyConfig;
}) {
  const [expenses, setExpenses] = useState<Expense[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const total = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amountIls, 0),
    [expenses]
  );
  const remaining = budgetIls ? budgetIls - total : undefined;
  const pct = budgetIls ? Math.min(100, Math.round((total / budgetIls) * 100)) : 0;

  const byCategory = useMemo(() => {
    const map = new Map<ExpenseCategory, number>();
    for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + e.amountIls);
    return CATEGORIES.map((c) => ({ category: c, sum: map.get(c) ?? 0 })).filter(
      (x) => x.sum > 0
    );
  }, [expenses]);

  const addNew = async (vals: ExpenseValues) => {
    const created = await addExpense(tripId, { ...vals, expenseDate: "2026-07-23" });
    if (created) setExpenses((prev) => [created, ...prev]);
    setShowForm(false);
  };

  const saveEdit = async (id: string, vals: ExpenseValues) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...vals } : e)));
    setEditingId(null);
    await updateExpense(id, vals);
  };

  const remove = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) setEditingId(null);
    void deleteExpense(id);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">הוצאות</h2>
        <button
          onClick={() => {
            setShowForm((v) => !v);
            setEditingId(null);
          }}
          className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-3.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-lavender)] transition-colors hover:bg-lavender-600"
        >
          <Plus className="size-4" />
          הוסף הוצאה
        </button>
      </div>

      {showForm && (
        <ExpenseForm
          currency={currency}
          submitLabel="הוסף"
          onSubmit={addNew}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Budget summary */}
      <Card className="mb-5 p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">סך הוצאות</span>
          <span className="font-mono text-2xl font-bold">{ils(total)}</span>
        </div>
        {budgetIls && (
          <>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>תקציב {ils(budgetIls)}</span>
              <span>נותרו {ils(remaining ?? 0)}</span>
            </div>
          </>
        )}
      </Card>

      {/* Category breakdown */}
      {byCategory.length > 0 && (
        <Card className="mb-5 space-y-3 p-5">
          <h3 className="text-sm font-medium text-muted-foreground">פילוח לפי קטגוריה</h3>
          {byCategory.map(({ category, sum }) => {
            const share = total > 0 ? Math.round((sum / total) * 100) : 0;
            return (
              <div key={category}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{expenseCategoryLabel[category]}</span>
                  <span className="font-mono text-muted-foreground">
                    {ils(sum)} · {share}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${share}%`, background: expenseCategoryColor[category] }}
                  />
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {/* List */}
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">
        כל ההוצאות ({expenses.length})
      </h3>
      <Card className="divide-y divide-border">
        {expenses.map((e) =>
          editingId === e.id ? (
            <div key={e.id} className="p-3">
              <ExpenseForm
                currency={currency}
                initial={e}
                submitLabel="שמירה"
                onSubmit={(vals) => saveEdit(e.id, vals)}
                onCancel={() => setEditingId(null)}
              />
            </div>
          ) : (
            <div key={e.id} className="flex items-center gap-3 p-3.5">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: expenseCategoryColor[e.category] }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {e.description ?? expenseCategoryLabel[e.category]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {expenseCategoryLabel[e.category]} · {formatFullDate(e.expenseDate)}
                </p>
              </div>
              <div className="text-end">
                <p className="font-mono text-sm font-medium">{ils(e.amountIls)}</p>
                {e.currency !== "ILS" && (
                  <p className="font-mono text-xs text-muted-foreground">
                    {currency.symbol}
                    {e.amount.toLocaleString("en-US")}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setEditingId(e.id);
                  setShowForm(false);
                }}
                aria-label="עריכה"
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => remove(e.id)}
                aria-label="מחיקה"
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          )
        )}
      </Card>
    </div>
  );
}

function ExpenseForm({
  currency,
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  currency: CurrencyConfig;
  initial?: Expense;
  submitLabel: string;
  onSubmit: (vals: ExpenseValues) => void | Promise<void>;
  onCancel: () => void;
}) {
  const initLocal = !initial || initial.currency === currency.code;
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [cur, setCur] = useState<"local" | "ILS">(initLocal ? "local" : "ILS");
  const [category, setCategory] = useState<ExpenseCategory>(initial?.category ?? "food");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const n = parseFloat(amount);
    if (!Number.isFinite(n) || n <= 0 || saving) return;
    const isLocal = cur === "local";
    const amountIls = Math.round((isLocal ? n * currency.ilsPerUnit : n) * 100) / 100;
    setSaving(true);
    await onSubmit({
      category,
      amount: n,
      currency: isLocal ? currency.code : "ILS",
      amountIls,
      description: description.trim() || undefined,
    });
    setSaving(false);
  };

  return (
    <Card className="mb-5 space-y-3 p-4">
      <div className="flex gap-2">
        <input
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="סכום"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="flex shrink-0 overflow-hidden rounded-lg border border-input">
          <button
            onClick={() => setCur("local")}
            className={cn("px-3 text-sm", cur === "local" ? "bg-primary text-primary-foreground" : "bg-background")}
          >
            {currency.symbol}
          </button>
          <button
            onClick={() => setCur("ILS")}
            className={cn("px-3 text-sm", cur === "ILS" ? "bg-primary text-primary-foreground" : "bg-background")}
          >
            ₪
          </button>
        </div>
      </div>

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="תיאור (אופציונלי)"
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              category === c
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {expenseCategoryLabel[c]}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={saving}
          className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-lavender-600 disabled:opacity-60"
        >
          {submitLabel}
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground hover:bg-secondary"
        >
          ביטול
        </button>
      </div>
    </Card>
  );
}
