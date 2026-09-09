interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

/**
 * NexalField mark, traced from the supplied reference images (five nodes
 * joined by four lines). Swap this for the real asset file once it is
 * added to /public — every call site renders <Logo />, so the change is
 * local to this component.
 */
function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round">
        <line x1="22" y1="22" x2="50" y2="50" />
        <line x1="78" y1="22" x2="50" y2="50" />
        <line x1="50" y1="50" x2="22" y2="78" />
        <line x1="50" y1="50" x2="78" y2="78" />
        <line x1="22" y1="22" x2="22" y2="78" />
      </g>
      <g fill="currentColor">
        <circle cx="22" cy="22" r="9" />
        <circle cx="78" cy="22" r="9" />
        <circle cx="50" cy="50" r="9" />
        <circle cx="22" cy="78" r="9" />
        <circle cx="78" cy="78" r="9" />
      </g>
    </svg>
  );
}

export function Logo({ className = "", iconOnly = false }: LogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 text-foreground ${className}`}
    >
      <LogoIcon className="h-7 w-7 shrink-0" />
      {iconOnly ? (
        <span className="sr-only">NexalField</span>
      ) : (
        <span className="text-lg tracking-wide whitespace-nowrap">
          <span className="font-semibold">NEXAL</span>
          <span className="font-normal text-muted">FIELD</span>
        </span>
      )}
    </span>
  );
}
