"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Home, Shirt, Bookmark, Menu } from "lucide-react";
import { PRIMARY_NAV, MORE_NAV } from "@/config/nav";

const PRIMARY_ICONS: Record<string, typeof Home> = {
  "/": Home,
  "/closet": Shirt,
  "/outfits": Bookmark,
};

function isActive(href: string, pathname: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export function AppNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [moreOpen]);

  const moreActive = MORE_NAV.some(({ href }) => isActive(href, pathname));

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--surface)]/98 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] md:static md:bottom-auto md:border-0 md:pb-0 md:bg-transparent"
      aria-label="Main navigation"
    >
      {/* Desktop: horizontal primary + More dropdown */}
      <ul className="hidden md:flex md:items-center md:gap-1">
        {PRIMARY_NAV.map(({ href, label }) => {
          const active = isActive(href, pathname);
          const Icon = PRIMARY_ICONS[href];
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--primary-muted)] text-[var(--primary)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
                {label}
              </Link>
            </li>
          );
        })}
        <li className="relative ml-1">
          <div ref={moreRef} className="relative">
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            aria-expanded={moreOpen}
            aria-haspopup="true"
            aria-label="More menu"
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              moreActive
                ? "bg-[var(--primary-muted)] text-[var(--primary)]"
                : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <Menu className="h-4 w-4 shrink-0" aria-hidden />
            More
            <ChevronDown className={`h-4 w-4 shrink-0 transition ${moreOpen ? "rotate-180" : ""}`} aria-hidden />
          </button>
          {moreOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-xl border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg"
              role="menu"
            >
              {MORE_NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  role="menuitem"
                  onClick={() => setMoreOpen(false)}
                  className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive(href, pathname)
                      ? "bg-[var(--primary-muted)] text-[var(--primary)]"
                      : "text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
          </div>
        </li>
      </ul>

      {/* Mobile: bottom bar — 5 items: 4 primary + More (links to /more) */}
      <ul className="flex justify-around py-2 md:hidden">
        {PRIMARY_NAV.map(({ href, label }) => {
          const active = isActive(href, pathname);
          const Icon = PRIMARY_ICONS[href];
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                aria-label={label}
                className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                  active ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            href="/more"
            aria-current={pathname === "/more" ? "page" : undefined}
            aria-label="More"
            className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
              moreActive || pathname === "/more" ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
            }`}
          >
            <Menu className="h-5 w-5 shrink-0" aria-hidden />
            <span>More</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
