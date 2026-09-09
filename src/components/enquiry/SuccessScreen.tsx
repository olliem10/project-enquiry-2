import { Logo } from "@/components/Logo";
import { CheckIcon } from "./icons";

interface SuccessScreenProps {
  reference?: string | null;
}

export function SuccessScreen({ reference }: SuccessScreenProps) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-card-border bg-card px-6 py-14 text-center sm:px-12">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
        <CheckIcon className="h-6 w-6" />
      </span>
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          Thanks — your enquiry is in.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Your enquiry has been received and there&apos;s nothing more you need to do. Someone
          from NexalField will review it and be in touch shortly to talk through next steps.
        </p>
      </div>
      {reference && (
        <p className="rounded-lg border border-card-border bg-background px-4 py-2 text-sm text-muted">
          Enquiry reference: <span className="font-medium text-foreground">{reference}</span>
        </p>
      )}
      <Logo iconOnly className="h-7 w-auto opacity-60" />
    </div>
  );
}
