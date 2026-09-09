import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminSession } from "@/server/admin-auth";

export const metadata = {
  title: "Admin Sign In — NexalField",
};

export default async function AdminLoginPage() {
  // If Supabase isn't reachable/configured, fail open to showing the form
  // rather than taking down the one page whose job is to attempt sign-in —
  // the sign-in attempt itself will surface a friendly error either way.
  const session = await getAdminSession().catch(() => null);
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-card-border bg-card p-8">
        <div className="flex flex-col items-center text-center">
          <Logo className="h-7 w-auto" />
          <h1 className="mt-6 font-serif text-2xl font-semibold text-foreground">Admin Sign In</h1>
          <p className="mt-1 text-sm text-muted">Sign in to view submitted enquiries.</p>
        </div>

        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
