"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClueless } from "@/context/CluelessContext";
import { ItemImage } from "@/components/ItemImage";
import { Modal, ModalContent } from "@/components/Modal";
import { EmptyState } from "@/components/EmptyState";
import { Plus, X, LayoutGrid, Shirt, Box, Layers, Footprints, Gem, Sparkles } from "lucide-react";
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

const CATEGORY_ICONS: Record<WardrobeItem["category"] | "all", typeof Shirt> = {
  all: LayoutGrid,
  top: Shirt,
  bottom: Box,
  outerwear: Layers,
  shoes: Footprints,
  accessory: Gem,
  dress: Sparkles,
  "one-piece": Shirt,
};

const SEASONALITY_OPTIONS: Seasonality[] = ["all-season", "summer", "spring", "fall", "winter"];
const FORMALITY_OPTIONS: Formality[] = ["casual", "smart-casual", "business", "formal", "athletic"];

export default function ClosetPage() {
  const { items, addItem, removeItem } = useClueless();
  const [filter, setFilter] = useState<WardrobeItem["category"] | "all">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const filtered =
    filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading flex items-center gap-2 text-2xl font-bold text-[var(--foreground)]">
            <Shirt className="h-7 w-7 shrink-0 text-[var(--primary)]" />
            My closet
          </h1>
          <p className="mt-1 text-[var(--text-muted)]">
            Your pieces are saved locally. Add or remove items anytime.
          </p>
        </div>
        <button type="button" onClick={() => setShowAdd(true)} className="btn-primary inline-flex shrink-0 items-center gap-2">
          <Plus className="h-4 w-4 shrink-0" />
          Add item
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
        {(["all", ...(Object.keys(CATEGORY_LABELS) as WardrobeItem["category"][])] as const).map((cat) => {
          const Icon = CATEGORY_ICONS[cat];
          return (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition ${
              filter === cat
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--primary-muted)] text-[var(--primary)] hover:bg-[var(--primary-muted)]/80"
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
          </button>
          );
        })}
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
              className="card group relative overflow-hidden"
            >
              <div className="aspect-square overflow-hidden bg-[var(--surface-muted)]">
                <ItemImage item={item} size="card" />
              </div>
              <div className="p-3">
                <p className="font-medium text-[var(--foreground)] truncate">
                  {item.name}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {CATEGORY_LABELS[item.category]} · {item.formality}
                </p>
                {item.wearCount != null && item.wearCount > 0 && (
                  <p className="mt-1 text-xs text-[var(--primary)]">
                    Worn {item.wearCount}×
                  </p>
                )}
                {item.purchasePrice != null && item.purchasePrice > 0 && item.wearCount != null && item.wearCount > 0 && (
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                    ${(item.purchasePrice / item.wearCount).toFixed(1)}/wear
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setRemovingId(item.id)}
                className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100"
                aria-label={`Remove ${item.name}`}
              >
                <X className="h-4 w-4" />
              </button>
              {removingId === item.id && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 rounded-[var(--radius-card)] p-3">
                  <p className="text-center text-sm font-medium text-white">Remove {item.name}?</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={(e) => { e.stopPropagation(); setRemovingId(null); }} className="rounded-full bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)]">Cancel</button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeItem(item.id); setRemovingId(null); }} className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white">Remove</button>
                  </div>
                </div>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {showAdd && (
          <AddItemModal
            isOpen={showAdd}
            onClose={() => setShowAdd(false)}
            onAdd={(data) => {
              addItem(data);
              setShowAdd(false);
            }}
          />
        )}
      </AnimatePresence>

      {items.length === 0 && (
        <EmptyState
          icon={Shirt}
          title="Your closet is empty"
          description="Add your first piece to start building outfits and getting daily picks."
          action={{ label: "Add item", onClick: () => setShowAdd(true) }}
        />
      )}
    </div>
  );
}

function AddItemModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: Omit<WardrobeItem, "id" | "createdAt" | "updatedAt">) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClothingCategory>("top");
  const [imageUrl, setImageUrl] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [formality, setFormality] = useState<Formality>("casual");
  const [seasonality, setSeasonality] = useState<Seasonality>("all-season");
  const [waterproof, setWaterproof] = useState(false);
  const [nameError, setNameError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Name is required");
      return;
    }
    setNameError("");
    onAdd({
      name: name.trim(),
      category,
      imageUrl: imageUrl.trim(),
      colors: [],
      seasonality,
      formality,
      waterproof: category === "shoes" ? waterproof : undefined,
      tags: [],
      purchasePrice: purchasePrice.trim() ? parseFloat(purchasePrice) : undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} titleId="add-item-title">
      <ModalContent className="w-full max-w-md p-6">
        <h2 id="add-item-title" className="font-heading text-lg font-semibold text-[var(--foreground)]">
          Add item
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(""); }}
              placeholder="e.g. White cotton tee"
              className={`mt-1.5 input-base ${nameError ? "input-error" : ""}`}
              autoFocus
              aria-invalid={!!nameError}
              aria-describedby={nameError ? "name-error" : undefined}
            />
            {nameError && <p id="name-error" className="mt-1.5 text-sm text-red-600">{nameError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Image URL <span className="text-[var(--text-muted)] font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://… paste a link to a photo"
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--foreground)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Purchase price <span className="text-[var(--text-muted)] font-normal">(optional, for cost-per-wear)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="e.g. 49.00"
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--foreground)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ClothingCategory)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            >
              {(Object.keys(CATEGORY_LABELS) as ClothingCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Formality
            </label>
            <select
              value={formality}
              onChange={(e) => setFormality(e.target.value as Formality)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            >
              {FORMALITY_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Season
            </label>
            <select
              value={seasonality}
              onChange={(e) => setSeasonality(e.target.value as Seasonality)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            >
              {SEASONALITY_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          {category === "shoes" && (
            <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <input
                type="checkbox"
                checked={waterproof}
                onChange={(e) => setWaterproof(e.target.checked)}
                className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              Waterproof (for rain suggestions)
            </label>
          )}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex flex-1 items-center justify-center gap-2">
              <X className="h-4 w-4 shrink-0" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="btn-primary flex flex-1 items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus className="h-4 w-4 shrink-0" />
              Add
            </button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
