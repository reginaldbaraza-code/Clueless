"use client";

import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/context/AuthModalContext";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { openModal } = useAuthModal();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]"
          aria-hidden
        />
        <p className="text-sm text-[var(--text-muted)]">Loading your closet…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <h2 className="font-heading text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
          Welcome to Clueless
        </h2>
        <p className="max-w-md text-[var(--text-muted)]">
          Log in to manage your closet, get daily outfit picks, and weather-aware recommendations.
        </p>
        <button
          type="button"
          onClick={openModal}
          className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          Log in
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
