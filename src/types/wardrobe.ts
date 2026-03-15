/** Clothing category for closet and outfit builder */
export type ClothingCategory =
  | "top"
  | "bottom"
  | "outerwear"
  | "shoes"
  | "accessory"
  | "dress"
  | "one-piece";

/** Canonical order and set of categories — use for tabs, dropdowns, and validation */
export const CATEGORY_VALUES: readonly ClothingCategory[] = [
  "top",
  "bottom",
  "outerwear",
  "shoes",
  "accessory",
  "dress",
  "one-piece",
] as const;

/** Normalize any string to a valid ClothingCategory (lowercase). Use when loading from storage or filtering. */
export function normalizeCategory(value: string | undefined | null): ClothingCategory {
  if (value == null) return "top";
  const c = String(value).toLowerCase().trim();
  return (CATEGORY_VALUES.includes(c as ClothingCategory) ? c : "top") as ClothingCategory;
}

/** Seasonality tag for weather-aware suggestions */
export type Seasonality = "summer" | "spring" | "fall" | "winter" | "all-season";

/** Formality for event-based recommendations */
export type Formality = "casual" | "smart-casual" | "business" | "formal" | "athletic";

export interface WardrobeItem {
  id: string;
  name: string;
  category: ClothingCategory;
  imageUrl: string;
  /** Hex or named colors for matching */
  colors: string[];
  /** Pattern if applicable */
  pattern?: string;
  /** Fabric hint for weather (e.g. silk, wool, cotton) */
  fabric?: string;
  seasonality: Seasonality;
  formality: Formality;
  /** For rain/snow suggestions */
  waterproof?: boolean;
  /** Tags from AI or manual (e.g. "striped", "blazer") */
  tags: string[];
  /** Cost-per-wear tracking */
  wearCount?: number;
  purchasePrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Outfit {
  id: string;
  name?: string;
  itemIds: string[];
  /** Optional event/occasion this was worn for */
  occasion?: string;
  createdAt: string;
  /** For ranking and learning */
  rating?: number;
}
