import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";

/**
 * Hybrid app shell: desktop gets a left sidebar, mobile gets a bottom tab bar.
 * Content area scrolls independently; mobile leaves room for the bottom nav.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <main className="min-w-0 flex-1 pb-20 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
