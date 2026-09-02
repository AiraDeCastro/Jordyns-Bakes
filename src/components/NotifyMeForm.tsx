"use client";

import { useActionState } from "react";
import { subscribeToNotify, type NotifySignupState } from "@/app/order/actions";

const initialState: NotifySignupState = { status: "idle" };

export function NotifyMeForm() {
  const [state, formAction, isPending] = useActionState(subscribeToNotify, initialState);

  if (state.status === "success") {
    return <p className="text-sm text-accent-deep">You&apos;re on the list — thanks!</p>;
  }

  return (
    <form action={formAction} className="flex flex-col items-center gap-2 sm:flex-row">
      <label htmlFor="notify-email" className="sr-only">
        Email
      </label>
      <input
        id="notify-email"
        name="email"
        type="email"
        required
        placeholder="you@example.com"
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent-deep focus:outline-none focus:ring-2 focus:ring-accent-deep/30 sm:w-64"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-accent-deep px-5 py-2 text-sm font-semibold text-surface transition-colors hover:bg-accent disabled:opacity-60"
      >
        {isPending ? "Signing up…" : "Notify me"}
      </button>
      {state.status === "error" && state.message && (
        <p className="text-sm text-accent-deep">{state.message}</p>
      )}
    </form>
  );
}
