import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { ScrollToTop } from "@/components/ScrollToTop";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
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
        className={`${outfit.variable} ${dmSans.variable} ${geistMono.variable} min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased`}
      >
        <Header />
        <main className="mx-auto min-h-[60vh] max-w-6xl px-4 pb-24 pt-8 md:pb-10 md:pt-10">
          <Providers>
            <ScrollToTop />
            {children}
          </Providers>
        </main>
      </body>
    </html>
  );
}
