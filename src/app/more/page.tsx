"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Lightbulb,
  LayoutTemplate,
  Shirt,
  BarChart3,
  Luggage,
  CalendarDays,
  Palette,
  ChevronRight,
} from "lucide-react";
import { MORE_NAV } from "@/config/nav";

const MORE_ICONS: Record<string, typeof Lightbulb> = {
  "/recommendations": Lightbulb,
  "/outfit-builder": LayoutTemplate,
  "/try-on": Shirt,
  "/analytics": BarChart3,
  "/packing": Luggage,
  "/plan-week": CalendarDays,
  "/style-quiz": Palette,
};

function isActive(href: string, pathname: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export default function MorePage() {
  const pathname = usePathname();

  return (
    <div className="max-w-md">
      <h1 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
        More
      </h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        Tools and settings for your wardrobe.
      </p>
      <nav aria-label="More options" className="mt-6">
        <ul className="space-y-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
          {MORE_NAV.map(({ href, label }) => {
            const active = isActive(href, pathname);
            const Icon = MORE_ICONS[href];
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3.5 text-sm font-medium last:border-b-0 transition-colors ${
                    active
                      ? "bg-[var(--primary-muted)] text-[var(--primary)]"
                      : "text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {Icon && <Icon className="h-5 w-5 shrink-0 opacity-80" aria-hidden />}
                    {label}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
