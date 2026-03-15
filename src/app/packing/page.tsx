"use client";

import { useState } from "react";
import { useClueless } from "@/context/CluelessContext";
import { useWeather } from "@/hooks/useWeather";
import { getRecommendedOutfits } from "@/lib/recommendations";
import { ItemImage } from "@/components/ItemImage";
import { Cloud, Luggage } from "lucide-react";
import type { WardrobeItem } from "@/types/wardrobe";

export default function PackingPage() {
  const { items, stylePreferences } = useClueless();
  const { weather, fetchByGeolocation } = useWeather();
  const [tripName, setTripName] = useState("");
  const [days, setDays] = useState(3);
  const [useWeatherForPacking, setUseWeatherForPacking] = useState(false);

  const formality = stylePreferences?.defaultFormality ?? "casual";
  const recommendations = getRecommendedOutfits(items, [], {
    weather: useWeatherForPacking && weather ? weather : undefined,
    formality,
    rotateCloset: true,
  });

  const suggestedItems = new Map<string, WardrobeItem>();
  const outfitsNeeded = Math.min(days, 7);
  for (let i = 0; i < outfitsNeeded && i < recommendations.length; i++) {
    for (const item of recommendations[i]) suggestedItems.set(item.id, item);
  }
  const list = [...suggestedItems.values()];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading flex items-center gap-2 text-2xl font-bold text-[var(--foreground)]">
          <Luggage className="h-7 w-7 shrink-0 text-[var(--primary)]" />
          Packing list
        </h1>
        <p className="mt-1 text-[var(--text-muted)]">Plan what to pack based on trip length and optional weather.</p>
      </div>

      <section className="card space-y-4 p-6">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Trip name (optional)</label>
          <input type="text" value={tripName} onChange={(e) => setTripName(e.target.value)} placeholder="e.g. Weekend in NYC" className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Number of days</label>
          <input type="number" min={1} max={14} value={days} onChange={(e) => setDays(parseInt(e.target.value, 10) || 1)} className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5" />
        </div>
        <div className="flex items-center gap-2">
          <input id="use-weather" type="checkbox" checked={useWeatherForPacking} onChange={(e) => setUseWeatherForPacking(e.target.checked)} className="rounded border-[var(--border)] text-[var(--primary)]" />
          <label htmlFor="use-weather" className="text-sm text-[var(--foreground)]">Use my location for weather-aware suggestions</label>
        </div>
        {useWeatherForPacking && !weather && (
          <button type="button" onClick={() => fetchByGeolocation()} className="btn-primary inline-flex items-center gap-2">
            <Cloud className="h-4 w-4 shrink-0" />
            Get weather
          </button>
        )}
      </section>

      <section className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">Suggested to pack ({list.length} items)</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">Based on {days} day{days !== 1 ? "s" : ""} and your closet.</p>
        {list.length === 0 ? (
          <p className="mt-4 text-[var(--text-muted)]">Add items to your closet and try again.</p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-3">
            {list.map((item) => (
              <li key={item.id} className="flex max-w-full items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)]/50 py-1 pl-1 pr-3">
                <ItemImage item={item} size="small" />
                <span className="min-w-0 truncate text-sm font-medium text-[var(--foreground)]">{item.name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
