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
import { BookingProvider } from "@/components/booking/BookingContext";
import { BookingFormModal } from "@/components/booking/BookingFormModal";

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
    "AI agents, chatbots, and on-site builds. Fixed price, shipped in weeks.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${serifAccent.variable} h-full antialiased no-scrollbar`}
    >
      <body className="no-scrollbar min-h-full flex flex-col bg-bg text-text">
        <BookingProvider>
          <ScrollProgress />
          <SectionRail />
          {children}
          <BookingFormModal />
        </BookingProvider>
        <FilmGrain />
      </body>
    </html>
  );
}
