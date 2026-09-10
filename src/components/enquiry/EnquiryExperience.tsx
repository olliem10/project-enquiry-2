"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { SECTIONS, createEmptyEnquiry } from "@/data/enquiry-schema";
import { validateAll, validateSection } from "@/lib/enquiry-validation";
import { submitEnquiry } from "@/server/enquiry-actions";
import type { EnquiryData, EnquiryErrors, QuestionId, SectionId, StepId } from "@/types/enquiry";
import { WelcomeScreen } from "./WelcomeScreen";
import { ProgressIndicator } from "./ProgressIndicator";
import { SectionStep } from "./SectionStep";
import { ReviewScreen } from "./ReviewScreen";
import { SuccessScreen } from "./SuccessScreen";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

type FileQuestionId = Extract<QuestionId, "logoUpload" | "photoUpload">;

const SECTION_ORDER: SectionId[] = SECTIONS.map((section) => section.id);

function isSectionId(step: StepId): step is SectionId {
  return (SECTION_ORDER as StepId[]).includes(step);
}

export function EnquiryExperience() {
  const [step, setStep] = useState<StepId>("welcome");
  const [data, setData] = useState<EnquiryData>(() => createEmptyEnquiry());
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [editingFromReview, setEditingFromReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Raw File blobs never live in `data` (which must stay JSON-serialisable) —
  // they're tracked here, keyed by field, and only read at submission time.
  const fileBlobs = useRef<Record<FileQuestionId, File[]>>({
    logoUpload: [],
    photoUpload: [],
  });

  const currentSectionIndex = useMemo(
    () => (isSectionId(step) ? SECTION_ORDER.indexOf(step) : -1),
    [step],
  );

  const focusCard = useCallback(() => {
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    cardRef.current?.focus({ preventScroll: true });
  }, []);

  const handleFieldChange = useCallback(
    <K extends keyof EnquiryData>(id: K, value: EnquiryData[K]) => {
      setData((prev) => ({ ...prev, [id]: value }));
      setErrors((prev) => {
        const key = id as unknown as keyof EnquiryErrors;
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const handleFileBlobsChange = useCallback((id: FileQuestionId, files: File[]) => {
    fileBlobs.current[id] = files;
  }, []);

  const goToStep = useCallback(
    (next: StepId) => {
      setStep(next);
      setErrors({});
      requestAnimationFrame(focusCard);
    },
    [focusCard],
  );

  function handleStart() {
    goToStep(SECTION_ORDER[0]);
  }

  function handleBack() {
    if (editingFromReview) {
      setEditingFromReview(false);
      goToStep("review");
      return;
    }
    if (currentSectionIndex <= 0) {
      goToStep("welcome");
      return;
    }
    goToStep(SECTION_ORDER[currentSectionIndex - 1]);
  }

  function handleContinue() {
    if (!isSectionId(step)) return;
    const sectionErrors = validateSection(step, data);
    if (Object.keys(sectionErrors).length > 0) {
      setErrors(sectionErrors);
      focusCard();
      return;
    }

    if (editingFromReview) {
      setEditingFromReview(false);
      goToStep("review");
      return;
    }

    const isLastSection = currentSectionIndex === SECTION_ORDER.length - 1;
    goToStep(isLastSection ? "review" : SECTION_ORDER[currentSectionIndex + 1]);
  }

  function handleEditSection(section: SectionId) {
    setEditingFromReview(true);
    goToStep(section);
  }

  async function handleSubmit() {
    if (isSubmitting) return; // guards against double-clicks / rapid re-submits

    const allErrors = validateAll(data);
    if (Object.keys(allErrors).length > 0) {
      const firstInvalidSection = SECTION_ORDER.find(
        (section) => Object.keys(validateSection(section, data)).length > 0,
      );
      setEditingFromReview(true);
      if (firstInvalidSection) goToStep(firstInvalidSection);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.set("answers", JSON.stringify(data));
      for (const fieldId of ["logoUpload", "photoUpload"] as const) {
        for (const file of fileBlobs.current[fieldId]) {
          formData.append(`file:${fieldId}`, file);
        }
      }

      const result = await submitEnquiry(formData);

      if (!result.ok) {
        setSubmitError(result.error);
        if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
          setErrors(result.fieldErrors);
        }
        setIsSubmitting(false);
        return;
      }

      setReference(result.reference);
      setIsSubmitting(false);
      goToStep("success");
    } catch {
      setSubmitError("Something went wrong sending your enquiry. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-card-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center px-4 py-4 sm:px-6">
          <Logo />
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
          {step === "welcome" && <WelcomeScreen onStart={handleStart} />}

          {isSectionId(step) && (
            <div className="flex flex-col gap-8">
              <ProgressIndicator current={step} />

              <div
                key={step}
                ref={cardRef}
                tabIndex={-1}
                className="animate-step-in scroll-mt-6 rounded-2xl border border-card-border bg-card p-6 focus:outline-none sm:p-10"
              >
                <SectionStep
                  section={step}
                  data={data}
                  errors={errors}
                  onFieldChange={handleFieldChange}
                  onFileBlobsChange={handleFileBlobsChange}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <Button type="button" variant="ghost" onClick={handleBack}>
                  <ChevronLeftIcon className="h-4 w-4" />
                  Back
                </Button>
                <Button type="button" onClick={handleContinue}>
                  {editingFromReview
                    ? "Back to review"
                    : currentSectionIndex === SECTION_ORDER.length - 1
                      ? "Review your answers"
                      : "Continue"}
                  {!editingFromReview && <ChevronRightIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          {step === "review" && (
            <div key="review" ref={cardRef} tabIndex={-1} className="animate-step-in scroll-mt-6 focus:outline-none">
              <ReviewScreen
                data={data}
                onEditSection={handleEditSection}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            </div>
          )}

          {step === "success" && (
            <div key="success" className="animate-step-in">
              <SuccessScreen reference={reference} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
