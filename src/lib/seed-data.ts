import type { WardrobeItem, Outfit } from "@/types/wardrobe";
import type { StylePreferences } from "@/types/style";

export const SEED_WARDROBE: WardrobeItem[] = [
  {
    id: "seed-1",
    name: "White cotton tee",
    category: "top",
    imageUrl: "",
    colors: ["#ffffff"],
    fabric: "cotton",
    seasonality: "all-season",
    formality: "casual",
    tags: ["basic", "tee"],
    wearCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    name: "High-waist jeans",
    category: "bottom",
    imageUrl: "",
    colors: ["#4a5568"],
    fabric: "denim",
    seasonality: "all-season",
    formality: "casual",
    tags: ["denim", "jeans"],
    wearCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-3",
    name: "Trench coat",
    category: "outerwear",
    imageUrl: "",
    colors: ["#c4a574"],
    fabric: "cotton",
    seasonality: "fall",
    formality: "smart-casual",
    waterproof: true,
    tags: ["coat", "classic"],
    wearCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-4",
    name: "White sneakers",
    category: "shoes",
    imageUrl: "",
    colors: ["#ffffff", "#f7fafc"],
    seasonality: "all-season",
    formality: "casual",
    tags: ["sneakers", "casual"],
    wearCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function generateId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
