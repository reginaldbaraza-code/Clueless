"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useClueless } from "@/context/CluelessContext";
import { ChevronRight, ChevronLeft, Check, Sparkles, Palette, Building2, Sliders } from "lucide-react";
import type { Aesthetic, StylePreferences } from "@/types/style";

const AESTHETICS: { value: Aesthetic; label: string }[] = [
  { value: "minimalist", label: "Minimalist" },
  { value: "streetwear", label: "Streetwear" },
  { value: "romantic", label: "Romantic" },
  { value: "classic", label: "Classic" },
  { value: "bohemian", label: "Bohemian" },
  { value: "edgy", label: "Edgy" },
  { value: "preppy", label: "Preppy" },
  { value: "athleisure", label: "Athleisure" },
];

const LIFESTYLES: { value: StylePreferences["lifestyle"]; label: string }[] = [
  { value: "corporate", label: "Corporate" },
  { value: "student", label: "Student" },
  { value: "remote", label: "Remote" },
  { value: "creative", label: "Creative" },
  { value: "mixed", label: "Mixed" },
];

const FORMALITY: { value: StylePreferences["defaultFormality"]; label: string }[] = [
  { value: "casual", label: "Casual" },
  { value: "smart-casual", label: "Smart casual" },
  { value: "business", label: "Business" },
  { value: "formal", label: "Formal" },
];

export default function StyleQuizPage() {
  const { stylePreferences, saveStylePreferences } = useClueless();
  const [step, setStep] = useState(1);
  const [aesthetics, setAesthetics] = useState<Aesthetic[]>([]);
  const [lifestyle, setLifestyle] = useState<StylePreferences["lifestyle"] | null>(null);
  const [defaultFormality, setDefaultFormality] = useState<StylePreferences["defaultFormality"] | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (stylePreferences) {
      setAesthetics(stylePreferences.aesthetics ?? []);
      setLifestyle(stylePreferences.lifestyle ?? null);
      setDefaultFormality(stylePreferences.defaultFormality ?? null);
      setCompleted(!!stylePreferences.completedAt);
    }
  }, [stylePreferences]);

  const toggleAesthetic = (a: Aesthetic) => {
    setAesthetics((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const handleComplete = () => {
    if (!lifestyle || !defaultFormality) return;
    saveStylePreferences({
      aesthetics,
      defaultFormality,
      colorComfort: [],
      lifestyle,
    });
    setCompleted(true);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-heading flex items-center gap-2 text-2xl font-bold text-[var(--foreground)]">
          <Palette className="h-7 w-7 shrink-0 text-[var(--primary)]" />
          Style quiz
        </h1>
        <p className="mt-1 text-[var(--text-muted)]">
          Tell us your vibe so we can recommend outfits you’ll love.
        </p>
      </div>

      {!completed ? (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          {step === 1 && (
            <>
              <h2 className="font-heading flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
                <Sparkles className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                What aesthetics do you love?
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Pick one or more.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {AESTHETICS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleAesthetic(opt.value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      aesthetics.includes(opt.value)
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--primary-muted)] text-[var(--primary)] hover:opacity-90"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button type="button" onClick={() => setStep(2)} className="btn-primary inline-flex items-center gap-2">
                  Next
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-heading flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
                <Building2 className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                What’s your lifestyle?
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Helps us tailor occasions (work, weekend, etc.).
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {LIFESTYLES.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLifestyle(opt.value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      lifestyle === opt.value
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--primary-muted)] text-[var(--primary)] hover:opacity-90"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline">
                  <ChevronLeft className="h-4 w-4 shrink-0" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!lifestyle}
                  className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-heading flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
                <Sliders className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                Default formality
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                When we don’t know the occasion, we’ll lean toward this.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {FORMALITY.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDefaultFormality(opt.value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      defaultFormality === opt.value
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--primary-muted)] text-[var(--primary)] hover:opacity-90"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <button type="button" onClick={() => setStep(2)} className="flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline">
                  <ChevronLeft className="h-4 w-4 shrink-0" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={!defaultFormality}
                  className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <Check className="h-4 w-4 shrink-0" />
                  Save my style
                </button>
              </div>
            </>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-[var(--primary-muted)]/30 p-8 text-center"
        >
          <p className="font-heading flex items-center justify-center gap-2 text-lg font-semibold text-[var(--foreground)]">
            <Check className="h-5 w-5 shrink-0 text-[var(--primary)]" />
            You’re all set!
          </p>
          <p className="mt-2 text-[var(--text-muted)]">
            We’ll use your preferences to improve recommendations. Head to your closet or get a daily pick.
          </p>
          <a href="/recommendations" className="btn-primary mt-6 inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0" />
            Get recommendations
          </a>
        </motion.div>
      )}
    </div>
  );
}
