"use client";

import Link from "next/link";
import { AppNav } from "./AppNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40">
      {/* Full-width dark band */}
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
          <AppNav />
        </div>
      </div>
    </header>
  );
}
