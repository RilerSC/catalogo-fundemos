import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import {
  PreviewBanner,
  SiteFooter,
  SiteHeader,
} from "@/components/catalog/SiteChrome";
import { InterestNotice } from "@/components/interests/InterestNotice";
import { isCatalogPreview } from "@/lib/catalog/visibility";
import "./globals.css";

// Tipografía UI v1 del catálogo (no es tipografía institucional oficial):
// superfamilia Source, humanista y con buen soporte de diacríticos en español.
const sans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fundepos-sans",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fundepos-serif",
});

export const metadata: Metadata = {
  title: {
    default: "Oferta académica | Universidad FUNDEPOS",
    template: "%s | Universidad FUNDEPOS",
  },
  description:
    "Explore programas de Universidad FUNDEPOS: técnicos, especialistas, grados y posgrados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${sans.variable} ${serif.variable}`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <PreviewBanner enabled={isCatalogPreview()} />
        <SiteHeader />
        <InterestNotice />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
