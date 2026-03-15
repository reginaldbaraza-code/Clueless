"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Primary CTA: { label, href } or { label, onClick } */
  action?: { label: string; href: string } | { label: string; onClick: () => void };
  /** Optional secondary link */
  secondary?: { label: string; href: string };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondary,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-muted)]/50 p-8 text-center ${className}`}
      role="status"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-muted)] text-[var(--primary)]">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="font-heading mt-5 text-lg font-semibold text-[var(--foreground)]">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-[var(--text-muted)]">
        {description}
      </p>
      {(action || secondary) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action &&
            ("href" in action ? (
              <Link href={action.href} className="btn-primary inline-flex items-center gap-2">
                {action.label}
              </Link>
            ) : (
              <button type="button" onClick={action.onClick} className="btn-primary inline-flex items-center gap-2">
                {action.label}
              </button>
            ))}
          {secondary && (
            <Link
              href={secondary.href}
              className="text-sm font-medium text-[var(--primary)] hover:underline"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
