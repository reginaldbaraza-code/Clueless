"use client";

import { CluelessProvider } from "@/context/CluelessContext";
import { ChatWidget } from "@/components/ChatWidget";
import { DebugFloater } from "@/components/DebugFloater";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CluelessProvider>
      {children}
      <ChatWidget />
      <DebugFloater />
    </CluelessProvider>
  );
}
