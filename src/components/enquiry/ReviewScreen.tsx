import { SECTIONS } from "@/data/enquiry-schema";
import { visibleQuestionsForSection } from "@/lib/enquiry-validation";
import { formatAnswer } from "@/lib/format-answer";
import type { EnquiryData, SectionId } from "@/types/enquiry";
import { Button } from "@/components/Button";

interface ReviewScreenProps {
  data: EnquiryData;
  onEditSection: (section: SectionId) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function ReviewScreen({ data, onEditSection, onSubmit, isSubmitting }: ReviewScreenProps) {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
          <span className="h-px w-4 bg-accent" aria-hidden="true" />
          Review
        </p>
        <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          Review your answers
        </h1>
        <p className="text-muted">
          Everything below will be sent to NexalField. Use “Edit” on any section to make changes —
          your answers will be right here waiting for you.
        </p>
      </header>

      <div className="flex flex-col gap-5">
        {SECTIONS.map((section) => {
          const questions = visibleQuestionsForSection(section.id, data);
          return (
            <section
              key={section.id}
              className="rounded-xl border border-card-border bg-card p-5 sm:p-6"
              aria-labelledby={`review-${section.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Section {section.index}
                  </p>
                  <h2 id={`review-${section.id}`} className="font-serif text-lg font-semibold text-foreground">
                    {section.name}
                  </h2>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="px-4 py-2 text-xs"
                  onClick={() => onEditSection(section.id)}
                >
                  Edit
                </Button>
              </div>

              <dl className="mt-4 flex flex-col divide-y divide-card-border">
                {questions.map((question) => (
                  <div key={question.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
                    <dt className="text-sm font-medium text-foreground">{question.label}</dt>
                    <dd className="text-sm whitespace-pre-wrap text-muted">
                      {formatAnswer(question, data)}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        })}
      </div>

      <div className="flex flex-col items-start gap-3 border-t border-card-border pt-6">
        <p className="text-sm text-muted">
          Happy with everything? Submitting sends your answers to NexalField — no payment or
          account required.
        </p>
        <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting…" : "Submit your enquiry"}
        </Button>
      </div>
    </div>
  );
}
