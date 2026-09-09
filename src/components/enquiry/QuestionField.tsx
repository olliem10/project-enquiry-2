"use client";

import type { EnquiryData, EnquiryErrors, Question, QuestionId } from "@/types/enquiry";
import { TextField } from "./fields/TextField";
import { TextAreaField } from "./fields/TextAreaField";
import { ChoiceCardGroup } from "./fields/ChoiceCardGroup";
import { CheckboxCardGroup } from "./fields/CheckboxCardGroup";
import { FileUploadField } from "./fields/FileUploadField";
import { AgreementField } from "./fields/AgreementField";

type OtherFieldKey = Extract<
  keyof EnquiryData,
  "visitorActionsOther" | "desiredPagesOther" | "stylePreferencesOther" | "contactMethodsOther"
>;

const OTHER_FIELD_FOR: Partial<Record<QuestionId, OtherFieldKey>> = {
  visitorActions: "visitorActionsOther",
  desiredPages: "desiredPagesOther",
  stylePreferences: "stylePreferencesOther",
  contactMethods: "contactMethodsOther",
};

type FileQuestionId = Extract<QuestionId, "logoUpload" | "photoUpload">;

interface QuestionFieldProps {
  question: Question;
  data: EnquiryData;
  errors: EnquiryErrors;
  onChange: <K extends keyof EnquiryData>(id: K, value: EnquiryData[K]) => void;
  onFileBlobsChange: (id: FileQuestionId, files: File[]) => void;
}

export function QuestionField({ question, data, errors, onChange, onFileBlobsChange }: QuestionFieldProps) {
  const numberedLabel = (
    <>
      <span className="mr-2 tabular-nums text-muted">
        {String(question.number).padStart(2, "0")}
      </span>
      {question.label}
    </>
  );
  const error = errors[question.id];

  switch (question.type) {
    case "short-text":
    case "email": {
      const inputType = question.type === "email" ? "email" : question.id === "phone" ? "tel" : "text";
      return (
        <TextField
          id={question.id}
          label={numberedLabel}
          required={question.required}
          helpText={question.helpText}
          error={error}
          type={inputType}
          placeholder={question.placeholder}
          value={data[question.id] as string}
          onChange={(value) => onChange(question.id, value)}
        />
      );
    }

    case "paragraph":
      return (
        <TextAreaField
          id={question.id}
          label={numberedLabel}
          required={question.required}
          helpText={question.helpText}
          error={error}
          placeholder={question.placeholder}
          value={data[question.id] as string}
          onChange={(value) => onChange(question.id, value)}
        />
      );

    case "single-choice":
      return (
        <ChoiceCardGroup
          label={numberedLabel}
          required={question.required}
          helpText={question.helpText}
          error={error}
          options={question.options}
          value={data[question.id] as string}
          onChange={(value) => onChange(question.id, value)}
        />
      );

    case "multi-choice": {
      const otherKey = OTHER_FIELD_FOR[question.id];
      if (!otherKey) return null;
      return (
        <CheckboxCardGroup
          id={question.id}
          label={numberedLabel}
          required={question.required}
          helpText={question.helpText}
          error={error}
          options={question.options}
          values={data[question.id] as string[]}
          onChange={(values) => onChange(question.id, values)}
          otherValue={data[otherKey]}
          onOtherChange={(value) => onChange(otherKey, value)}
        />
      );
    }

    case "file": {
      const fileQuestionId = question.id as FileQuestionId;
      return (
        <FileUploadField
          id={question.id}
          label={numberedLabel}
          required={question.required}
          helpText={question.helpText}
          error={error}
          files={data[question.id] as EnquiryData["logoUpload"]}
          onChange={(files) => onChange(question.id, files)}
          onRawFilesChange={(files) => onFileBlobsChange(fileQuestionId, files)}
        />
      );
    }

    case "agreement":
      return (
        <AgreementField
          id={question.id}
          label={question.label}
          checked={data[question.id] as boolean}
          onChange={(checked) => onChange(question.id, checked)}
          error={error}
        />
      );

    default:
      return null;
  }
}
