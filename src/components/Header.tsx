"use client";

import { useState } from "react";
import Link from "next/link";
import { AppNav } from "./AppNav";
import { AuthModal } from "./AuthModal";
import { useAuth } from "@/context/AuthContext";
import { LogIn, LogOut } from "lucide-react";

export function Header() {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40">
      <div className="header-bar border-b border-[var(--border)] bg-[var(--header-bg)] text-[var(--header-fg)] shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="group inline-flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            aria-label="Clueless – Home"
          >
            <span className="font-heading text-xl font-extrabold tracking-tight text-[var(--header-fg)] transition-colors group-hover:text-[var(--primary)] sm:text-2xl">
              Clueless
            </span>
            <span
              className="mt-1 h-0.5 w-6 rounded-full bg-[var(--primary)] opacity-80 transition-all group-hover:w-10 group-hover:opacity-100"
              aria-hidden
            />
          </Link>
          <div className="flex items-center gap-3">
            <AppNav />
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2 border-l border-[var(--border)] pl-3">
                    <span className="max-w-[120px] truncate text-sm text-[var(--header-muted)] md:max-w-[180px]" title={user.email ?? undefined}>
                      {user.email}
                    </span>
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-[var(--header-muted)] transition-colors hover:bg-white/10 hover:text-[var(--header-fg)]"
                      aria-label="Sign out"
                    >
                      <LogOut className="h-4 w-4" aria-hidden />
                      <span className="hidden sm:inline">Log out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuthOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--header-muted)] transition-colors hover:bg-white/10 hover:text-[var(--header-fg)]"
                    aria-label="Sign in"
                  >
                    <LogIn className="h-4 w-4" aria-hidden />
                    <span className="hidden sm:inline">Log in</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
