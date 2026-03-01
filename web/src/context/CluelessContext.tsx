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
import type { StylePreferences } from "@/types/style";
import { storage } from "@/lib/storage";
import { SEED_WARDROBE, generateId } from "@/lib/seed-data";

interface CluelessState {
  items: WardrobeItem[];
  outfits: Outfit[];
  stylePreferences: StylePreferences | null;
}

interface CluelessActions {
  addItem: (item: Omit<WardrobeItem, "id" | "createdAt" | "updatedAt">) => WardrobeItem;
  updateItem: (id: string, patch: Partial<WardrobeItem>) => void;
  removeItem: (id: string) => void;
  addOutfit: (itemIds: string[], name?: string) => Outfit;
  removeOutfit: (id: string) => void;
  saveStylePreferences: (prefs: StylePreferences) => void;
  incrementWearCount: (itemId: string) => void;
}

const CluelessContext = createContext<(CluelessState & CluelessActions) | null>(null);

export function CluelessProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [stylePreferences, setStylePreferences] = useState<StylePreferences | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = storage.getWardrobe();
    const storedOutfits = storage.getOutfits();
    const storedStyle = storage.getStylePreferences();
    if (stored.length > 0) {
      setItems(stored);
    } else {
      setItems(SEED_WARDROBE);
      storage.setWardrobe(SEED_WARDROBE);
    }
    setOutfits(storedOutfits);
    setStylePreferences(storedStyle);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    storage.setWardrobe(items);
  }, [hydrated, items]);

  useEffect(() => {
    if (!hydrated) return;
    storage.setOutfits(outfits);
  }, [hydrated, outfits]);

  useEffect(() => {
    if (!hydrated) return;
    storage.setStylePreferences(stylePreferences);
  }, [hydrated, stylePreferences]);

  const addItem = useCallback(
    (item: Omit<WardrobeItem, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newItem: WardrobeItem = {
        ...item,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
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
      addItem,
      updateItem,
      removeItem,
      addOutfit,
      removeOutfit,
      saveStylePreferences,
      incrementWearCount,
    }),
    [
      items,
      outfits,
      stylePreferences,
      addItem,
      updateItem,
      removeItem,
      addOutfit,
      removeOutfit,
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
