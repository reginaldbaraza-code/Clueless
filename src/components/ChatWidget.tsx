"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClueless } from "@/context/CluelessContext";
import { MessageCircle, X, Send } from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; content: string };

/** Keep context short to reduce token usage */
function buildContext(items: { name: string; category: string; formality: string }[], stylePrefs: { defaultFormality?: string; lifestyle?: string } | null): string {
  const parts: string[] = [];
  if (items.length > 0) {
    const examples = items.slice(0, 4).map((i) => `${i.name} (${i.category})`).join(", ");
    parts.push(`${items.length} items. Examples: ${examples}.`);
  } else {
    parts.push("No closet items yet.");
  }
  if (stylePrefs?.defaultFormality) parts.push(`Formality: ${stylePrefs.defaultFormality}`);
  if (stylePrefs?.lifestyle) parts.push(stylePrefs.lifestyle);
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
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-[var(--shadow-lg)] transition hover:bg-[var(--primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] md:bottom-6"
        aria-label={open ? "Close chat" : "Open stylist chat"}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" aria-hidden />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-40 flex h-[420px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)]"
          >
            <div className="border-b border-[var(--border)] bg-[var(--primary-muted)]/50 px-4 py-3">
              <h3 className="font-heading font-semibold text-[var(--foreground)]">
                Clueless stylist
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Outfit & style advice
              </p>
            </div>
            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto p-4"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--surface-muted)] text-[var(--foreground)]"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-[var(--surface-muted)] px-4 py-2 text-sm text-[var(--text-muted)]">
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
              className="border-t border-[var(--border)] p-3"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask what to wear..."
                  className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="h-4 w-4 shrink-0" />
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
