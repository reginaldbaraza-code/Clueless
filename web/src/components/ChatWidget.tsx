"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClueless } from "@/context/CluelessContext";

type ChatMessage = { role: "user" | "assistant"; content: string };

function buildContext(items: { name: string; category: string; formality: string }[], stylePrefs: { defaultFormality?: string; lifestyle?: string } | null): string {
  const parts: string[] = [];
  if (items.length > 0) {
    parts.push(`Closet has ${items.length} items. Examples: ${items.slice(0, 8).map((i) => `${i.name} (${i.category}, ${i.formality})`).join("; ")}.`);
  } else {
    parts.push("User hasn't added any closet items yet.");
  }
  if (stylePrefs?.defaultFormality) parts.push(`Default formality: ${stylePrefs.defaultFormality}.`);
  if (stylePrefs?.lifestyle) parts.push(`Lifestyle: ${stylePrefs.lifestyle}.`);
  return parts.join(" ");
}

export function ChatWidget() {
  const { items, stylePreferences } = useClueless();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hey! I’m your Clueless stylist. Ask me what to wear for the weather, an event, or just for ideas—I’ve got you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [open, messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    const context = buildContext(
      items.map((i) => ({ name: i.name, category: i.category, formality: i.formality })),
      stylePreferences
    );

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          context,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        const fallback = data.fallback || data.message || "Something went wrong. Try again?";
        setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Couldn’t reach the stylist. Check your connection and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 md:bottom-6"
        aria-label={open ? "Close chat" : "Open stylist chat"}
      >
        {open ? (
          <span className="text-xl">×</span>
        ) : (
          <span className="text-2xl" aria-hidden>💬</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-40 flex h-[420px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-amber-200/60 bg-white shadow-xl dark:border-amber-800/60 dark:bg-stone-900"
          >
            <div className="border-b border-amber-200/60 bg-amber-50/80 px-4 py-3 dark:border-amber-800/60 dark:bg-amber-900/20">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                Clueless stylist
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Outfit & style advice
              </p>
            </div>
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-amber-600 text-white dark:bg-amber-500"
                        : "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-stone-100 px-4 py-2 text-sm text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                    Thinking…
                  </div>
                </div>
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="border-t border-amber-200/60 p-3 dark:border-amber-800/60"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask what to wear..."
                  className="flex-1 rounded-xl border border-amber-200/80 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 dark:border-amber-800 dark:bg-stone-800 dark:text-stone-100"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-50 dark:bg-amber-500 dark:hover:bg-amber-600"
                >
                  Send
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
