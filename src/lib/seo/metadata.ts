import type { Metadata } from "next";
import { isCatalogPreview } from "@/lib/catalog/visibility";

export const SITE_NAME = "Universidad FUNDEPOS";

export const DEFAULT_TITLE = "Oferta académica";

export const CATALOG_DESCRIPTION =
  "Explore la oferta académica de Universidad FUNDEPOS: educación continua, técnicos, especialistas, grados y posgrados.";

export function documentTitle(title: string): string {
  return `${title} | ${SITE_NAME}`;
}

export function pageRobots(indexable: boolean): Metadata["robots"] {
  if (isCatalogPreview()) {
    return { index: false, follow: false };
  }
  return indexable
    ? { index: true, follow: true }
    : { index: false, follow: true };
}

export function compactMetaDescription(
  value: string | null | undefined,
  maxLength = 160,
): string | undefined {
  if (!value) {
    return undefined;
  }
  const compact = value.replace(/\s+/g, " ").trim();
  if (!compact) {
    return undefined;
  }
  if (compact.length <= maxLength) {
    return compact;
  }
  const slice = compact.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 80 ? slice.slice(0, lastSpace) : slice.trimEnd();
  return cut;
}

export function openGraphWebsite(input: {
  title: string;
  description: string;
  path: string;
}): NonNullable<Metadata["openGraph"]> {
  return {
    title: input.title,
    description: input.description,
    url: input.path,
    siteName: SITE_NAME,
    locale: "es_CR",
    type: "website",
  };
}

export function twitterSummary(input: {
  title: string;
  description: string;
}): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary",
    title: input.title,
    description: input.description,
  };
}
