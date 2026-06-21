"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Lock } from "lucide-react";
import { VERSION_LABEL } from "@/lib/version";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.replace("/trips");
    } else {
      setError("סיסמה שגויה");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-lavender-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Plane className="size-7" />
          </div>
          <h1 className="font-display text-2xl font-bold">Tal Travel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            פלטפורמת תכנון הטיולים של משפחת טל
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <label className="block text-sm font-medium" htmlFor="password">
            סיסמה
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
            <Lock className="size-4 shrink-0 text-muted-foreground" />
            <input
              id="password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="הכנס סיסמה"
              className="w-full bg-transparent py-2.5 text-sm outline-none"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-lavender)] transition-colors hover:bg-lavender-600 disabled:opacity-60"
          >
            {loading ? "מתחבר..." : "כניסה"}
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-[11px] text-muted-foreground">
          {VERSION_LABEL}
        </p>
      </div>
    </div>
  );
}
