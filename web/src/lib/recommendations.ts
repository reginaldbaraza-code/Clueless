import type { WardrobeItem, Outfit, Formality } from "@/types/wardrobe";
import type { WeatherConditions } from "@/types/weather";

export interface RecommendationContext {
  weather?: WeatherConditions | null;
  event?: string;
  formality?: Formality;
  /** Optional: prefer underused items */
  rotateCloset?: boolean;
}

/**
 * Phase 1 – Rule-based recommendation logic.
 * Scores and filters outfits based on weather, event, and formality.
 */
export function getRecommendedOutfits(
  items: WardrobeItem[],
  existingOutfits: Outfit[],
  context: RecommendationContext
): WardrobeItem[][] {
  const { weather, formality, event } = context;
  const candidates = filterByContext(items, context);
  const combos = buildOutfitCombos(candidates);
  const scored = combos.map((combo) => ({
    combo,
    score: scoreOutfit(combo, context),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 10).map((s) => s.combo);
}

function filterByContext(
  items: WardrobeItem[],
  ctx: RecommendationContext
): WardrobeItem[] {
  let out = [...items];

  if (ctx.weather) {
    const { tempC, rainProbabilityPercent } = ctx.weather;
    out = out.filter((item) => {
      if (rainProbabilityPercent > 60 && !item.waterproof && item.category === "shoes")
        return false;
      if (tempC < 10 && item.seasonality === "summer" && item.category !== "outerwear")
        return false;
      if (tempC > 28 && item.seasonality === "winter" && item.category !== "shoes")
        return false;
      return true;
    });
  }

  if (ctx.formality) {
    const order: Formality[] = ["casual", "smart-casual", "business", "formal", "athletic"];
    const idx = order.indexOf(ctx.formality);
    out = out.filter((item) => {
      const itemIdx = order.indexOf(item.formality);
      return itemIdx >= idx - 1 && itemIdx <= idx + 1;
    });
  }

  return out;
}

function buildOutfitCombos(items: WardrobeItem[]): WardrobeItem[][] {
  const tops = items.filter((i) => i.category === "top" || i.category === "dress" || i.category === "one-piece");
  const bottoms = items.filter((i) => i.category === "bottom");
  const outerwear = items.filter((i) => i.category === "outerwear");
  const shoes = items.filter((i) => i.category === "shoes");
  const combos: WardrobeItem[][] = [];

  // Simple rule: need at least top + bottom (or dress/one-piece) + shoes
  if (tops.length && shoes.length) {
    for (const top of tops) {
      if (top.category === "dress" || top.category === "one-piece") {
        for (const shoe of shoes) {
          combos.push([top, shoe]);
        }
      } else {
        for (const bottom of bottoms) {
          for (const shoe of shoes) {
            combos.push([top, bottom, shoe]);
          }
        }
      }
    }
  }

  return combos.length ? combos : [];
}

function scoreOutfit(combo: WardrobeItem[], ctx: RecommendationContext): number {
  let score = 50;

  if (ctx.weather) {
    const { tempC, rainProbabilityPercent } = ctx.weather;
    for (const item of combo) {
      if (rainProbabilityPercent > 50 && item.waterproof) score += 15;
      if (tempC < 15 && item.category === "outerwear") score += 10;
      if (tempC > 25 && (item.fabric === "linen" || item.fabric === "cotton")) score += 5;
    }
  }

  if (ctx.formality) {
    const order: Formality[] = ["casual", "smart-casual", "business", "formal", "athletic"];
    const targetIdx = order.indexOf(ctx.formality);
    for (const item of combo) {
      const itemIdx = order.indexOf(item.formality);
      if (Math.abs(itemIdx - targetIdx) <= 1) score += 5;
    }
  }

  if (ctx.rotateCloset) {
    for (const item of combo) {
      const wears = item.wearCount ?? 0;
      if (wears < 5) score += 8;
    }
  }

  return score;
}
