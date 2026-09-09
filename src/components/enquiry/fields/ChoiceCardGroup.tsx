"use client";

import type { ReactNode } from "react";
import { FieldShell } from "./FieldShell";
import { CheckIcon } from "../icons";

interface ChoiceCardGroupProps {
  label: ReactNode;
  required?: boolean;
  helpText?: string;
  error?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const cardBase =
  "flex items-center gap-3 rounded-xl border bg-card px-4 py-3.5 text-left text-sm font-medium " +
  "transition-all duration-150 ease-out motion-reduce:transition-none motion-reduce:transform-none " +
  "hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function ChoiceCardGroup({
  label,
  required,
  helpText,
  error,
  options,
  value,
  onChange,
}: ChoiceCardGroupProps) {
  return (
    <FieldShell label={label} required={required} helpText={helpText} error={error}>
      {({ labelId, describedBy }) => (
        <div
          role="radiogroup"
          aria-labelledby={labelId}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          className="grid gap-3 sm:grid-cols-2"
        >
          {options.map((option) => {
            const selected = value === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(option)}
                className={`${cardBase} ${
                  selected
                    ? "border-foreground bg-accent-soft"
                    : error
                      ? "border-danger/60"
                      : "border-card-border hover:border-foreground/30"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    selected ? "border-foreground bg-foreground" : "border-foreground/25"
                  }`}
                >
                  {selected && <CheckIcon className="h-3 w-3 text-white" />}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      )}
    </FieldShell>
  );
}
