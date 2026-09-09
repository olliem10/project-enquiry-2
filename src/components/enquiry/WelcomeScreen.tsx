import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import {
  ENQUIRY_DESCRIPTION,
  ENQUIRY_ESTIMATED_MINUTES,
  ENQUIRY_TITLE,
  SECTIONS,
} from "@/data/enquiry-schema";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="bg-dot-grid rounded-2xl border border-card-border bg-card px-6 py-10 sm:px-12 sm:py-14">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <Logo className="text-xl" />

        <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-accent">
          Website Project Enquiry
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
          {ENQUIRY_TITLE.replace("NexalField — ", "")}
        </h1>
        <p className="mt-4 text-base text-muted">{ENQUIRY_DESCRIPTION}</p>

        <div className="mt-8 w-full rounded-xl border border-card-border bg-background p-5 text-left">
          <p className="text-sm font-medium text-foreground">How this works</p>
          <ol className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <li>1. Answer {SECTIONS.length} short sections about you, your customers and your goals.</li>
            <li>2. Review everything on one screen and change anything you like.</li>
            <li>3. Submit — we&apos;ll follow up to talk through next steps.</li>
          </ol>
          <p className="mt-4 text-xs font-medium text-muted">
            Takes about {ENQUIRY_ESTIMATED_MINUTES}. You can go back and edit any answer before
            submitting.
          </p>
        </div>

        <Button onClick={onStart} className="mt-8 w-full sm:w-auto">
          Start your enquiry
        </Button>
      </div>
    </div>
  );
}
