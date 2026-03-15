"use client";

import Link from "next/link";
import { AppNav } from "./AppNav";
import { AuthModal } from "./AuthModal";
import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/context/AuthModalContext";
import { LogOut } from "lucide-react";

export function Header() {
  const { isOpen: authOpen, openModal: setAuthOpen, closeModal: closeAuthModal } = useAuthModal();
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight text-[var(--foreground)] transition-colors hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
          aria-label="Clueless – Home"
        >
          Clueless
        </Link>
        <div className="flex items-center gap-4">
          <AppNav />
          {!loading && (
            <>
              {user ? (
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="hidden rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] sm:block"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={setAuthOpen}
                  className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)] sm:block"
                  aria-label="Sign in"
                >
                  Log in
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <AuthModal isOpen={authOpen} onClose={closeAuthModal} />
    </header>
  );
}
