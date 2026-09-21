import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import {
  PreviewBanner,
  SiteFooter,
  SiteHeader,
} from "@/components/catalog/SiteChrome";
import { InterestNotice } from "@/components/interests/InterestNotice";
import { isCatalogPreview } from "@/lib/catalog/visibility";
import {
  CATALOG_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  documentTitle,
  openGraphWebsite,
  pageRobots,
  twitterSummary,
} from "@/lib/seo/metadata";
import { getSiteUrl } from "@/lib/seo/siteUrl";
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

export async function generateMetadata(): Promise<Metadata> {
  const title = documentTitle(DEFAULT_TITLE);
  return {
    metadataBase: getSiteUrl(),
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description: CATALOG_DESCRIPTION,
    robots: pageRobots(true),
    icons: {
      icon: "/branding/fundepos-roseta.png",
    },
    openGraph: openGraphWebsite({
      title,
      description: CATALOG_DESCRIPTION,
      path: "/",
    }),
    twitter: twitterSummary({
      title,
      description: CATALOG_DESCRIPTION,
    }),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${sans.variable} ${serif.variable}`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <AnalyticsProvider>
          <PreviewBanner enabled={isCatalogPreview()} />
          <SiteHeader />
          <InterestNotice />
          {children}
          <SiteFooter />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
