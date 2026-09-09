import { Logo } from "@/components/Logo";
import { CheckIcon } from "./icons";

export function SuccessScreen() {
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
          We&apos;ve got everything we need for now. Someone from NexalField will be in touch
          shortly to talk through next steps.
        </p>
      </div>
      <Logo iconOnly className="opacity-60" />
    </div>
  );
}
