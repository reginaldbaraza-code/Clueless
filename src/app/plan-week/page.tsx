"use client";

import { useState, useMemo } from "react";
import { useClueless } from "@/context/CluelessContext";
import { useWeather } from "@/hooks/useWeather";
import { getDailyPick } from "@/lib/recommendations";
import { ItemImage } from "@/components/ItemImage";
import { CalendarDays } from "lucide-react";
import type { WardrobeItem } from "@/types/wardrobe";
import type { Formality } from "@/types/wardrobe";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FORMALITY_OPTIONS: Formality[] = ["casual", "smart-casual", "business", "formal", "athletic"];

export default function PlanWeekPage() {
  const { items, stylePreferences } = useClueless();
  const { weather } = useWeather();
  const [eventByDay, setEventByDay] = useState<Record<number, Formality>>({});
  const formalityDefault = stylePreferences?.defaultFormality ?? "casual";

  const weekPicks = useMemo(() => {
    const result: (WardrobeItem[] | null)[] = [];
    const today = new Date();
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() + d);
      const formality = eventByDay[d] ?? formalityDefault;
      const pick = getDailyPick(items, [], { weather: weather ?? undefined, formality, rotateCloset: true }, date);
      result.push(pick);
    }
    return result;
  }, [items, weather, formalityDefault, eventByDay]);

  const setEvent = (dayIndex: number, formality: Formality) => {
    setEventByDay((prev) => ({ ...prev, [dayIndex]: formality }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading flex items-center gap-2 text-2xl font-bold text-[var(--foreground)]">
          <CalendarDays className="h-7 w-7 shrink-0 text-[var(--primary)]" />
          Plan my week
        </h1>
        <p className="mt-1 text-[var(--text-muted)]">Set the vibe per day and get one outfit suggestion per day.</p>
      </div>

      <div className="space-y-4">
        {weekPicks.map((pick, d) => (
          <div key={d} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-3">
              <span className="w-12 shrink-0 font-heading font-semibold text-[var(--primary)]">{DAYS[d]}</span>
              <select
                value={eventByDay[d] ?? ""}
                onChange={(e) => setEvent(d, ((e.target.value || formalityDefault) as Formality))}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--foreground)]"
              >
                <option value="">Default</option>
                {FORMALITY_OPTIONS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              {pick && pick.length > 0 ? (
                pick.map((item) => (
                  <span key={item.id} className="flex max-w-full items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-muted)]/50 py-1 pl-1 pr-2">
                    <ItemImage item={item} size="small" />
                    <span className="min-w-0 truncate text-xs font-medium text-[var(--foreground)]">{item.name}</span>
                  </span>
                ))
              ) : (
                <span className="text-sm text-[var(--text-muted)]">Add tops, bottoms & shoes to get picks</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
