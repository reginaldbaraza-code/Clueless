import type { WardrobeItem, Outfit } from "@/types/wardrobe";
import type { StylePreferences } from "@/types/style";

/** Unsplash image base; append photo-{id}?w=400&q=80 for product images */
const IMG = (id: string, w = 400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&fit=crop`;

const now = () => new Date().toISOString();

export const SEED_WARDROBE: WardrobeItem[] = [
  {
    id: "seed-1",
    name: "White cotton tee",
    category: "top",
    imageUrl: IMG("1521572163474-6864f9cf17ab"),
    colors: ["#ffffff"],
    fabric: "cotton",
    seasonality: "all-season",
    formality: "casual",
    tags: ["basic", "tee"],
    wearCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "seed-2",
    name: "High-waist jeans",
    category: "bottom",
    imageUrl: IMG("1541099649105-f69ad21f3246"),
    colors: ["#4a5568"],
    fabric: "denim",
    seasonality: "all-season",
    formality: "casual",
    tags: ["denim", "jeans"],
    wearCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "seed-3",
    name: "Trench coat",
    category: "outerwear",
    imageUrl: IMG("1539533018447-63fcce2678e3"),
    colors: ["#c4a574"],
    fabric: "cotton",
    seasonality: "fall",
    formality: "smart-casual",
    waterproof: true,
    tags: ["coat", "classic"],
    wearCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "seed-4",
    name: "White sneakers",
    category: "shoes",
    imageUrl: IMG("1542291026-7eec264c27ff"),
    colors: ["#ffffff", "#f7fafc"],
    seasonality: "all-season",
    formality: "casual",
    tags: ["sneakers", "casual"],
    wearCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "seed-5",
    name: "Navy blazer",
    category: "outerwear",
    imageUrl: IMG("1594938298401-1845d763f234"),
    colors: ["#1e3a5f"],
    fabric: "wool",
    seasonality: "all-season",
    formality: "business",
    tags: ["blazer", "formal"],
    wearCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "seed-6",
    name: "Black turtleneck",
    category: "top",
    imageUrl: IMG("1576566588028-4147f384b2c4"),
    colors: ["#1a1a1a"],
    fabric: "wool",
    seasonality: "fall",
    formality: "smart-casual",
    tags: ["knit", "layering"],
    wearCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "seed-7",
    name: "Pleated midi skirt",
    category: "bottom",
    imageUrl: IMG("1594633312682-6012dc583364"),
    colors: ["#374151"],
    fabric: "polyester",
    seasonality: "all-season",
    formality: "smart-casual",
    tags: ["skirt", "pleated"],
    wearCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "seed-8",
    name: "Leather ankle boots",
    category: "shoes",
    imageUrl: IMG("1543163521-20bf7c716ed4"),
    colors: ["#2d2d2d"],
    seasonality: "fall",
    formality: "smart-casual",
    tags: ["boots", "leather"],
    wearCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "seed-9",
    name: "Floral summer dress",
    category: "dress",
    imageUrl: IMG("1595776613215-01b1af8b46dc"),
    colors: ["#fef3c7", "#f59e0b"],
    fabric: "cotton",
    seasonality: "summer",
    formality: "casual",
    tags: ["dress", "floral"],
    wearCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "seed-10",
    name: "Striped Breton top",
    category: "top",
    imageUrl: IMG("1552374196-c4e7ffc6e126"),
    colors: ["#ffffff", "#1e3a5f"],
    fabric: "cotton",
    seasonality: "all-season",
    formality: "casual",
    tags: ["striped", "breton"],
    wearCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "seed-11",
    name: "Chino trousers",
    category: "bottom",
    imageUrl: IMG("1541091563312"),
    colors: ["#78716c"],
    fabric: "cotton",
    seasonality: "all-season",
    formality: "smart-casual",
    tags: ["chinos", "trousers"],
    wearCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "seed-12",
    name: "Canvas tote bag",
    category: "accessory",
    imageUrl: IMG("1591560654127-94f859d649b0"),
    colors: ["#d4a574"],
    fabric: "canvas",
    seasonality: "all-season",
    formality: "casual",
    tags: ["tote", "bag"],
    wearCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "seed-13",
    name: "Running sneakers",
    category: "shoes",
    imageUrl: IMG("1549298912-b141d0d1c367"),
    colors: ["#ef4444", "#1f2937"],
    seasonality: "all-season",
    formality: "athletic",
    tags: ["sneakers", "running"],
    wearCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "seed-14",
    name: "Oversized cardigan",
    category: "outerwear",
    imageUrl: IMG("1617127365652-c810475dc980"),
    colors: ["#6b7280"],
    fabric: "wool",
    seasonality: "fall",
    formality: "casual",
    tags: ["cardigan", "knit"],
    wearCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "seed-15",
    name: "Silk blouse",
    category: "top",
    imageUrl: IMG("1564257631407-74f82d34126e"),
    colors: ["#fef3c7"],
    fabric: "silk",
    seasonality: "spring",
    formality: "business",
    tags: ["blouse", "silk"],
    wearCount: 0,
    createdAt: now(),
    updatedAt: now(),
  },
];

/** Sample outfits using seed item IDs (seed-1 = tee, seed-2 = jeans, etc.) */
export const SEED_OUTFITS: Outfit[] = [
  {
    id: "outfit-seed-1",
    name: "Casual weekend",
    itemIds: ["seed-1", "seed-2", "seed-4"],
    occasion: "weekend",
    createdAt: now(),
    rating: 5,
  },
  {
    id: "outfit-seed-2",
    name: "Rainy day",
    itemIds: ["seed-3", "seed-6", "seed-7", "seed-8"],
    occasion: "commute",
    createdAt: now(),
    rating: 4,
  },
  {
    id: "outfit-seed-3",
    name: "Office smart",
    itemIds: ["seed-5", "seed-15", "seed-11", "seed-8"],
    occasion: "work",
    createdAt: now(),
  },
  {
    id: "outfit-seed-4",
    name: "Summer brunch",
    itemIds: ["seed-9", "seed-4", "seed-12"],
    occasion: "brunch",
    createdAt: now(),
  },
];

export function generateId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Dev-only: pick random item IDs from wardrobe to form a plausible outfit (top/bottom or dress, shoes, optional outerwear/accessory). */
export function randomOutfitItemIds(items: WardrobeItem[]): string[] {
  if (items.length === 0) return [];
  const byCategory = new Map<WardrobeItem["category"], WardrobeItem[]>();
  for (const item of items) {
    const list = byCategory.get(item.category) ?? [];
    list.push(item);
    byCategory.set(item.category, list);
  }
  const pick = <T>(arr: T[]): T | undefined => arr[Math.floor(Math.random() * arr.length)];
  const pickN = <T>(arr: T[], n: number): T[] => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  };
  const ids: string[] = [];
  const top = pick(byCategory.get("top") ?? []);
  const dress = pick(byCategory.get("dress") ?? []);
  const onePiece = pick(byCategory.get("one-piece") ?? []);
  const bottom = pick(byCategory.get("bottom") ?? []);
  const shoes = pick(byCategory.get("shoes") ?? []);
  const outerwear = pick(byCategory.get("outerwear") ?? []);
  const accessories = byCategory.get("accessory") ?? [];

  if (dress) {
    ids.push(dress.id);
  } else if (onePiece) {
    ids.push(onePiece.id);
  } else {
    if (top) ids.push(top.id);
    if (bottom) ids.push(bottom.id);
  }
  if (shoes) ids.push(shoes.id);
  if (outerwear && Math.random() > 0.5) ids.push(outerwear.id);
  const acc = pickN(accessories, Math.min(2, accessories.length));
  acc.forEach((a) => ids.push(a.id));

  const result = ids.filter(Boolean);
  // Fallback: if no category-based picks (e.g. custom data), use 2–4 random items
  if (result.length === 0 && items.length > 0) {
    const n = Math.min(2 + Math.floor(Math.random() * 3), items.length);
    return pickN(items, n).map((i) => i.id);
  }
  return result;
}
