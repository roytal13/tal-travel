"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PhraseCategory } from "@/lib/destinations";

export function PhrasebookScreen({
  localeName,
  categories,
}: {
  localeName: string;
  categories: PhraseCategory[];
}) {
  const [active, setActive] = useState<string>(categories[0]?.key ?? "");
  const current = categories.find((c) => c.key === active) ?? categories[0];

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <h2 className="mb-1 text-2xl font-bold">מילון בסיסי</h2>
      <p className="mb-5 text-sm text-muted-foreground">ביטויים שימושיים ב{localeName}</p>

      {/* Category pills */}
      <div className="mb-5 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              active === c.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {current?.phrases.map((p, i) => (
          <Card key={i} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{p.he}</p>
              {/* Pronunciation, the part the family will actually read aloud */}
              <p className="font-medium">{p.pron}</p>
            </div>
            <p
              className="shrink-0 text-2xl"
              lang="ja"
              dir="ltr"
              aria-label={`${p.he} ב${localeName}`}
            >
              {p.local}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
