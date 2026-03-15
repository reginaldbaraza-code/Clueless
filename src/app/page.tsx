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
import { Shirt, Sparkles, MapPin, Check, Download, RefreshCw, X, ChevronRight, LayoutTemplate, Palette, Lightbulb } from "lucide-react";
import type { WardrobeItem } from "@/types/wardrobe";

function pickReason(pick: WardrobeItem[], weather: { tempC: number; description: string } | null): string {
  if (weather) {
    const temp = weather.tempC;
    if (temp < 10) return `Perfect for a cold one (${Math.round(temp)}°C).`;
    if (temp < 20) return `Ideal for ${weather.description} and ${Math.round(temp)}°C.`;
    if (temp >= 25) return `Light and easy for ${Math.round(temp)}°C.`;
    return `Just right for ${Math.round(temp)}°C and ${weather.description}.`;
  }
  return "A little something from your closet for today.";
}

export default function Home() {
  const { items, stylePreferences, addOutfit, incrementWearCount, hydrated } = useClueless();
  const { weather, fetchByGeolocation } = useWeather();
  const [dailyPick, setDailyPick] = useState<WardrobeItem[] | null>(null);
  const [woreIt, setWoreIt] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  const formality = stylePreferences?.defaultFormality ?? "casual";

  useEffect(() => {
    const pick = getDailyPick(
      items,
      [],
      {
        weather: weather ?? undefined,
        formality,
        rotateCloset: true,
      }
    );
    setDailyPick(pick);
  }, [items, weather, formality]);

  const loadWeatherForPick = () => {
    fetchByGeolocation();
  };

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
    <div className="flex flex-col gap-14 md:gap-16">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-plaid-subtle rounded-[var(--radius-card)] border border-[var(--border)] p-8 shadow-[var(--shadow-sm)] md:p-12"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
          As if!
        </p>
        <h1 className="font-heading mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl md:text-[2.5rem]">
          Your digital closet. Weather-aware. Style-driven.
        </h1>
        <p className="mt-5 max-w-xl text-[var(--text-muted)]">
          Build outfits, get daily picks, and never be clueless about what to wear—rain, meetings, or weekend plans.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/closet"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Shirt className="h-4 w-4 shrink-0" />
            Open my closet
          </Link>
          <Link
            href="/recommendations"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            Get recommendations
          </Link>
        </div>
      </motion.section>

      {dailyPick && dailyPick.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
          className="card p-6 md:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
            Today's Clueless Pick
          </p>
          <h2 className="font-heading mt-1 text-xl font-bold text-[var(--foreground)]">
            {dayLabel}
          </h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            {pickReason(dailyPick, weather)}
          </p>
          {!weather && (
            <button
              type="button"
              onClick={loadWeatherForPick}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              Use my location for weather-aware pick
            </button>
          )}
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/30 p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Today&apos;s pieces</p>
            <div className="flex flex-wrap gap-3">
              {dailyPick.map((item) => (
                <span
                  key={item.id}
                  className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] py-1.5 pl-1.5 pr-3 shadow-[var(--shadow-sm)]"
                >
                  <ItemImage item={item} size="small" />
                  <span className="text-sm font-medium text-[var(--foreground)]">{item.name}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleWearingThis}
              disabled={woreIt}
              className={woreIt ? "inline-flex items-center gap-2 rounded-full border-2 border-green-500/40 bg-green-500/10 px-5 py-2.5 text-sm font-medium text-green-700 dark:text-green-400" : "btn-primary inline-flex items-center gap-2"}
            >
              {woreIt ? <Check className="h-4 w-4 shrink-0" /> : null}
              {woreIt ? "You're wearing it" : "I'm wearing this"}
            </button>
            <button type="button" onClick={() => setShowShareCard(true)} className="btn-secondary inline-flex items-center gap-2">
              <Download className="h-4 w-4 shrink-0" />
              Download card
            </button>
            <Link href="/outfit-builder" className="btn-secondary inline-flex items-center gap-2">
              <RefreshCw className="h-4 w-4 shrink-0" />
              Swap something
            </Link>
          </div>
          {showShareCard && (
            <Modal isOpen={true} onClose={() => setShowShareCard(false)}>
              <ModalContent className="p-6">
                <LookCard items={dailyPick} title={`Today's pick · ${dayLabel}`} showDownload />
                <button type="button" onClick={() => setShowShareCard(false)} className="mt-3 flex w-full items-center justify-center gap-2 text-sm text-[var(--text-muted)] hover:underline">
                  <X className="h-4 w-4 shrink-0" />
                  Close
                </button>
              </ModalContent>
            </Modal>
          )}
        </motion.section>
      )}

      {hydrated && items.length > 0 && !dailyPick && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
          className="card border-[var(--border)] bg-[var(--primary-muted)]/30 p-6"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
            Today's Clueless Pick
          </p>
          <p className="mt-2 text-[var(--text-muted)]">
            Add at least one top, one bottom, and one pair of shoes to your closet to get a daily pick. We'll suggest one outfit per day based on the weather and your style.
          </p>
          <Link href="/closet" className="btn-primary mt-5 inline-flex items-center gap-2">
            <Shirt className="h-4 w-4 shrink-0" />
            Open my closet
          </Link>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {[
          { title: "Digital closet", description: "Upload pieces, tag with AI, and see everything in one place.", href: "/closet", Icon: Shirt },
          { title: "Outfit builder", description: "Drag and drop to mix and match. Save your best looks.", href: "/outfit-builder", Icon: LayoutTemplate },
          { title: "Smart recommendations", description: "Weather, calendar, and event-based outfit suggestions.", href: "/recommendations", Icon: Lightbulb },
          { title: "Style quiz", description: "Set your aesthetic and preferences for better picks.", href: "/style-quiz", Icon: Palette },
        ].map((card) => {
          const { Icon } = card;
          return (
          <Link
            key={card.href}
            href={card.href}
            className="card card-interactive group block p-6"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                <h2 className="font-heading font-semibold text-[var(--foreground)]">
                  {card.title}
                </h2>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-[var(--primary)] opacity-0 transition group-hover:opacity-100" />
            </div>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {card.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] group-hover:underline">
              Go
              <ChevronRight className="h-4 w-4 shrink-0" />
            </span>
          </Link>
        ); })}
      </motion.section>
    </div>
  );
}
