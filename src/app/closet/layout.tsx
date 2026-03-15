import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Closet",
};

export default function ClosetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
