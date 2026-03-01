"use client";

import { CluelessProvider } from "@/context/CluelessContext";
import { ChatWidget } from "@/components/ChatWidget";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CluelessProvider>
      {children}
      <ChatWidget />
    </CluelessProvider>
  );
}
