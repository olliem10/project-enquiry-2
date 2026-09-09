import { SECTIONS } from "@/data/enquiry-schema";
import { visibleQuestionsForSection } from "@/lib/enquiry-validation";
import type { EnquiryData, EnquiryErrors, QuestionId, SectionId } from "@/types/enquiry";
import { QuestionField } from "./QuestionField";

type FileQuestionId = Extract<QuestionId, "logoUpload" | "photoUpload">;

interface SectionStepProps {
  section: SectionId;
  data: EnquiryData;
  errors: EnquiryErrors;
  onFieldChange: <K extends keyof EnquiryData>(id: K, value: EnquiryData[K]) => void;
  onFileBlobsChange: (id: FileQuestionId, files: File[]) => void;
}

export function SectionStep({
  section,
  data,
  errors,
  onFieldChange,
  onFileBlobsChange,
}: SectionStepProps) {
  const meta = SECTIONS.find((item) => item.id === section);
  if (!meta) return null;
  const questions = visibleQuestionsForSection(section, data);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
          <span className="h-px w-4 bg-accent" aria-hidden="true" />
          Section {meta.index} of {SECTIONS.length}
        </p>
        <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          {meta.name}
        </h1>
        <p className="text-muted">{meta.description}</p>
      </header>

      <div className="flex flex-col gap-7">
        {questions.map((question) => (
          <QuestionField
            key={question.id}
            question={question}
            data={data}
            errors={errors}
            onChange={onFieldChange}
            onFileBlobsChange={onFileBlobsChange}
          />
        ))}
      </div>
    </div>
  );
}
