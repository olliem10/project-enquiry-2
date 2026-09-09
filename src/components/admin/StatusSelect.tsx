"use client";

import { useState, useTransition } from "react";
import { updateEnquiryStatus } from "@/server/admin-mutations";
import { ENQUIRY_STATUSES, ENQUIRY_STATUS_LABELS, type EnquiryStatus } from "@/types/enquiry";
import { AlertIcon } from "@/components/enquiry/icons";

interface StatusSelectProps {
  enquiryId: string;
  initialStatus: EnquiryStatus;
}

export function StatusSelect({ enquiryId, initialStatus }: StatusSelectProps) {
  const [status, setStatus] = useState<EnquiryStatus>(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(next: EnquiryStatus) {
    const previous = status;
    setStatus(next);
    setError(null);

    startTransition(async () => {
      const result = await updateEnquiryStatus(enquiryId, next);
      if (!result.ok) {
        setStatus(previous);
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="enquiry-status" className="text-xs font-medium text-muted">
        Status
      </label>
      <select
        id="enquiry-status"
        value={status}
        disabled={isPending}
        onChange={(event) => handleChange(event.target.value as EnquiryStatus)}
        aria-busy={isPending}
        className="rounded-lg border border-card-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      >
        {ENQUIRY_STATUSES.map((value) => (
          <option key={value} value={value}>
            {ENQUIRY_STATUS_LABELS[value]}
          </option>
        ))}
      </select>
      {isPending && <span className="text-xs text-muted">Saving…</span>}
      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-xs text-danger">
          <AlertIcon className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
