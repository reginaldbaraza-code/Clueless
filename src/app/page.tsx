"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useClueless } from "@/context/CluelessContext";
import { useWeather } from "@/hooks/useWeather";
import { getDailyPick } from "@/lib/recommendations";
import { ItemImage } from "@/components/ItemImage";
import { LookCard } from "@/components/LookCard";
import { Modal, ModalContent } from "@/components/Modal";
import { Shirt, MapPin, Check, Download, RefreshCw } from "lucide-react";
import type { WardrobeItem } from "@/types/wardrobe";

function pickReason(
  pick: WardrobeItem[],
  weather: { tempC: number; description: string } | null
): string {
  if (weather) return `${Math.round(weather.tempC)}°C, ${weather.description}.`;
  return "A pick from your closet for today.";
}

export default function Home() {
  const { items, stylePreferences, addOutfit, incrementWearCount, hydrated } =
    useClueless();
  const { weather, fetchByGeolocation } = useWeather();
  const [dailyPick, setDailyPick] = useState<WardrobeItem[] | null>(null);
  const [woreIt, setWoreIt] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  const formality = stylePreferences?.defaultFormality ?? "casual";

  useEffect(() => {
    const pick = getDailyPick(items, [], {
      weather: weather ?? undefined,
      formality,
      rotateCloset: true,
    });
    setDailyPick(pick);
  }, [items, weather, formality]);

  const handleWearingThis = () => {
    if (!dailyPick || woreIt) return;
    const itemIds = dailyPick.map((i) => i.id);
    addOutfit(itemIds, "Today's Clueless Pick");
    itemIds.forEach((id) => incrementWearCount(id));
    setWoreIt(true);
  };

  const dayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-10">
      {/* Empty closet — first-time / onboarding */}
      {hydrated && items.length === 0 && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-8 text-center sm:p-10"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-muted)] text-[var(--primary)]">
            <Shirt className="h-7 w-7 shrink-0" aria-hidden />
          </div>
          <h2 className="font-heading mt-6 text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
            Your closet is empty
          </h2>
          <p className="mt-2 max-w-sm mx-auto text-[var(--text-muted)]">
            Add your first pieces to get daily outfit picks and recommendations tailored to the weather.
          </p>
          <Link
            href="/closet"
            className="btn-primary mt-6 inline-flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
          >
            <Shirt className="h-4 w-4 shrink-0" aria-hidden />
            Add your first item
          </Link>
        </motion.section>
      )}

      {/* Hero — when user has items */}
      {(!hydrated || items.length > 0) && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
              What to wear today?
            </h1>
            {weather && (
              <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)]">
                {Math.round(weather.tempC)}°C · {weather.description}
              </span>
            )}
          </div>
          <p className="mt-2 text-[var(--text-muted)]">
            Daily pick from your closet, tuned to the weather.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/closet" className="btn-primary inline-flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]">
              <Shirt className="h-4 w-4 shrink-0" aria-hidden />
              Open closet
            </Link>
            <Link href="/recommendations" className="btn-secondary inline-flex items-center gap-2">
              Get recommendations
            </Link>
          </div>
        </motion.section>
      )}

      {/* Daily pick */}
      {dailyPick && dailyPick.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
        >
          <h2 className="font-heading text-lg font-semibold text-[var(--foreground)]">
            {dayLabel}
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {pickReason(dailyPick, weather)}
          </p>
          {!weather && (
            <button
              type="button"
              onClick={() => fetchByGeolocation()}
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline"
            >
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              Use location for weather
            </button>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {dailyPick.map((item) => (
              <span
                key={item.id}
                className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] py-1 pl-1.5 pr-2.5 text-sm font-medium text-[var(--foreground)]"
              >
                <ItemImage item={item} size="small" />
                <span className="min-w-0 truncate">{item.name}</span>
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleWearingThis}
              disabled={woreIt}
              className={
                woreIt
                  ? "inline-flex items-center gap-2 rounded-lg border border-green-600/30 bg-green-500/10 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400"
                  : "btn-primary inline-flex items-center gap-2"
              }
            >
              {woreIt && <Check className="h-4 w-4 shrink-0" aria-hidden />}
              {woreIt ? "Wearing it" : "I'm wearing this"}
            </button>
            <button
              type="button"
              onClick={() => setShowShareCard(true)}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Download className="h-4 w-4 shrink-0" aria-hidden />
              Download
            </button>
            <Link href="/outfit-builder" className="btn-secondary inline-flex items-center gap-2">
              <RefreshCw className="h-4 w-4 shrink-0" aria-hidden />
              Swap
            </Link>
          </div>
          {showShareCard && (
            <Modal isOpen onClose={() => setShowShareCard(false)}>
              <ModalContent className="p-6">
                <LookCard
                  items={dailyPick}
                  title={`Today's pick · ${dayLabel}`}
                  showDownload
                />
                <button
                  type="button"
                  onClick={() => setShowShareCard(false)}
                  className="mt-4 w-full text-center text-sm text-[var(--text-muted)] hover:underline"
                >
                  Close
                </button>
              </ModalContent>
            </Modal>
          )}
        </motion.section>
      )}

      {/* Need more items */}
      {hydrated && items.length > 0 && !dailyPick && (
        <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-muted)]/50 p-5">
          <p className="text-[var(--text-muted)]">
            Add at least one top, one bottom, and shoes to get a daily pick.
          </p>
          <Link href="/closet" className="btn-primary mt-4 inline-flex items-center gap-2">
            <Shirt className="h-4 w-4 shrink-0" aria-hidden />
            Open closet
          </Link>
        </section>
      )}
    </div>
  );
}
