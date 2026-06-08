"use client";

import { useState } from "react";
import { Plane, Mail, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
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

        {status === "sent" ? (
          <div className="rounded-xl bg-[#d1fae5] p-4 text-center text-sm text-[#065f46]">
            <Check className="mx-auto mb-2 size-6" />
            שלחנו קישור התחברות ל-{email}. בדוק את תיבת המייל ולחץ על הקישור.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <label className="block text-sm font-medium" htmlFor="email">
              כתובת מייל
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
              <Mail className="size-4 text-muted-foreground" />
              <input
                id="email"
                type="email"
                dir="ltr"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent py-2.5 text-sm outline-none"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-lavender)] transition-colors hover:bg-lavender-600 disabled:opacity-60"
            >
              {status === "sending" ? "שולח..." : "שלח קישור התחברות"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              נשלח אליך קישור חד-פעמי להתחברות, בלי סיסמה.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
