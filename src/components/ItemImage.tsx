"use client";

import type { WardrobeItem } from "@/types/wardrobe";
import { getItemImageUrl } from "@/lib/item-image";

type Size = "card" | "thumb" | "small";

const sizeConfig: Record<Size, { width: number; height: number; className: string; sizes?: string }> = {
  card: {
    width: 400,
    height: 400,
    className: "aspect-square w-full object-cover",
    sizes: "(max-width: 768px) 50vw, 25vw",
  },
  thumb: {
    width: 80,
    height: 80,
    className: "h-10 w-10 shrink-0 rounded-lg object-cover",
  },
  small: {
    width: 48,
    height: 48,
    className: "h-8 w-8 shrink-0 rounded-md object-cover",
  },
};

export function ItemImage({ item, size = "card" }: { item: WardrobeItem; size?: Size }) {
  const config = sizeConfig[size];
  const px = size === "card" ? 400 : size === "thumb" ? 80 : 48;
  const src = getItemImageUrl(item, px);

  return (
    <img
      src={src}
      alt={item.name}
      width={config.width}
      height={config.height}
      className={config.className}
      sizes={config.sizes}
      referrerPolicy="no-referrer"
      loading="lazy"
      decoding="async"
      onError={(e) => {
        const el = e.currentTarget;
        if (el.src && !el.dataset.failed) {
          el.dataset.failed = "1";
          el.src = getItemImageUrl({ ...item, imageUrl: "" }, px);
        }
      }}
    />
  );
}
