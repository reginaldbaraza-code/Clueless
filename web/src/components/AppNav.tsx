"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/closet", label: "Closet" },
  { href: "/outfit-builder", label: "Outfit Builder" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/style-quiz", label: "Style Quiz" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-amber-200/60 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80 md:static md:bottom-auto md:border-0 md:bg-transparent">
      <ul className="flex justify-around gap-1 py-2 md:justify-start md:gap-6 md:py-0">
        {navItems.map(({ href, label }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                className={`relative block px-3 py-2 text-sm font-medium transition-colors md:px-0 md:py-4 ${
                  isActive ? "text-amber-900" : "text-stone-600 hover:text-amber-800"
                }`}
              >
                {label}
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-amber-100/80 md:rounded-md"
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
