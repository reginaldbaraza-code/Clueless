"use client";

import { useState, useRef, useEffect } from "react";
import { Bug, Shuffle, Shirt } from "lucide-react";
import { useClueless } from "@/context/CluelessContext";
import { SEED_WARDROBE, randomOutfitItemIds } from "@/lib/seed-data";

export function DebugFloater() {
  const [open, setOpen] = useState(false);
  const { addItem, addOutfit, items, outfits, hydrated } = useClueless();
  const menuRef = useRef<HTMLDivElement>(null);

  // Use mousedown so the menu doesn’t close before the button’s click handler runs
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const [addedFeedback, setAddedFeedback] = useState<"item" | "outfit" | null>(null);
  const handleAddRandomItem = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hydrated || SEED_WARDROBE.length === 0) return;
    const seed = SEED_WARDROBE[Math.floor(Math.random() * SEED_WARDROBE.length)];
    addItem({
      name: seed.name,
      category: seed.category,
      imageUrl: seed.imageUrl,
      colors: seed.colors ?? [],
      fabric: seed.fabric,
      seasonality: seed.seasonality,
      formality: seed.formality,
      waterproof: seed.waterproof,
      tags: seed.tags ?? [],
    });
    setAddedFeedback("item");
    setTimeout(() => setAddedFeedback(null), 2000);
    setOpen(false);
  };

  const handleAddRandomOutfit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hydrated || items.length === 0) return;
    const ids = randomOutfitItemIds(items);
    if (ids.length > 0) {
      addOutfit(ids, `Random look ${outfits.length + 1}`);
      setAddedFeedback("outfit");
      setTimeout(() => setAddedFeedback(null), 2000);
    }
    setOpen(false);
  };

  return (
    <div className="fixed bottom-20 left-4 z-50 md:bottom-6" ref={menuRef}>
      {open && (
        <div className="absolute bottom-full left-0 mb-2 min-w-[180px] rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg">
          <button
            type="button"
            onClick={handleAddRandomItem}
            disabled={!hydrated}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)] disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <Shuffle className="h-4 w-4 shrink-0" aria-hidden />
            Add random item
          </button>
          <button
            type="button"
            onClick={handleAddRandomOutfit}
            disabled={!hydrated || items.length === 0}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)] disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <Shirt className="h-4 w-4 shrink-0" aria-hidden />
            Add random outfit
          </button>
        </div>
      )}
      {addedFeedback === "item" && (
        <div className="absolute bottom-full left-0 mb-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] shadow-lg">
          Item added. See Closet.
        </div>
      )}
      {addedFeedback === "outfit" && (
        <div className="absolute bottom-full left-0 mb-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] shadow-lg">
          Outfit added. See Outfits page.
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] shadow-md transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
        aria-label="Debug menu"
      >
        <Bug className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}
