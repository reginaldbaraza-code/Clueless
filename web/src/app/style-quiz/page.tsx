"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useClueless } from "@/context/CluelessContext";
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
        <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-50">
          Style quiz
        </h1>
        <p className="mt-1 text-stone-600 dark:text-stone-400">
          Tell us your vibe so we can recommend outfits you’ll love.
        </p>
      </div>

      {!completed ? (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl border border-amber-200/60 bg-white p-6 dark:bg-stone-900/50 dark:border-amber-800/60"
        >
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                What aesthetics do you love?
              </h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
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
                        ? "bg-amber-600 text-white dark:bg-amber-500"
                        : "bg-amber-100/80 text-amber-900 hover:bg-amber-200/80 dark:bg-amber-900/40 dark:text-amber-100 dark:hover:bg-amber-800/60"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                What’s your lifestyle?
              </h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
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
                        ? "bg-amber-600 text-white dark:bg-amber-500"
                        : "bg-amber-100/80 text-amber-900 hover:bg-amber-200/80 dark:bg-amber-900/40 dark:text-amber-100 dark:hover:bg-amber-800/60"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm font-medium text-amber-800 hover:underline dark:text-amber-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!lifestyle}
                  className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-50 dark:bg-amber-500 dark:hover:bg-amber-600"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                Default formality
              </h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
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
                        ? "bg-amber-600 text-white dark:bg-amber-500"
                        : "bg-amber-100/80 text-amber-900 hover:bg-amber-200/80 dark:bg-amber-900/40 dark:text-amber-100 dark:hover:bg-amber-800/60"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-sm font-medium text-amber-800 hover:underline dark:text-amber-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={!defaultFormality}
                  className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-50 dark:bg-amber-500 dark:hover:bg-amber-600"
                >
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
          className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-8 text-center dark:border-amber-800/60 dark:bg-amber-900/20"
        >
          <p className="text-lg font-semibold text-amber-900 dark:text-amber-100">
            You’re all set!
          </p>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            We’ll use your preferences to improve recommendations. Head to your closet or get a daily pick.
          </p>
          <a
            href="/recommendations"
            className="mt-6 inline-block rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
          >
            Get recommendations
          </a>
        </motion.div>
      )}
    </div>
  );
}
