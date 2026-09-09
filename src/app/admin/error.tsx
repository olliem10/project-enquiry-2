"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[admin] Unexpected error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-card-border bg-card p-8 text-center">
        <h1 className="font-serif text-xl font-semibold text-foreground">
          Admin is temporarily unavailable
        </h1>
        <p className="mt-2 text-sm text-muted">
          Something went wrong loading this page. Please try again in a moment.
        </p>
        <Button onClick={reset} className="mt-6 w-full">
          Try again
        </Button>
      </div>
    </div>
  );
}
