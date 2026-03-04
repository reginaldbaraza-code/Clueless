"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useWeather } from "@/hooks/useWeather";
import { useClueless } from "@/context/CluelessContext";
import { getRecommendedOutfits } from "@/lib/recommendations";
import { ItemImage } from "@/components/ItemImage";
import { EmptyState } from "@/components/EmptyState";
import { MapPin, Shirt, Briefcase, Crown, Dumbbell, RotateCcw, Lightbulb, Cloud, Coffee } from "lucide-react";
import type { Formality } from "@/types/wardrobe";

const FORMALITY_OPTIONS: { value: Formality; label: string; Icon: typeof Shirt }[] = [
  { value: "casual", label: "Casual", Icon: Coffee },
  { value: "smart-casual", label: "Smart casual", Icon: Shirt },
  { value: "business", label: "Business", Icon: Briefcase },
  { value: "formal", label: "Formal", Icon: Crown },
  { value: "athletic", label: "Athletic", Icon: Dumbbell },
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
        <h1 className="font-heading flex items-center gap-2 text-2xl font-bold text-[var(--foreground)]">
          <Lightbulb className="h-7 w-7 shrink-0 text-[var(--primary)]" />
          Recommendations
        </h1>
        <p className="mt-1 text-[var(--text-muted)]">
          Weather-aware, rule-based outfit suggestions. Enable location for live weather.
        </p>
      </div>

      <section className="card p-6">
        <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          <Cloud className="h-4 w-4 shrink-0" />
          Context
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--foreground)]">
              Weather
            </p>
            {weather ? (
              <p className="text-[var(--text-muted)]">
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
                  className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <MapPin className="h-4 w-4 shrink-0" />
                  {weatherLoading ? "Getting location…" : "Use my location for weather"}
                </button>
                {weatherError && (
                  <span className="text-sm text-red-600">{weatherError}</span>
                )}
              </div>
            )}
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--foreground)]">
              Formality
            </p>
            <div className="flex flex-wrap gap-2">
              {FORMALITY_OPTIONS.map((opt) => {
                const Icon = opt.Icon;
                return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormality(opt.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    formality === opt.value
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--primary-muted)] text-[var(--primary)] hover:opacity-90"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {opt.label}
                </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <input
                type="checkbox"
                checked={rotateCloset}
                onChange={(e) => setRotateCloset(e.target.checked)}
                className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <RotateCcw className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
              Prefer underused items (rotate closet)
            </label>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          <Shirt className="h-4 w-4 shrink-0" />
          Suggested outfits
        </h2>
        {recommendations.length === 0 ? (
          <EmptyState
            icon={Lightbulb}
            title="No outfits match right now"
            description="Try relaxing formality, adding more items to your closet, or enabling weather for better suggestions."
            action={{ label: "Open closet", href: "/closet" }}
            secondary={{ label: "Style quiz", href: "/style-quiz" }}
          />
        ) : (
          <ul className="space-y-4">
            {recommendations.slice(0, 5).map((combo, idx) => (
              <motion.li
                key={combo.map((i) => i.id).join("-")}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card flex flex-wrap items-center gap-2 p-4"
              >
                {combo.map((item) => (
                  <span key={item.id} className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--primary-muted)]/50 py-1 pl-1 pr-3">
                    <ItemImage item={item} size="small" />
                    <span className="text-sm font-medium text-[var(--primary)]">{item.name}</span>
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
