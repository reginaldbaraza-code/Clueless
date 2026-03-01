"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClueless } from "@/context/CluelessContext";
import type { WardrobeItem, ClothingCategory, Seasonality, Formality } from "@/types/wardrobe";

const CATEGORY_LABELS: Record<WardrobeItem["category"], string> = {
  top: "Tops",
  bottom: "Bottoms",
  outerwear: "Outerwear",
  shoes: "Shoes",
  accessory: "Accessories",
  dress: "Dresses",
  "one-piece": "One-piece",
};

const SEASONALITY_OPTIONS: Seasonality[] = ["all-season", "summer", "spring", "fall", "winter"];
const FORMALITY_OPTIONS: Formality[] = ["casual", "smart-casual", "business", "formal", "athletic"];

export default function ClosetPage() {
  const { items, addItem, removeItem } = useClueless();
  const [filter, setFilter] = useState<WardrobeItem["category"] | "all">("all");
  const [showAdd, setShowAdd] = useState(false);
  const filtered =
    filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-50">
            My closet
          </h1>
          <p className="mt-1 text-stone-600 dark:text-stone-400">
            Your pieces are saved locally. Add or remove items anytime.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="shrink-0 rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
        >
          + Add item
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", ...(Object.keys(CATEGORY_LABELS) as WardrobeItem["category"][])] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === cat
                ? "bg-amber-600 text-white dark:bg-amber-500"
                : "bg-amber-100/80 text-amber-900 hover:bg-amber-200/80 dark:bg-amber-900/40 dark:text-amber-100 dark:hover:bg-amber-800/60"
            }`}
          >
            {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <motion.ul
        layout
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: Math.min(i * 0.03, 0.15) }}
              className="group relative overflow-hidden rounded-xl border border-amber-200/60 bg-white shadow-sm dark:bg-stone-900/50 dark:border-amber-800/60"
            >
              <div className="aspect-square flex items-center justify-center bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500">
                <span className="text-4xl">👕</span>
              </div>
              <div className="p-3">
                <p className="font-medium text-stone-900 dark:text-stone-100 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {CATEGORY_LABELS[item.category]} · {item.formality}
                </p>
                {item.wearCount != null && item.wearCount > 0 && (
                  <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                    Worn {item.wearCount}×
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
                aria-label={`Remove ${item.name}`}
              >
                ✕
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {showAdd && (
          <AddItemModal
            onClose={() => setShowAdd(false)}
            onAdd={(data) => {
              addItem(data);
              setShowAdd(false);
            }}
          />
        )}
      </AnimatePresence>

      {items.length === 0 && (
        <p className="text-center text-stone-500 dark:text-stone-400">
          No items yet. Add your first piece above.
        </p>
      )}
    </div>
  );
}

function AddItemModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (data: Omit<WardrobeItem, "id" | "createdAt" | "updatedAt">) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClothingCategory>("top");
  const [formality, setFormality] = useState<Formality>("casual");
  const [seasonality, setSeasonality] = useState<Seasonality>("all-season");
  const [waterproof, setWaterproof] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      category,
      imageUrl: "",
      colors: [],
      seasonality,
      formality,
      waterproof: category === "shoes" ? waterproof : undefined,
      tags: [],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-stone-900"
      >
        <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
          Add item
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. White cotton tee"
              className="mt-1 w-full rounded-lg border border-amber-200/80 bg-white px-3 py-2 text-stone-900 placeholder-stone-400 dark:border-amber-800 dark:bg-stone-800 dark:text-stone-100"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ClothingCategory)}
              className="mt-1 w-full rounded-lg border border-amber-200/80 bg-white px-3 py-2 text-stone-900 dark:border-amber-800 dark:bg-stone-800 dark:text-stone-100"
            >
              {(Object.keys(CATEGORY_LABELS) as ClothingCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              Formality
            </label>
            <select
              value={formality}
              onChange={(e) => setFormality(e.target.value as Formality)}
              className="mt-1 w-full rounded-lg border border-amber-200/80 bg-white px-3 py-2 text-stone-900 dark:border-amber-800 dark:bg-stone-800 dark:text-stone-100"
            >
              {FORMALITY_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              Season
            </label>
            <select
              value={seasonality}
              onChange={(e) => setSeasonality(e.target.value as Seasonality)}
              className="mt-1 w-full rounded-lg border border-amber-200/80 bg-white px-3 py-2 text-stone-900 dark:border-amber-800 dark:bg-stone-800 dark:text-stone-100"
            >
              {SEASONALITY_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          {category === "shoes" && (
            <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
              <input
                type="checkbox"
                checked={waterproof}
                onChange={(e) => setWaterproof(e.target.checked)}
                className="rounded border-amber-300 text-amber-600"
              />
              Waterproof (for rain suggestions)
            </label>
          )}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-amber-200 bg-transparent px-4 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-50 dark:border-amber-800 dark:text-amber-100 dark:hover:bg-amber-900/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-50 dark:bg-amber-500 dark:hover:bg-amber-600"
            >
              Add
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
