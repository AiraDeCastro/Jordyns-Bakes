"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle" };

const inputClasses =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent-deep focus:outline-none";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.status === "error" && state.message && (
        <p className="rounded-lg bg-accent-tint px-4 py-3 text-sm text-accent-deep">
          {state.message}
        </p>
      )}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-heading">Email</span>
        <input type="email" name="email" required autoComplete="email" className={inputClasses} />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-heading">Password</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className={inputClasses}
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-accent-deep px-6 py-3 text-sm font-semibold text-surface transition-colors hover:bg-accent disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
