"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClueless } from "@/context/CluelessContext";
import { ItemImage } from "@/components/ItemImage";
import { Modal, ModalContent } from "@/components/Modal";
import { EmptyState } from "@/components/EmptyState";
import { Plus, X, LayoutGrid, Shirt, Box, Layers, Footprints, Gem, Sparkles, Search } from "lucide-react";
import type { ProductSearchResult } from "@/app/api/product-search/route";
import type { WardrobeItem, ClothingCategory, Seasonality, Formality } from "@/types/wardrobe";
import { normalizeCategory, CATEGORY_VALUES } from "@/types/wardrobe";

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
  const [addedToast, setAddedToast] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const normalizedFilter = filter === "all" ? "all" : normalizeCategory(filter);
  const filtered =
    filter === "all" ? items : items.filter((i) => normalizeCategory(i.category) === normalizedFilter);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
            Closet
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Your pieces. Add or remove anytime.
          </p>
        </div>
        <button
          ref={addButtonRef}
          type="button"
          onClick={() => setShowAdd(true)}
          className="btn-primary inline-flex shrink-0 items-center gap-2"
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden />
          Add item
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible" role="tablist" aria-label="Filter by category">
        {(["all", ...CATEGORY_VALUES] as const).map((cat) => {
          const Icon = CATEGORY_ICONS[cat];
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={filter === cat}
              onClick={() => setFilter(cat)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                filter === cat
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface-muted)] text-[var(--foreground)] hover:bg-[var(--border)]"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>

      {items.length > 0 && (
        filtered.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-muted)]/50 p-8 text-center">
            <p className="text-[var(--text-muted)]">No items in this category yet.</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={() => setFilter("all")} className="btn-secondary text-sm">
                View all
              </button>
              <button type="button" onClick={() => setShowAdd(true)} className="btn-primary text-sm">
                Add item
              </button>
            </div>
          </div>
        ) : (
      <motion.ul
        layout
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4"
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
              className="card group relative overflow-hidden rounded-[var(--radius-card)]"
            >
              <div className="aspect-square overflow-hidden rounded-t-[var(--radius-card)] bg-[var(--surface-muted)]">
                <ItemImage item={item} size="card" />
              </div>
              <div className="p-3">
                <p className="font-medium text-[var(--foreground)] truncate">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                  {CATEGORY_LABELS[item.category]}
                  {item.wearCount != null && item.wearCount > 0 && (
                    <> · Worn {item.wearCount}×</>
                  )}
                </p>
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
        )
      )}

      {addedToast && (
        <div
          role="status"
          className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-lg bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--surface)] shadow-lg"
        >
          Item added
        </div>
      )}

      <AnimatePresence>
        {showAdd && (
          <AddItemModal
            isOpen={showAdd}
            onClose={() => setShowAdd(false)}
            focusReturnRef={addButtonRef}
            onAdd={(data) => {
              addItem(data);
              setShowAdd(false);
              setAddedToast(true);
              setTimeout(() => setAddedToast(false), 2500);
              addButtonRef.current?.focus();
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

/** Best-effort category hint from product title */
function inferCategoryFromTitle(title: string): ClothingCategory {
  const t = title.toLowerCase();
  if (/\b(shoes|sneakers|boots|heels|sandals|loafers)\b/.test(t)) return "shoes";
  if (/\b(dress|dresses)\b/.test(t)) return "dress";
  if (/\b(jacket|coat|blazer|vest|outerwear)\b/.test(t)) return "outerwear";
  if (/\b(pants|jeans|trousers|chinos|shorts|skirt)\b/.test(t)) return "bottom";
  if (/\b(bag|hat|scarf|belt|accessory)\b/.test(t)) return "accessory";
  if (/\b(jumpsuit|romper|one-piece)\b/.test(t)) return "one-piece";
  return "top";
}

function AddItemModal({
  isOpen,
  onClose,
  onAdd,
  focusReturnRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: Omit<WardrobeItem, "id" | "createdAt" | "updatedAt">) => void;
  focusReturnRef?: React.RefObject<HTMLElement | null>;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClothingCategory>("top");
  const [imageUrl, setImageUrl] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [formality, setFormality] = useState<Formality>("casual");
  const [seasonality, setSeasonality] = useState<Seasonality>("all-season");
  const [waterproof, setWaterproof] = useState(false);
  const [nameError, setNameError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);
  const [searchStatus, setSearchStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [searchError, setSearchError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setCategory("top");
    setImageUrl("");
    setPurchasePrice("");
    setFormality("casual");
    setSeasonality("all-season");
    setWaterproof(false);
    setNameError("");
    setSearchQuery("");
    setSearchResults([]);
    setSearchStatus("idle");
    setSearchError(null);
  };

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

  const handleProductSearch = async () => {
    const q = searchQuery.trim();
    if (q.length < 2) return;
    setSearchStatus("loading");
    setSearchError(null);
    setSearchResults([]);
    try {
      const res = await fetch(`/api/product-search?q=${encodeURIComponent(q)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.error || "Search failed.";
        setSearchError(
          res.status === 503 && msg.toLowerCase().includes("serpapi")
            ? "Product search isn’t set up. Add your item manually below."
            : msg
        );
        setSearchStatus("error");
        return;
      }
      setSearchResults(data.results ?? []);
      setSearchStatus("done");
    } catch {
      setSearchError("Search request failed.");
      setSearchStatus("error");
    }
  };

  const handlePickProduct = (product: ProductSearchResult) => {
    setName(product.title);
    setImageUrl(product.thumbnail);
    setCategory(inferCategoryFromTitle(product.title));
    setSearchResults([]);
    setSearchStatus("idle");
    setSearchQuery("");
  };

  useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} titleId="add-item-title" focusReturnRef={focusReturnRef}>
      <ModalContent className="w-full max-w-md p-6">
        <h2 id="add-item-title" className="font-heading text-lg font-semibold text-[var(--foreground)]">
          Add item
        </h2>

        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]/50 p-3">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Search for a product</p>
          <p className="mt-0.5 text-sm text-[var(--text-muted)]">Find the exact item and we’ll fill name + photo.</p>
          <div className="mt-2 flex gap-2">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchError(null); }}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleProductSearch())}
              placeholder="e.g. navy blazer, white sneakers"
              className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              aria-label="Product search"
            />
            <button
              type="button"
              onClick={handleProductSearch}
              disabled={searchStatus === "loading" || searchQuery.trim().length < 2}
              className="btn-primary inline-flex shrink-0 items-center gap-1.5 px-3 py-2 text-sm disabled:opacity-50"
            >
              {searchStatus === "loading" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
              ) : (
                <Search className="h-4 w-4 shrink-0" aria-hidden />
              )}
              Search
            </button>
          </div>
          {searchError && <p className="mt-2 text-sm text-red-600">{searchError}</p>}
          {searchResults.length > 0 && (
            <div className="mt-3 max-h-48 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
              <p className="mb-2 text-xs text-[var(--text-muted)]">Tap one to use its name and photo</p>
              <div className="grid grid-cols-3 gap-2">
                {searchResults.map((product, idx) => (
                  <button
                    key={`${product.thumbnail}-${idx}`}
                    type="button"
                    onClick={() => handlePickProduct(product)}
                    className="flex flex-col items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]/50 p-1.5 text-left transition hover:border-[var(--primary)] hover:bg-[var(--primary-muted)]/30"
                  >
                    <img
                      src={product.thumbnail}
                      alt=""
                      width={80}
                      height={80}
                      className="h-16 w-16 shrink-0 rounded object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="line-clamp-2 w-full text-xs font-medium text-[var(--foreground)]">{product.title}</span>
                    {product.price && <span className="w-full text-xs text-[var(--text-muted)]">{product.price}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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
{CATEGORY_VALUES.map((cat) => (
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
