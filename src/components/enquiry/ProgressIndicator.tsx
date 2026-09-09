import { SECTIONS } from "@/data/enquiry-schema";
import type { SectionId } from "@/types/enquiry";
import { CheckIcon } from "./icons";

function circleClasses(state: "done" | "current" | "upcoming") {
  const base =
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors duration-150";
  if (state === "done") return `${base} border-foreground bg-foreground text-white`;
  if (state === "current") return `${base} border-foreground text-foreground`;
  return `${base} border-card-border text-muted`;
}

export function ProgressIndicator({ current }: { current: SectionId }) {
  const currentIndex = SECTIONS.findIndex((section) => section.id === current);
  const percent = Math.round(((currentIndex + 1) / SECTIONS.length) * 100);

  return (
    <nav aria-label="Enquiry progress" className="w-full">
      <div className="sm:hidden">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
          <span>
            Step {currentIndex + 1} of {SECTIONS.length}
          </span>
          <span className="text-foreground">{SECTIONS[currentIndex].name}</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Enquiry completion"
          className="h-1.5 w-full overflow-hidden rounded-full bg-card-border"
        >
          <div
            className="h-full rounded-full bg-foreground transition-all duration-300 ease-out motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <ol className="hidden items-center sm:flex">
        {SECTIONS.map((section, index) => {
          const state = index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming";
          const isLast = index === SECTIONS.length - 1;
          return (
            <li key={section.id} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
              <span className="flex items-center gap-2">
                <span className={circleClasses(state)} aria-hidden="true">
                  {state === "done" ? <CheckIcon className="h-3.5 w-3.5" /> : section.index}
                </span>
                <span
                  className={`hidden text-xs font-medium lg:inline ${
                    state === "upcoming" ? "text-muted" : "text-foreground"
                  }`}
                >
                  {section.name}
                </span>
                <span className="sr-only lg:hidden">
                  {section.name}
                  {state === "current" ? " (current)" : state === "done" ? " (completed)" : ""}
                </span>
              </span>
              {!isLast && <span className="mx-2 h-px flex-1 bg-card-border" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
