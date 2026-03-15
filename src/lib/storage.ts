/** Keys are scoped by user id so each user has their own closet, outfits, and style. */
function key(userId: string, base: string) {
  return `clueless-${base}-${userId}`;
}

function safeGet<T>(storageKey: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(storageKey: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // quota or parse error
  }
}

export type WardrobeItem = import("@/types/wardrobe").WardrobeItem;
export type Outfit = import("@/types/wardrobe").Outfit;
export type StylePreferences = import("@/types/style").StylePreferences | null;

export const storage = {
  getWardrobe: (userId: string | null) =>
    userId
      ? safeGet(key(userId, "wardrobe"), [] as WardrobeItem[])
      : [],

  setWardrobe: (userId: string | null, items: WardrobeItem[]) => {
    if (userId) safeSet(key(userId, "wardrobe"), items);
  },

  getOutfits: (userId: string | null) =>
    userId ? safeGet(key(userId, "outfits"), [] as Outfit[]) : [],

  setOutfits: (userId: string | null, outfits: Outfit[]) => {
    if (userId) safeSet(key(userId, "outfits"), outfits);
  },

  getStylePreferences: (userId: string | null): StylePreferences =>
    userId ? safeGet(key(userId, "style"), null as StylePreferences) : null,

  setStylePreferences: (userId: string | null, prefs: StylePreferences) => {
    if (userId) safeSet(key(userId, "style"), prefs);
  },
};
