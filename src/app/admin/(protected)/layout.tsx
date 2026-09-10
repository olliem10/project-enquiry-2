import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { requireAdminSession } from "@/server/admin-auth";
import { signOutAdmin } from "@/server/admin-actions";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-card-border bg-card">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo className="h-6 w-auto" />
            <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-accent">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted sm:inline">{session.email}</span>
            <form action={signOutAdmin}>
              <Button type="submit" variant="secondary" className="px-4 py-2 text-xs">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</div>
      </main>
    </div>
  );
}
