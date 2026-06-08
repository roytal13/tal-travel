"use client";

import { useState } from "react";
import { ArrowLeftRight, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { CurrencyConfig } from "@/lib/destinations";

const QUICK_AMOUNTS = [100, 500, 1000, 5000, 10000];

function round(n: number, digits = 2): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

export function CurrencyConverter({ currency }: { currency: CurrencyConfig }) {
  const [rate, setRate] = useState(currency.ilsPerUnit);
  const [local, setLocal] = useState("1000");
  const [ils, setIls] = useState(round(1000 * currency.ilsPerUnit).toString());

  const onLocal = (value: string) => {
    setLocal(value);
    const n = parseFloat(value);
    setIls(Number.isFinite(n) ? round(n * rate).toString() : "");
  };

  const onIls = (value: string) => {
    setIls(value);
    const n = parseFloat(value);
    setLocal(Number.isFinite(n) ? round(n / rate).toString() : "");
  };

  const onRate = (value: string) => {
    const n = parseFloat(value);
    if (!Number.isFinite(n) || n <= 0) return;
    setRate(n);
    const l = parseFloat(local);
    setIls(Number.isFinite(l) ? round(l * n).toString() : "");
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-6 md:px-8">
      <h2 className="mb-1 text-2xl font-bold">ממיר מטבע</h2>
      <p className="mb-5 text-sm text-muted-foreground">
        {currency.name} ({currency.code}) לשקלים
      </p>

      {/* Converter */}
      <Card className="space-y-4 p-5">
        <Field
          label={`${currency.name} ${currency.symbol}`}
          value={local}
          onChange={onLocal}
          suffix={currency.symbol}
        />
        <div className="flex justify-center">
          <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <ArrowLeftRight className="size-4 rotate-90" />
          </span>
        </div>
        <Field label="שקלים ₪" value={ils} onChange={onIls} suffix="₪" />
      </Card>

      {/* Rate */}
      <Card className="mt-4 flex items-center justify-between gap-3 p-4">
        <label className="text-sm text-muted-foreground" htmlFor="rate">
          שער: 1 {currency.symbol} =
        </label>
        <div className="flex items-center gap-1">
          <input
            id="rate"
            type="number"
            inputMode="decimal"
            step="0.001"
            value={rate}
            onChange={(e) => onRate(e.target.value)}
            className="w-24 rounded-md border border-input bg-background px-2 py-1 text-end font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <span className="text-sm text-muted-foreground">₪</span>
        </div>
      </Card>

      {/* Quick reference */}
      <Card className="mt-4 overflow-hidden">
        <div className="border-b border-border p-4 text-sm font-medium">
          המרה מהירה
        </div>
        <div className="divide-y divide-border">
          {QUICK_AMOUNTS.map((amount) => (
            <div key={amount} className="flex items-center justify-between p-3 text-sm">
              <span className="font-mono">
                {currency.symbol}
                {amount.toLocaleString("en-US")}
              </span>
              <span className="font-mono font-medium">
                ₪{round(amount * rate).toLocaleString("he-IL")}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <p className="mt-4 flex items-start gap-1.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        שער מקורב להתמצאות בלבד. אפשר לעדכן ידנית לפי השער ביום ההמרה.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent py-3 font-mono text-lg outline-none"
          placeholder="0"
        />
        <span className="text-lg text-muted-foreground">{suffix}</span>
      </div>
    </div>
  );
}
