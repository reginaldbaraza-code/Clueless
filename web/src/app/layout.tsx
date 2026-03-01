import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppNav } from "@/components/AppNav";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clueless – Outfit Selector",
  description: "Your digital closet. Weather-aware, style-driven outfit recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[var(--cream)] antialiased text-stone-800 dark:text-stone-100`}
      >
        <header className="sticky top-0 z-40 border-b border-amber-200/60 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <a href="/" className="text-xl font-bold tracking-tight text-amber-900 dark:text-amber-100">
              Clueless
            </a>
            <AppNav />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:pb-8">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
