"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useClueless } from "@/context/CluelessContext";
import { Plus, RefreshCw, BarChart3, Package, TrendingDown, Palette } from "lucide-react";
import type { WardrobeItem, ClothingCategory, Formality } from "@/types/wardrobe";

const CATEGORY_LABELS: Record<ClothingCategory, string> = {
  top: "Tops",
  bottom: "Bottoms",
  outerwear: "Outerwear",
  shoes: "Shoes",
  accessory: "Accessories",
  dress: "Dresses",
  "one-piece": "One-piece",
};

const FORMALITIES: Formality[] = ["casual", "smart-casual", "business", "formal", "athletic"];

export default function AnalyticsPage() {
  const { items } = useClueless();

  const { gaps, underused, topColors } = useMemo(() => {
    const byCategory = new Map<ClothingCategory, WardrobeItem[]>();
    const byFormality = new Map<Formality, WardrobeItem[]>();
    const colorCounts = new Map<string, number>();
    const underusedItems: WardrobeItem[] = [];

    for (const item of items) {
      byCategory.set(item.category, [...(byCategory.get(item.category) ?? []), item]);
      byFormality.set(item.formality, [...(byFormality.get(item.formality) ?? []), item]);
      for (const c of item.colors) {
        if (c) colorCounts.set(c, (colorCounts.get(c) ?? 0) + (item.wearCount ?? 0) + 1);
      }
      if ((item.wearCount ?? 0) < 2) underusedItems.push(item);
    }

    const gaps: string[] = [];
    const categories: ClothingCategory[] = ["top", "bottom", "outerwear", "shoes"];
    for (const cat of categories) {
      if (!(byCategory.get(cat)?.length ?? 0)) gaps.push(`No ${CATEGORY_LABELS[cat].toLowerCase()}`);
    }
    if (!(byFormality.get("formal")?.length ?? 0) && !(byFormality.get("business")?.length ?? 0)) {
      gaps.push("No formal or business pieces");
    }

    const topColors = [...colorCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([color]) => color);

    return { gaps, underused: underusedItems.slice(0, 10), topColors };
  }, [items]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading flex items-center gap-2 text-2xl font-bold text-[var(--foreground)]">
          <BarChart3 className="h-7 w-7 shrink-0 text-[var(--primary)]" />
          Closet analytics
        </h1>
        <p className="mt-1 text-[var(--text-muted)]">Gaps, underused pieces, and color trends.</p>
      </div>

      <section className="card p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
          <Package className="h-4 w-4 shrink-0" />
          Wardrobe gaps
        </h2>
        {gaps.length === 0 ? (
          <p className="mt-2 text-[var(--text-muted)]">You have at least one of each basic category.</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {gaps.map((g) => (
              <li key={g} className="text-[var(--foreground)]">• {g}</li>
            ))}
          </ul>
        )}
        <Link href="/closet" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:underline">
          <Plus className="h-4 w-4 shrink-0" />
          Add items →
        </Link>
      </section>

      <section className="card p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
          <TrendingDown className="h-4 w-4 shrink-0" />
          Underused (worn &lt; 2×)
        </h2>
        {underused.length === 0 ? (
          <p className="mt-2 text-[var(--text-muted)]">Every piece has been worn at least twice.</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {underused.map((item) => (
              <li key={item.id} className="text-[var(--foreground)]">• {item.name} <span className="text-[var(--text-muted)]">({item.wearCount ?? 0}×)</span></li>
            ))}
          </ul>
        )}
        <Link href="/recommendations" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:underline">
          <RefreshCw className="h-4 w-4 shrink-0" />
          Get picks that rotate closet →
        </Link>
      </section>

      <section className="card p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
          <Palette className="h-4 w-4 shrink-0" />
          Top colors in closet
        </h2>
        {topColors.length === 0 ? (
          <p className="mt-2 text-[var(--text-muted)]">Add items with color tags to see trends.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {topColors.map((hex) => (
              <span key={hex} className="h-8 w-8 rounded-full border-2 border-[var(--border)]" style={{ backgroundColor: hex }} title={hex} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
