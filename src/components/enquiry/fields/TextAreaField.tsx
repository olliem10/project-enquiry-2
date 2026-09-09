"use client";

import type { ReactNode } from "react";
import { FieldShell, inputClasses } from "./FieldShell";

interface TextAreaFieldProps {
  id: string;
  label: ReactNode;
  required?: boolean;
  helpText?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextAreaField({
  id,
  label,
  required,
  helpText,
  error,
  value,
  onChange,
  placeholder,
}: TextAreaFieldProps) {
  return (
    <FieldShell label={label} required={required} helpText={helpText} error={error} htmlFor={id}>
      {({ describedBy }) => (
        <textarea
          id={id}
          name={id}
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`${inputClasses(!!error)} resize-y`}
        />
      )}
    </FieldShell>
  );
}
