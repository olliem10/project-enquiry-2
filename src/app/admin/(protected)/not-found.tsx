import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="rounded-xl border border-card-border bg-card p-8 text-center">
      <h1 className="font-serif text-xl font-semibold text-foreground">Enquiry not found</h1>
      <p className="mt-2 text-sm text-muted">
        This enquiry doesn&apos;t exist, or you don&apos;t have access to it.
      </p>
      <Link
        href="/admin"
        className="mt-4 inline-block text-sm font-medium text-accent underline-offset-2 hover:underline"
      >
        Back to all enquiries
      </Link>
    </div>
  );
}
