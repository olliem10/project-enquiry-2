import Link from "next/link";
import { listEnquiries } from "@/server/admin-queries";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateTime } from "@/lib/format-date";
import { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABELS, type EnquiryStatus } from "@/types/enquiry";

export const metadata = {
  title: "Enquiries — NexalField Admin",
};

function isEnquiryStatus(value: string | undefined): value is EnquiryStatus {
  return !!value && (ENQUIRY_STATUSES as string[]).includes(value);
}

interface AdminDashboardPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const statusParam = typeof params.status === "string" ? params.status : undefined;
  const status = isEnquiryStatus(statusParam) ? statusParam : undefined;

  const enquiries = await listEnquiries({ search: q, status });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          Enquiries
        </h1>
        <p className="mt-1 text-sm text-muted">
          {enquiries.length} {enquiries.length === 1 ? "enquiry" : "enquiries"}
          {status ? ` · ${ENQUIRY_STATUS_LABELS[status]}` : ""}
          {q ? ` · matching "${q}"` : ""}
        </p>
      </header>

      <form method="GET" className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="q" className="text-xs font-medium text-muted">
            Search
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Business, contact, or email"
            className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted/70 transition-colors hover:border-foreground/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-xs font-medium text-muted">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status ?? ""}
            className="rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:border-foreground/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All statuses</option>
            {ENQUIRY_STATUSES.map((value) => (
              <option key={value} value={value}>
                {ENQUIRY_STATUS_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg border border-foreground/20 bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Apply
        </button>
        {(q || status) && (
          <Link
            href="/admin"
            className="text-sm font-medium text-muted underline-offset-2 hover:text-foreground hover:underline"
          >
            Clear
          </Link>
        )}
      </form>

      {enquiries.length === 0 ? (
        <p className="rounded-xl border border-card-border bg-card px-5 py-8 text-center text-sm text-muted">
          No enquiries match these filters yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {enquiries.map((enquiry) => (
            <li key={enquiry.id}>
              <Link
                href={`/admin/enquiries/${enquiry.id}`}
                className="flex flex-col gap-3 rounded-xl border border-card-border bg-card p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{enquiry.businessName}</p>
                  <p className="truncate text-sm text-muted">
                    {enquiry.contactName} · {enquiry.email}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-muted">{formatDateTime(enquiry.createdAt)}</span>
                  <StatusBadge status={enquiry.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
