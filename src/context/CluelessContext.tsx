"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { WardrobeItem, Outfit } from "@/types/wardrobe";
import { normalizeCategory } from "@/types/wardrobe";
import type { StylePreferences } from "@/types/style";
import { useAuth } from "@/context/AuthContext";
import { storage } from "@/lib/storage";
import { SEED_WARDROBE, generateId } from "@/lib/seed-data";

interface CluelessState {
  items: WardrobeItem[];
  outfits: Outfit[];
  stylePreferences: StylePreferences | null;
  hydrated: boolean;
}

interface CluelessActions {
  addItem: (item: Omit<WardrobeItem, "id" | "createdAt" | "updatedAt">) => WardrobeItem;
  updateItem: (id: string, patch: Partial<WardrobeItem>) => void;
  removeItem: (id: string) => void;
  addOutfit: (itemIds: string[], name?: string) => Outfit;
  updateOutfit: (id: string, patch: Partial<Outfit>) => void;
  removeOutfit: (id: string) => void;
  rateOutfit: (outfitId: string, rating: number) => void;
  saveStylePreferences: (prefs: StylePreferences) => void;
  incrementWearCount: (itemId: string) => void;
}

const CluelessContext = createContext<(CluelessState & CluelessActions) | null>(null);

export function CluelessProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [stylePreferences, setStylePreferences] = useState<StylePreferences | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from storage when user logs in; clear when user logs out
  useEffect(() => {
    if (!userId) {
      setItems([]);
      setOutfits([]);
      setStylePreferences(null);
      setHydrated(true);
      return;
    }

    const stored = storage.getWardrobe(userId);
    const storedOutfits = storage.getOutfits(userId);
    const storedStyle = storage.getStylePreferences(userId);

    let itemsToUse = stored;
    let outfitsToUse = storedOutfits;

    if (stored.length > 0) {
      const seedById = new Map(SEED_WARDROBE.map((s) => [s.id, s]));
      const migrated = stored.map((item) => {
        const seed = seedById.get(item.id);
        const imageUrl = seed && !item.imageUrl?.trim() ? seed.imageUrl : item.imageUrl;
        const category = normalizeCategory(item.category);
        return { ...item, imageUrl, category };
      });
      const changed = migrated.some((m, i) => m.imageUrl !== stored[i].imageUrl || m.category !== stored[i].category);
      if (changed) storage.setWardrobe(userId, migrated);
      itemsToUse = migrated;
    } else {
      itemsToUse = [];
      outfitsToUse = [];
      storage.setWardrobe(userId, []);
      storage.setOutfits(userId, []);
    }

    setItems(itemsToUse);
    setOutfits(outfitsToUse);
    setStylePreferences(storedStyle);
    setHydrated(true);
  }, [userId]);

  useEffect(() => {
    if (!hydrated || !userId) return;
    const normalized = items.map((i) => ({ ...i, category: normalizeCategory(i.category) }));
    storage.setWardrobe(userId, normalized);
  }, [hydrated, userId, items]);

  useEffect(() => {
    if (!hydrated || !userId) return;
    storage.setOutfits(userId, outfits);
  }, [hydrated, userId, outfits]);

  useEffect(() => {
    if (!hydrated || !userId) return;
    storage.setStylePreferences(userId, stylePreferences);
  }, [hydrated, userId, stylePreferences]);

  const addItem = useCallback(
    (item: Omit<WardrobeItem, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newItem: WardrobeItem = {
        ...item,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
        category: normalizeCategory(item.category),
        tags: item.tags ?? [],
      };
      setItems((prev) => [...prev, newItem]);
      return newItem;
    },
    []
  );

  const updateItem = useCallback((id: string, patch: Partial<WardrobeItem>) => {
    const now = new Date().toISOString();
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, ...patch, updatedAt: now } : i
      )
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setOutfits((prev) => prev.filter((o) => !o.itemIds.includes(id)));
  }, []);

  const addOutfit = useCallback(
    (itemIds: string[], name?: string) => {
      const now = new Date().toISOString();
      const newOutfit: Outfit = {
        id: generateId(),
        itemIds,
        name,
        createdAt: now,
      };
      setOutfits((prev) => [...prev, newOutfit]);
      return newOutfit;
    },
    []
  );

  const removeOutfit = useCallback((id: string) => {
    setOutfits((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const updateOutfit = useCallback((id: string, patch: Partial<Outfit>) => {
    setOutfits((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...patch } : o))
    );
  }, []);

  const rateOutfit = useCallback((outfitId: string, rating: number) => {
    setOutfits((prev) =>
      prev.map((o) =>
        o.id === outfitId ? { ...o, rating: Math.min(5, Math.max(1, rating)) } : o
      )
    );
  }, []);

  const saveStylePreferences = useCallback((prefs: StylePreferences) => {
    setStylePreferences({
      ...prefs,
      completedAt: new Date().toISOString(),
    });
  }, []);

  const incrementWearCount = useCallback((itemId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? { ...i, wearCount: (i.wearCount ?? 0) + 1, updatedAt: new Date().toISOString() }
          : i
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      items,
      outfits,
      stylePreferences,
      hydrated,
      addItem,
      updateItem,
      removeItem,
      addOutfit,
      updateOutfit,
      removeOutfit,
      rateOutfit,
      saveStylePreferences,
      incrementWearCount,
    }),
    [
      items,
      outfits,
      stylePreferences,
      hydrated,
      addItem,
      updateItem,
      removeItem,
      addOutfit,
      updateOutfit,
      removeOutfit,
      rateOutfit,
      saveStylePreferences,
      incrementWearCount,
    ]
  );

  return (
    <CluelessContext.Provider value={value}>{children}</CluelessContext.Provider>
  );
}

export function useClueless() {
  const ctx = useContext(CluelessContext);
  if (!ctx) throw new Error("useClueless must be used within CluelessProvider");
  return ctx;
}
