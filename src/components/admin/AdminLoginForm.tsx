"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { signInAdmin } from "@/server/admin-actions";
import { AlertIcon } from "@/components/enquiry/icons";

const inputClasses =
  "w-full rounded-lg border border-card-border bg-card px-4 py-3 text-base text-foreground " +
  "placeholder:text-muted/70 transition-colors duration-150 hover:border-foreground/30 " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function AdminLoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await signInAdmin(formData);
      if (result && !result.ok) {
        setError(result.error);
        setIsSubmitting(false);
      }
      // On success, signInAdmin redirects server-side and never returns.
    } catch {
      setError("Something went wrong signing in. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClasses}
          aria-describedby={error ? "admin-login-error" : undefined}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClasses}
          aria-describedby={error ? "admin-login-error" : undefined}
        />
      </div>

      {error && (
        <p
          id="admin-login-error"
          role="alert"
          className="flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger"
        >
          <AlertIcon className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="w-full">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
