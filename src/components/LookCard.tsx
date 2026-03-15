"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { ItemImage } from "@/components/ItemImage";
import { Download } from "lucide-react";
import type { WardrobeItem } from "@/types/wardrobe";

interface LookCardProps {
  items: WardrobeItem[];
  title?: string;
  /** Show the download button (e.g. when embedded in a modal). */
  showDownload?: boolean;
}

export function LookCard({ items, title = "My look", showDownload = true }: LookCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `clueless-look-${Date.now()}.png`;
      a.click();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={cardRef}
        className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-5 shadow-lg"
        style={{ color: "var(--foreground)" }}
      >
        <p className="text-center font-heading text-lg font-bold text-[var(--primary)]">{title}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {items.map((item) => (
            <span key={item.id} className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)]/50 py-1.5 pl-1.5 pr-3">
              <ItemImage item={item} size="small" />
              <span className="text-sm font-medium">{item.name}</span>
            </span>
          ))}
        </div>
      </div>
      {showDownload && (
        <button type="button" onClick={handleDownload} disabled={downloading} className="btn-primary inline-flex items-center gap-2 text-sm">
          <Download className="h-4 w-4 shrink-0" />
          {downloading ? "Downloading…" : "Download as image"}
        </button>
      )}
    </div>
  );
}
