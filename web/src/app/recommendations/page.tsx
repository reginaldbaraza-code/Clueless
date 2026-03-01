"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useWeather } from "@/hooks/useWeather";
import { useClueless } from "@/context/CluelessContext";
import { getRecommendedOutfits } from "@/lib/recommendations";
import type { Formality } from "@/types/wardrobe";

const FORMALITY_OPTIONS: { value: Formality; label: string }[] = [
  { value: "casual", label: "Casual" },
  { value: "smart-casual", label: "Smart casual" },
  { value: "business", label: "Business" },
  { value: "formal", label: "Formal" },
  { value: "athletic", label: "Athletic" },
];

export default function RecommendationsPage() {
  const { items, outfits } = useClueless();
  const { weather, loading: weatherLoading, error: weatherError, fetchByGeolocation } = useWeather();
  const [formality, setFormality] = useState<Formality>("casual");
  const [rotateCloset, setRotateCloset] = useState(false);

  const recommendations = getRecommendedOutfits(
    items,
    outfits,
    {
      weather: weather ?? undefined,
      formality,
      rotateCloset,
    }
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-50">
          Recommendations
        </h1>
        <p className="mt-1 text-stone-600 dark:text-stone-400">
          Weather-aware, rule-based outfit suggestions. Enable location for live weather.
        </p>
      </div>

      <section className="rounded-xl border border-amber-200/60 bg-white p-6 dark:bg-stone-900/50 dark:border-amber-800/60">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Context
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-stone-700 dark:text-stone-300">
              Weather
            </p>
            {weather ? (
              <p className="text-stone-600 dark:text-stone-400">
                {weather.locationName && `${weather.locationName} · `}
                {weather.tempC}°C (feels like {weather.feelsLikeC}°C), {weather.description}.
                {weather.rainProbabilityPercent > 50 && " Rain likely — we’ll favor waterproof pieces."}
              </p>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={fetchByGeolocation}
                  disabled={weatherLoading}
                  className="rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-50 dark:bg-amber-500 dark:hover:bg-amber-600"
                >
                  {weatherLoading ? "Getting location…" : "Use my location for weather"}
                </button>
                {weatherError && (
                  <span className="text-sm text-red-600 dark:text-red-400">{weatherError}</span>
                )}
              </div>
            )}
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-stone-700 dark:text-stone-300">
              Formality
            </p>
            <div className="flex flex-wrap gap-2">
              {FORMALITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormality(opt.value)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    formality === opt.value
                      ? "bg-amber-600 text-white dark:bg-amber-500"
                      : "bg-amber-100/80 text-amber-900 hover:bg-amber-200/80 dark:bg-amber-900/40 dark:text-amber-100 dark:hover:bg-amber-800/60"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
              <input
                type="checkbox"
                checked={rotateCloset}
                onChange={(e) => setRotateCloset(e.target.checked)}
                className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              Prefer underused items (rotate closet)
            </label>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Suggested outfits
        </h2>
        {recommendations.length === 0 ? (
          <p className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-6 text-stone-600 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-stone-400">
            No combinations match the current filters. Try relaxing formality or adding more items to your closet.
          </p>
        ) : (
          <ul className="space-y-4">
            {recommendations.slice(0, 5).map((combo, idx) => (
              <motion.li
                key={combo.map((i) => i.id).join("-")}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200/60 bg-white p-4 shadow-sm dark:bg-stone-900/50 dark:border-amber-800/60"
              >
                {combo.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900 dark:bg-amber-900/50 dark:text-amber-100"
                  >
                    {item.name}
                  </span>
                ))}
              </motion.li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
