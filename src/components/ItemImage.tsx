"use client";

import type { WardrobeItem } from "@/types/wardrobe";
import { getItemImageUrl } from "@/lib/item-image";

type Size = "card" | "thumb" | "small";

const sizeClasses: Record<Size, string> = {
  card: "aspect-square w-full object-cover",
  thumb: "h-10 w-10 shrink-0 rounded-lg object-cover",
  small: "h-8 w-8 shrink-0 rounded-md object-cover",
};

export function ItemImage({ item, size = "card" }: { item: WardrobeItem; size?: Size }) {
  const src = getItemImageUrl(item, size === "card" ? 400 : size === "thumb" ? 80 : 48);

  return (
    <img
      src={src}
      alt={item.name}
      className={sizeClasses[size]}
      sizes={size === "card" ? "(max-width: 768px) 50vw, 25vw" : undefined}
    />
  );
}
