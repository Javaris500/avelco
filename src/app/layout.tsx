import type { Metadata } from "next";
import {
  Inter,
  Space_Grotesk,
  Fraunces,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";
import { FilmGrain } from "@/components/landing/FilmGrain";
import { ScrollProgress } from "@/components/landing/ScrollProgress";
import { SectionRail } from "@/components/landing/SectionRail";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

const serifAccent = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif-accent",
  weight: ["400", "500", "600"],
  style: ["italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Avel — Built with intent.",
  description:
    "Productized software builds. Fixed scope, fixed price, shipped in weeks — not quarters.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${serifAccent.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <ScrollProgress />
        <SectionRail />
        {children}
        <FilmGrain />
      </body>
    </html>
  );
}
