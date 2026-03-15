import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Outfit builder",
};

export default function OutfitBuilderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
