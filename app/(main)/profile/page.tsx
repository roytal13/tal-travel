import { User, LogOut, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { VERSION_LABEL } from "@/lib/version";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="page-enter mx-auto max-w-2xl px-4 py-6 md:px-8 md:py-8">
      <h1 className="mb-6 text-3xl font-bold">פרופיל</h1>

      <Card className="mb-4 flex items-center gap-4 p-5">
        <span className="flex size-12 items-center justify-center rounded-full bg-lavender-100 text-lavender-700">
          <User className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="font-medium">{user?.user_metadata?.full_name ?? "משתמש"}</p>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground" dir="ltr">
            <Mail className="size-3.5" />
            {user?.email}
          </p>
        </div>
      </Card>

      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card py-3 text-sm font-medium text-destructive transition-colors hover:bg-secondary"
        >
          <LogOut className="size-4" />
          התנתקות
        </button>
      </form>

      <p className="mt-8 text-center font-mono text-xs text-muted-foreground">
        Tal Travel {VERSION_LABEL}
      </p>
    </div>
  );
}
