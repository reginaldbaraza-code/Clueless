"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/closet", label: "Closet" },
  { href: "/outfit-builder", label: "Outfit Builder" },
  { href: "/try-on", label: "Try on" },
  { href: "/outfits", label: "Outfits" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/analytics", label: "Analytics" },
  { href: "/packing", label: "Packing" },
  { href: "/plan-week", label: "Plan Week" },
  { href: "/style-quiz", label: "Style Quiz" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:static md:bottom-auto md:border-0 md:pb-0 md:bg-transparent">
      <ul className="flex justify-around gap-1 py-3 md:justify-end md:gap-0.5 md:py-0">
        {navItems.map(({ href, label }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                className={`relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-2.5 py-2.5 text-sm font-medium transition-colors md:min-h-0 md:min-w-0 md:px-3 md:py-2 ${
                  isActive
                    ? "text-[var(--primary)] md:text-[var(--primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--foreground)] md:text-[var(--header-muted)] md:hover:text-[var(--header-fg)]"
                }`}
              >
                <span className="inline">{label}</span>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-[var(--primary-muted)] md:rounded-lg md:bg-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
