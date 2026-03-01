"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-plaid-subtle rounded-2xl border border-amber-200/60 p-8 md:p-12"
      >
        <p className="text-sm font-medium uppercase tracking-wider text-amber-800 dark:text-amber-200">
          As if!
        </p>
        <h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-amber-900 dark:text-amber-50 sm:text-4xl">
          Your digital closet. Weather-aware. Style-driven.
        </h1>
        <p className="mt-4 max-w-xl text-stone-600 dark:text-stone-400">
          Build outfits, get daily picks, and never be clueless about what to wear—rain, meetings, or weekend plans.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/closet"
            className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
          >
            Open my closet
          </Link>
          <Link
            href="/recommendations"
            className="rounded-full border border-amber-300 bg-transparent px-5 py-2.5 text-sm font-medium text-amber-900 transition hover:bg-amber-50 dark:border-amber-600 dark:text-amber-100 dark:hover:bg-amber-900/40"
          >
            Get recommendations
          </Link>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {[
          {
            title: "Digital closet",
            description: "Upload pieces, tag with AI, and see everything in one place.",
            href: "/closet",
          },
          {
            title: "Outfit builder",
            description: "Drag and drop to mix and match. Save your best looks.",
            href: "/outfit-builder",
          },
          {
            title: "Smart recommendations",
            description: "Weather, calendar, and event-based outfit suggestions.",
            href: "/recommendations",
          },
          {
            title: "Style quiz",
            description: "Set your aesthetic and preferences for better picks.",
            href: "/style-quiz",
          },
        ].map((card, i) => (
          <Link
            key={card.href}
            href={card.href}
            className="group block rounded-xl border border-amber-200/60 bg-white p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md dark:bg-stone-900/50 dark:border-amber-800/60 dark:hover:border-amber-700"
          >
            <h2 className="font-semibold text-amber-900 dark:text-amber-100">
              {card.title}
            </h2>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              {card.description}
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-amber-700 group-hover:underline dark:text-amber-300">
              Go →
            </span>
          </Link>
        ))}
      </motion.section>
    </div>
  );
}
