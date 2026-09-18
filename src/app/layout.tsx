import type { Metadata } from "next";
import {
  PreviewBanner,
  SiteFooter,
  SiteHeader,
} from "@/components/catalog/SiteChrome";
import { isCatalogPreview } from "@/lib/catalog/visibility";
import "./globals.css";

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
    <html lang="es">
      <body className="flex min-h-dvh flex-col">
        <PreviewBanner enabled={isCatalogPreview()} />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
