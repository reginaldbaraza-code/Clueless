"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useClueless } from "@/context/CluelessContext";
import type { WardrobeItem } from "@/types/wardrobe";

const SLOTS: { key: "top" | "bottom" | "outerwear" | "shoes"; label: string }[] = [
  { key: "top", label: "Top" },
  { key: "bottom", label: "Bottom" },
  { key: "outerwear", label: "Outerwear" },
  { key: "shoes", label: "Shoes" },
];

export default function OutfitBuilderPage() {
  const { items, addOutfit, incrementWearCount } = useClueless();
  const [outfit, setOutfit] = useState<Record<string, WardrobeItem | null>>({
    top: null,
    bottom: null,
    outerwear: null,
    shoes: null,
  });
  const [saved, setSaved] = useState(false);

  const addToSlot = (slot: string, item: WardrobeItem) => {
    setOutfit((prev) => ({ ...prev, [slot]: item }));
    setSaved(false);
  };

  const clearSlot = (slot: string) => {
    setOutfit((prev) => ({ ...prev, [slot]: null }));
    setSaved(false);
  };

  const byCategory = (cat: WardrobeItem["category"]) =>
    items.filter((i) => i.category === cat);

  const itemIds = SLOTS.map((s) => outfit[s.key]?.id).filter(Boolean) as string[];
  const canSave = itemIds.length >= 2; // at least top+bottom or top+shoes etc.

  const handleSave = () => {
    if (!canSave) return;
    addOutfit(itemIds);
    itemIds.forEach((id) => incrementWearCount(id));
    setSaved(true);
    setOutfit({ top: null, bottom: null, outerwear: null, shoes: null });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-50">
          Outfit builder
        </h1>
        <p className="mt-1 text-stone-600 dark:text-stone-400">
          Build an outfit from your closet. Save to record the look and count wears.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Your outfit
          </h2>
          <div className="space-y-4 rounded-xl border border-amber-200/60 bg-white p-6 dark:bg-stone-900/50 dark:border-amber-800/60">
            {SLOTS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-24 text-sm text-stone-500 dark:text-stone-400">
                  {label}
                </span>
                <div className="min-h-[56px] flex-1 rounded-lg border border-dashed border-amber-300/80 bg-amber-50/50 p-2 dark:border-amber-700 dark:bg-amber-900/20">
                  {outfit[key] ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm dark:bg-stone-800"
                    >
                      <span className="font-medium text-stone-900 dark:text-stone-100">
                        {outfit[key]!.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => clearSlot(key)}
                        className="text-stone-400 hover:text-amber-600 dark:hover:text-amber-400"
                        aria-label={`Remove ${outfit[key]!.name}`}
                      >
                        ✕
                      </button>
                    </motion.div>
                  ) : (
                    <span className="text-sm text-stone-400 dark:text-stone-500">
                      Tap an item below
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {saved && (
            <p className="mt-3 text-sm text-amber-700 dark:text-amber-300">
              Outfit saved. Wear counts updated.
            </p>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="mt-4 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-50 dark:bg-amber-500 dark:hover:bg-amber-600"
          >
            Save outfit
          </button>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Closet items
          </h2>
          {items.length === 0 ? (
            <p className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-6 text-stone-600 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-stone-400">
              Add items in your closet first.
            </p>
          ) : (
            <div className="space-y-6">
              {SLOTS.map(({ key, label }) => (
                <div key={key}>
                  <p className="mb-2 text-sm font-medium text-stone-700 dark:text-stone-300">
                    {label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {byCategory(key).map((item) => (
                      <motion.button
                        key={item.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addToSlot(key, item)}
                        className="rounded-lg border border-amber-200/60 bg-white px-4 py-2 text-sm font-medium text-amber-900 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 dark:border-amber-800/60 dark:bg-stone-800 dark:text-amber-100 dark:hover:bg-amber-900/30"
                      >
                        {item.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="flex gap-3">
        <Link
          href="/recommendations"
          className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
        >
          Get suggestions
        </Link>
      </div>
    </div>
  );
}
