"use client";

import type { ReactNode } from "react";
import { FieldShell, inputClasses } from "./FieldShell";
import { CheckIcon } from "../icons";

const OTHER_OPTION = "Other";

interface CheckboxCardGroupProps {
  id: string;
  label: ReactNode;
  required?: boolean;
  helpText?: string;
  error?: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
  otherValue: string;
  onOtherChange: (value: string) => void;
}

const cardBase =
  "flex items-center gap-3 rounded-xl border bg-card px-4 py-3.5 text-left text-sm font-medium " +
  "transition-all duration-150 ease-out motion-reduce:transition-none motion-reduce:transform-none " +
  "hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function CheckboxCardGroup({
  id,
  label,
  required,
  helpText,
  error,
  options,
  values,
  onChange,
  otherValue,
  onOtherChange,
}: CheckboxCardGroupProps) {
  const isOtherSelected = values.includes(OTHER_OPTION);

  function toggle(option: string) {
    if (values.includes(option)) {
      onChange(values.filter((value) => value !== option));
    } else {
      onChange([...values, option]);
    }
  }

  return (
    <FieldShell label={label} required={required} helpText={helpText} error={error}>
      {({ labelId, describedBy }) => (
        <div
          role="group"
          aria-labelledby={labelId}
          aria-describedby={describedBy}
          className="flex flex-col gap-3"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[...options, OTHER_OPTION].map((option) => {
              const selected = values.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  onClick={() => toggle(option)}
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
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border-2 transition-colors ${
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
          {isOtherSelected && (
            <input
              id={`${id}-other`}
              type="text"
              value={otherValue}
              onChange={(event) => onOtherChange(event.target.value)}
              placeholder="Tell us more"
              aria-label="Please specify"
              className={inputClasses(false)}
            />
          )}
        </div>
      )}
    </FieldShell>
  );
}
