"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useClueless } from "@/context/CluelessContext";
import { ItemImage } from "@/components/ItemImage";
import { LookCard } from "@/components/LookCard";
import { Modal, ModalContent } from "@/components/Modal";
import { EmptyState } from "@/components/EmptyState";
import { Star, X, Download, Trash2, Bookmark } from "lucide-react";
import type { Outfit } from "@/types/wardrobe";

export default function OutfitsPage() {
  const { outfits, items, rateOutfit, removeOutfit } = useClueless();
  const [ratingId, setRatingId] = useState<string | null>(null);
  const [shareOutfitId, setShareOutfitId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const getItemsForOutfit = (outfit: Outfit) =>
    outfit.itemIds
      .map((id) => items.find((i) => i.id === id))
      .filter(Boolean) as typeof items;

  const handleRate = (outfitId: string, rating: number) => {
    rateOutfit(outfitId, rating);
    setRatingId(null);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
          Outfits
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Saved looks. Rate to improve recommendations.
        </p>
      </div>

      {outfits.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved outfits yet"
          description="Build an outfit in Outfit Builder and tap Save outfit. Your looks will show up here so you can rate and share them."
          action={{ label: "Outfit builder", href: "/outfit-builder" }}
        />
      ) : (
        <ul className="space-y-6">
          {outfits.map((outfit) => {
            const outfitItems = getItemsForOutfit(outfit);
            const missingCount = outfit.itemIds.length - outfitItems.length;
            return (
              <motion.li
                key={outfit.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="card overflow-hidden p-4"
              >
                {missingCount > 0 && (
                  <p className="mb-2 text-xs text-[var(--text-muted)]">
                    {missingCount} item{missingCount > 1 ? "s" : ""} no longer in closet
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  {outfitItems.map((item) => (
                    <span key={item.id} className="flex max-w-full items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)]/50 py-1 pl-1 pr-2">
                      <ItemImage item={item} size="small" />
                      <span className="min-w-0 truncate text-sm font-medium text-[var(--foreground)]">{item.name}</span>
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                  <div className="flex items-center gap-2">
                    {ratingId === outfit.id ? (
                      <>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => handleRate(outfit.id, r)}
                            className="rounded p-1 text-lg leading-none transition hover:scale-110"
                            aria-label={`Rate ${r} stars`}
                          >
                            {r <= (outfit.rating ?? 0) ? <Star className="h-5 w-5 fill-current" /> : <Star className="h-5 w-5" />}
                          </button>
                        ))}
                        <button type="button" onClick={() => setRatingId(null)} className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                          <X className="h-3.5 w-3.5" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => setRatingId(outfit.id)} className="flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline">
                        {outfit.rating ? <Star className="h-4 w-4 fill-current" /> : <Star className="h-4 w-4" />}
                        {outfit.rating ? `${outfit.rating}/5 – Change` : "Rate this look"}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setShareOutfitId(outfit.id)} className="flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline">
                      <Download className="h-4 w-4 shrink-0" />
                      Download card
                    </button>
                    {removingId === outfit.id ? (
                      <span className="flex items-center gap-2 text-sm">
                        <span className="text-[var(--text-muted)]">Remove this outfit?</span>
                        <button type="button" onClick={() => setRemovingId(null)} className="font-medium text-[var(--foreground)] hover:underline">Cancel</button>
                        <button type="button" onClick={() => { removeOutfit(outfit.id); setRemovingId(null); }} className="font-medium text-red-600 hover:underline">Remove</button>
                      </span>
                    ) : (
                      <button type="button" onClick={() => setRemovingId(outfit.id)} className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-red-600">
                        <Trash2 className="h-4 w-4 shrink-0" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}

      {shareOutfitId && (() => {
        const outfit = outfits.find((o) => o.id === shareOutfitId);
        const outfitItems = outfit ? getItemsForOutfit(outfit) : [];
        return (
          <Modal isOpen={!!shareOutfitId} onClose={() => setShareOutfitId(null)}>
            <ModalContent className="p-6">
              <LookCard items={outfitItems} title={outfit?.name ?? "My look"} showDownload />
              <button type="button" onClick={() => setShareOutfitId(null)} className="mt-3 flex w-full items-center justify-center gap-2 text-sm text-[var(--text-muted)] hover:underline">
                <X className="h-4 w-4 shrink-0" />
                Close
              </button>
            </ModalContent>
          </Modal>
        );
      })()}
    </div>
  );
}
