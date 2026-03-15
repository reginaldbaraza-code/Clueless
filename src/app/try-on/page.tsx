"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useClueless } from "@/context/CluelessContext";
import { ItemImage } from "@/components/ItemImage";
import { getItemImageUrl } from "@/lib/item-image";
import { Camera, Shirt, Sparkles, RefreshCw } from "lucide-react";
import type { WardrobeItem } from "@/types/wardrobe";

const TRY_ON_CATEGORIES: WardrobeItem["category"][] = [
  "top",
  "outerwear",
  "bottom",
  "dress",
  "one-piece",
];

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function TryOnPage() {
  const { items } = useClueless();
  const [personDataUrl, setPersonDataUrl] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tryOnItems = items.filter((i) => TRY_ON_CATEGORIES.includes(i.category));
  const garmentDescription = selectedItem
    ? [selectedItem.name, ...(selectedItem.tags || []).slice(0, 3)].join(" ")
    : "";

  const handlePersonPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setPersonDataUrl(dataUrl);
      setStatus("idle");
      setResultImageUrl(null);
      setErrorMessage(null);
    } catch {
      setErrorMessage("Could not load photo.");
    }
  };

  const handleTryOn = async () => {
    if (!personDataUrl || !selectedItem) return;
    setStatus("loading");
    setErrorMessage(null);
    setResultImageUrl(null);

    const garmentImageUrl = getItemImageUrl(selectedItem, 512);

    try {
      const res = await fetch("/api/try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personImage: personDataUrl,
          garmentImageUrl,
          category: selectedItem.category,
          garmentDescription,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 503 && data.error === "no_api_key") {
          setErrorMessage(
            "Virtual try-on is not configured. Add REPLICATE_API_TOKEN to .env.local (get a token at replicate.com/account)."
          );
        } else {
          setErrorMessage(data.message || data.error || "Try-on failed. Try another photo or garment.");
        }
        setStatus("error");
        return;
      }

      if (data.imageUrl) {
        setResultImageUrl(data.imageUrl);
        setStatus("done");
      } else {
        setErrorMessage("No result image returned.");
        setStatus("error");
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Request failed.");
      setStatus("error");
    }
  };

  const canTryOn = personDataUrl && selectedItem && status !== "loading";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading flex items-center gap-2 text-2xl font-bold text-[var(--foreground)]">
          <Sparkles className="h-7 w-7 shrink-0 text-[var(--primary)]" />
          Virtual try-on
        </h1>
        <p className="mt-1 text-[var(--text-muted)]">
          Upload a photo of yourself (full body or upper body, front-facing) and pick a garment from your closet to see how it looks on you.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="card space-y-6 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
            1. Your photo
          </h2>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePersonPhoto}
            className="hidden"
          />
          {personDataUrl ? (
            <div className="relative">
              <img
                src={personDataUrl}
                alt="You"
                className="w-full rounded-xl border border-[var(--border)] object-contain bg-[var(--surface-muted)]/50"
                style={{ maxHeight: 360, objectFit: "contain" }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 inline-flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline"
              >
                <RefreshCw className="h-4 w-4 shrink-0" />
                Change photo
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)]/30 text-[var(--text-muted)] transition hover:border-[var(--primary)] hover:bg-[var(--primary-muted)]/20"
            >
                <Camera className="h-10 w-10 shrink-0" />
                <span className="text-sm font-medium">Tap to upload</span>
                <span className="text-xs">Full body or upper body, front-facing</span>
              </button>
          )}

          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
            2. Garment from closet
          </h2>
          {tryOnItems.length === 0 ? (
            <>
              <p className="text-sm text-[var(--text-muted)]">
                Add tops, bottoms, or dresses in your closet first.
              </p>
              <Link href="/closet" className="btn-primary inline-flex items-center gap-2">
                <Shirt className="h-4 w-4 shrink-0" />
                Open closet
              </Link>
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tryOnItems.map((item) => (
                <motion.button
                  key={item.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedItem(item);
                    setStatus("idle");
                    setResultImageUrl(null);
                    setErrorMessage(null);
                  }}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
                    selectedItem?.id === item.id
                      ? "border-[var(--primary)] bg-[var(--primary-muted)]/50 text-[var(--primary)]"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--primary)]"
                  }`}
                >
                  <ItemImage item={item} size="small" />
                  <span className="max-w-[120px] truncate">{item.name}</span>
                </motion.button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleTryOn}
            disabled={!canTryOn}
            className="btn-primary inline-flex w-full items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            {status === "loading" ? "Generating… (about 15–20 sec)" : "Try on"}
          </button>
        </section>

        <section className="card min-h-[200px] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
            Result
          </h2>
          {status === "loading" && (
            <div className="mt-6 flex flex-col items-center justify-center gap-3 py-12 text-[var(--text-muted)]">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]" />
              <p className="text-sm">Rendering your try-on…</p>
            </div>
          )}
          {status === "done" && resultImageUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              <img
                src={resultImageUrl}
                alt="Virtual try-on result"
                className="w-full rounded-xl border border-[var(--border)] object-contain bg-[var(--surface-muted)]/50"
              />
            </motion.div>
          )}
          {status === "error" && errorMessage && (
            <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
          )}
          {status === "idle" && !resultImageUrl && !errorMessage && (
            <p className="mt-6 text-sm text-[var(--text-muted)]">
              Upload a photo and pick a garment, then tap Try on.
            </p>
          )}
        </section>
      </div>

      <p className="text-xs text-[var(--text-muted)]">
        Powered by AI try-on (Replicate). Best results with a clear, front-facing photo and a clear garment image. For non-commercial use.
      </p>
    </div>
  );
}
