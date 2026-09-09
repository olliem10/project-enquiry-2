import { notFound } from "next/navigation";
import Link from "next/link";
import { getEnquiryById } from "@/server/admin-enquiry";
import { SECTIONS } from "@/data/enquiry-schema";
import { visibleQuestionsForSection } from "@/lib/enquiry-validation";
import { formatAnswer } from "@/lib/format-answer";
import { formatDateTime } from "@/lib/format-date";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { AdminFileList } from "@/components/admin/AdminFileList";
import type { EnquiryData, StoredFileMeta } from "@/types/enquiry";

interface EnquiryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EnquiryDetailPage({ params }: EnquiryDetailPageProps) {
  const { id } = await params;
  const enquiry = await getEnquiryById(id);
  if (!enquiry) notFound();

  // StoredEnquiryData differs from EnquiryData only in that file fields
  // carry a `path` alongside the metadata Stage 2 already defines — the
  // shared validation/formatting helpers only read the common fields.
  const answersForSharedHelpers = enquiry.answers as unknown as EnquiryData;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/admin" className="text-sm text-muted hover:text-foreground hover:underline">
          ← All enquiries
        </Link>
      </div>

      <header className="flex flex-col gap-4 rounded-xl border border-card-border bg-card p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Reference {enquiry.reference}
          </p>
          <h1 className="mt-1 font-serif text-2xl font-semibold text-foreground sm:text-3xl">
            {enquiry.businessName}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {enquiry.contactName} · {enquiry.email}
          </p>
          <p className="mt-1 text-xs text-muted">
            Submitted {formatDateTime(enquiry.createdAt)}
            {enquiry.updatedAt !== enquiry.createdAt &&
              ` · Updated ${formatDateTime(enquiry.updatedAt)}`}
          </p>
        </div>
        <StatusSelect enquiryId={enquiry.id} initialStatus={enquiry.status} />
      </header>

      <div className="flex flex-col gap-5">
        {SECTIONS.map((section) => {
          const questions = visibleQuestionsForSection(section.id, answersForSharedHelpers);
          return (
            <section
              key={section.id}
              className="rounded-xl border border-card-border bg-card p-5 sm:p-6"
              aria-labelledby={`section-${section.id}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Section {section.index}
              </p>
              <h2 id={`section-${section.id}`} className="font-serif text-lg font-semibold text-foreground">
                {section.name}
              </h2>

              <dl className="mt-4 flex flex-col divide-y divide-card-border">
                {questions.map((question) => (
                  <div key={question.id} className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0">
                    <dt className="text-sm font-medium text-foreground">{question.label}</dt>
                    <dd className="text-sm whitespace-pre-wrap text-muted">
                      {question.type === "file" ? (
                        <AdminFileList
                          files={enquiry.answers[question.id as "logoUpload" | "photoUpload"] as StoredFileMeta[]}
                        />
                      ) : (
                        formatAnswer(question, answersForSharedHelpers)
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        })}
      </div>
    </div>
  );
}
