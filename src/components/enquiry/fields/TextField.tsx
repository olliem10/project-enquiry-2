"use client";

import type { ReactNode } from "react";
import { FieldShell, inputClasses } from "./FieldShell";

interface TextFieldProps {
  id: string;
  label: ReactNode;
  required?: boolean;
  helpText?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  placeholder?: string;
}

export function TextField({
  id,
  label,
  required,
  helpText,
  error,
  value,
  onChange,
  type = "text",
  placeholder,
}: TextFieldProps) {
  return (
    <FieldShell label={label} required={required} helpText={helpText} error={error} htmlFor={id}>
      {({ describedBy }) => (
        <input
          id={id}
          name={id}
          type={type}
          inputMode={type === "tel" ? "tel" : type === "email" ? "email" : undefined}
          autoComplete={
            type === "email" ? "email" : type === "tel" ? "tel" : undefined
          }
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={inputClasses(!!error)}
        />
      )}
    </FieldShell>
  );
}
