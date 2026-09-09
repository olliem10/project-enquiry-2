"use client";

import type { ReactNode } from "react";
import { CheckIcon } from "../icons";
import { AlertIcon } from "../icons";

interface AgreementFieldProps {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function AgreementField({ id, label, checked, onChange, error }: AgreementFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 transition-colors duration-150 hover:border-foreground/30 ${
          error ? "border-danger" : "border-card-border"
        }`}
      >
        <span
          aria-hidden="true"
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background ${
            checked ? "border-foreground bg-foreground" : "border-foreground/25"
          }`}
        >
          {checked && <CheckIcon className="h-3 w-3 text-white" />}
        </span>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className="peer sr-only"
        />
        <span className="text-sm text-foreground">
          {label} <span className="text-danger" aria-hidden="true">*</span>
        </span>
      </label>
      {error && (
        <p id={errorId} role="alert" className="flex items-center gap-1.5 text-sm text-danger">
          <AlertIcon className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
