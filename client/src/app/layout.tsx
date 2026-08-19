import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Lexend } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/store/provider";

import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Lexend({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Qlyno Hospital Admin Panel",
    template: "%s · Qlyno Admin",
  },
  description:
    "Hospital Admin Panel for Qlyno — manage doctors, clinic staff, patients, vendors, billing and operations from a single control center.",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d6e6d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} font-sans`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
