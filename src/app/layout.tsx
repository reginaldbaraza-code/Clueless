import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { Header } from "@/components/Header";
import { AuthGate } from "@/components/AuthGate";
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
  title: { default: "Clueless – Outfit Selector", template: "%s – Clueless" },
  description: "Your digital closet. Weather-aware, style-driven outfit recommendations.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Clueless – Outfit Selector",
    description: "Your digital closet. Weather-aware, style-driven outfit recommendations.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clueless – Outfit Selector",
    description: "Your digital closet. Weather-aware, style-driven outfit recommendations.",
  },
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
        <AuthProvider>
          <AuthModalProvider>
            <Header />
            <main className="mx-auto min-h-[60vh] max-w-5xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8 md:pb-12 md:pt-10">
              <AuthGate>
                <Providers>
                  <ScrollToTop />
                  {children}
                </Providers>
              </AuthGate>
            </main>
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
