import { ENQUIRY_STATUS_LABELS, type EnquiryStatus } from "@/types/enquiry";

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  new: "bg-accent-soft text-accent",
  in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-foreground text-white",
};

// Distinct symbol per status so meaning never depends on colour alone.
const STATUS_SYMBOLS: Record<EnquiryStatus, string> = {
  new: "●",
  in_progress: "◐",
  completed: "✓",
};

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      <span aria-hidden="true">{STATUS_SYMBOLS[status]}</span>
      {ENQUIRY_STATUS_LABELS[status]}
    </span>
  );
}
