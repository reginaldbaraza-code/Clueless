import type { WardrobeItem, ClothingCategory } from "@/types/wardrobe";

/** Unsplash photo slugs for category placeholders (source.unsplash.com style) */
const UNSPLASH_BY_CATEGORY: Record<ClothingCategory, string> = {
  top: "1552374196-c4e7ffc6e126",
  bottom: "1541091563312-3f06316e0c18",
  outerwear: "1544022613-e87ad57527a7",
  shoes: "1549298912-b141d0d1c367",
  accessory: "1591560654127-94f859d649b0",
  dress: "1595776613215-01b1af8b46dc",
  "one-piece": "1595776613215-01b1af8b46dc",
};

const UNSPLASH_BASE = "https://images.unsplash.com";

/** Returns image URL for an item: use custom imageUrl if set, else a category placeholder */
export function getItemImageUrl(item: { imageUrl: string; category: ClothingCategory }, size?: number): string {
  const w = size ?? 400;
  if (item.imageUrl?.trim()) {
    return item.imageUrl.trim();
  }
  const slug = UNSPLASH_BY_CATEGORY[item.category] ?? UNSPLASH_BY_CATEGORY.top;
  return `${UNSPLASH_BASE}/photo-${slug}?w=${w}&h=${w}&fit=crop&q=80`;
}
