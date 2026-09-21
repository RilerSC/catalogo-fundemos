import type { Metadata } from "next";
import { CatalogScreen } from "@/components/catalog/CatalogScreen";
import { JsonLd } from "@/components/seo/JsonLd";
import { parseCatalogFilters } from "@/lib/catalog/search";
import { organizationJsonLd } from "@/lib/seo/jsonLd";
import {
  CATALOG_DESCRIPTION,
  DEFAULT_TITLE,
  documentTitle,
  openGraphWebsite,
  pageRobots,
  twitterSummary,
} from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const filters = parseCatalogFilters(await searchParams);
  const hasQuery = filters.query.trim().length > 0;
  const title = documentTitle(DEFAULT_TITLE);
  return {
    title: { absolute: documentTitle(DEFAULT_TITLE) },
    description: CATALOG_DESCRIPTION,
    alternates: { canonical: "/" },
    robots: pageRobots(!hasQuery),
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

export default function HomePage({ searchParams }: PageProps) {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <CatalogScreen searchParams={searchParams} />
    </>
  );
}
