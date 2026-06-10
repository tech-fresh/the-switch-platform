"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import type { AuthProvider, SignInOption } from "@/modules/auth/types";

interface AccountAuthControlsProps {
  isAuthenticated: boolean;
  signInOptions: SignInOption[];
}

export function AccountAuthControls({
  isAuthenticated,
  signInOptions,
}: AccountAuthControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function signIn(provider: AuthProvider) {
    startTransition(async () => {
      await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider,
        }),
      });

      router.refresh();
    });
  }

  function signOut() {
    startTransition(async () => {
      await fetch("/api/auth/session", {
        method: "DELETE",
      });

      router.refresh();
    });
  }

  if (isAuthenticated) {
    return (
      <button
        type="button"
        onClick={signOut}
        disabled={isPending}
        className="border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing out..." : "Sign out"}
      </button>
    );
  }

  return (
    <div className="grid gap-3">
      {signInOptions.map((option) => (
        <button
          key={option.provider}
          type="button"
          onClick={() => signIn(option.provider)}
          disabled={isPending}
          className="border border-stone-300 bg-white px-4 py-3 text-left transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <p className="text-sm font-semibold text-stone-950">
            {isPending ? "Signing in..." : `Sign in with ${option.label}`}
          </p>
          <p className="mt-1 text-sm leading-6 text-stone-600">{option.description}</p>
        </button>
      ))}
    </div>
  );
}
