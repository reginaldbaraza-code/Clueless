const WARDROBE_KEY = "clueless-wardrobe";
const OUTFITS_KEY = "clueless-outfits";
const STYLE_KEY = "clueless-style-preferences";

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota or parse error
  }
}

export const storage = {
  getWardrobe: () => safeGet(WARDROBE_KEY, [] as import("@/types/wardrobe").WardrobeItem[]),
  setWardrobe: (items: import("@/types/wardrobe").WardrobeItem[]) =>
    safeSet(WARDROBE_KEY, items),

  getOutfits: () => safeGet(OUTFITS_KEY, [] as import("@/types/wardrobe").Outfit[]),
  setOutfits: (outfits: import("@/types/wardrobe").Outfit[]) =>
    safeSet(OUTFITS_KEY, outfits),

  getStylePreferences: () =>
    safeGet(STYLE_KEY, null as import("@/types/style").StylePreferences | null),
  setStylePreferences: (prefs: import("@/types/style").StylePreferences | null) =>
    safeSet(STYLE_KEY, prefs),
};
