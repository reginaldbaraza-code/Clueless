"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useClueless } from "@/context/CluelessContext";
import { ItemImage } from "@/components/ItemImage";
import { EmptyState } from "@/components/EmptyState";
import { Shirt, Sparkles, X, LayoutTemplate } from "lucide-react";
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
        <h1 className="font-heading flex items-center gap-2 text-2xl font-bold text-[var(--foreground)]">
          <LayoutTemplate className="h-7 w-7 shrink-0 text-[var(--primary)]" />
          Outfit builder
        </h1>
        <p className="mt-1 text-[var(--text-muted)]">
          Build an outfit from your closet. Save to record the look and count wears.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Your outfit
          </h2>
          <div className="card space-y-4 p-6">
            {SLOTS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-24 text-sm text-[var(--text-muted)]">
                  {label}
                </span>
                <div className="min-h-[56px] flex-1 rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)]/50 p-2">
                  {outfit[key] ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3 rounded-lg bg-[var(--surface)] px-3 py-2 shadow-[var(--shadow-sm)]"
                    >
                      <ItemImage item={outfit[key]!} size="thumb" />
                      <span className="min-w-0 flex-1 font-medium text-[var(--foreground)] truncate">
                        {outfit[key]!.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => clearSlot(key)}
                        className="shrink-0 text-[var(--text-muted)] hover:text-[var(--primary)]"
                        aria-label={`Remove ${outfit[key]!.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <span className="text-sm text-[var(--text-muted)]">
                      Tap an item below
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {saved && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex flex-wrap items-center gap-2 rounded-full bg-[var(--primary-muted)] px-4 py-2 text-sm font-medium text-[var(--primary)]"
            >
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
              Outfit saved. Wear counts updated.
              <Link href="/outfits" className="font-semibold underline hover:no-underline">
                View in Outfits
              </Link>
            </motion.p>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="btn-primary mt-4 inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            Save outfit
          </button>
        </section>
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Closet items
          </h2>
          {items.length === 0 ? (
            <EmptyState
              icon={Shirt}
              title="No items in your closet"
              description="Add tops, bottoms, and shoes in your closet first. Then come back to build an outfit."
              action={{ label: "Open closet", href: "/closet" }}
            />
          ) : (
            <div className="space-y-6">
              {SLOTS.map(({ key, label }) => (
                <div key={key}>
                  <p className="mb-2 text-sm font-medium text-[var(--foreground)]">
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
                        className="flex min-w-0 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-left text-sm font-medium text-[var(--primary)] shadow-[var(--shadow-sm)] transition hover:border-[var(--primary)] hover:bg-[var(--primary-muted)]/50"
                      >
                        <ItemImage item={item} size="small" />
                        <span className="min-w-0 truncate">{item.name}</span>
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
        <Link href="/try-on" className="btn-primary inline-flex items-center gap-2">
          <Shirt className="h-4 w-4 shrink-0" />
          Virtual try-on
        </Link>
        <Link href="/recommendations" className="btn-primary inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0" />
          Get suggestions
        </Link>
      </div>
    </div>
  );
}
