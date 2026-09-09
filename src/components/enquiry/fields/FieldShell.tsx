"use client";

import { useId, type ReactNode } from "react";
import { AlertIcon } from "../icons";

interface FieldShellChildContext {
  descriptionId?: string;
  errorId?: string;
  labelId: string;
  describedBy?: string;
}

interface FieldShellProps {
  label: ReactNode;
  required?: boolean;
  helpText?: string;
  error?: string;
  htmlFor?: string;
  children: (ctx: FieldShellChildContext) => ReactNode;
}

export function FieldShell({
  label,
  required,
  helpText,
  error,
  htmlFor,
  children,
}: FieldShellProps) {
  const autoId = useId();
  const labelId = `${autoId}-label`;
  const descriptionId = helpText ? `${autoId}-help` : undefined;
  const errorId = error ? `${autoId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  const labelContent = (
    <>
      {label}{" "}
      {required ? (
        <span className="text-danger" aria-hidden="true">
          *
        </span>
      ) : (
        <span className="ml-1 text-xs font-normal text-muted">(optional)</span>
      )}
    </>
  );

  return (
    <div className="flex flex-col gap-2">
      {htmlFor ? (
        <label htmlFor={htmlFor} id={labelId} className="text-sm font-medium text-foreground">
          {labelContent}
        </label>
      ) : (
        <span id={labelId} className="text-sm font-medium text-foreground">
          {labelContent}
        </span>
      )}
      {helpText && (
        <p id={descriptionId} className="text-sm text-muted">
          {helpText}
        </p>
      )}
      {children({ descriptionId, errorId, labelId, describedBy })}
      {error && (
        <p id={errorId} role="alert" className="flex items-center gap-1.5 text-sm text-danger">
          <AlertIcon className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClasses = (hasError: boolean) =>
  [
    "w-full rounded-lg border bg-card px-4 py-3 text-base text-foreground",
    "placeholder:text-muted/70 transition-colors duration-150",
    "hover:border-foreground/30",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    hasError ? "border-danger focus:border-danger" : "border-card-border focus:border-foreground/60",
  ].join(" ");
