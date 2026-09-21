import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewItemTracker } from "@/components/analytics/ViewItemTracker";
import { ProgramDetail } from "@/components/catalog/ProgramDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import { toAnalyticsItem } from "@/lib/analytics/types";
import { getCatalogPrograms, getProgramBySlug } from "@/lib/catalog/queries";
import { relatedCatalogPrograms } from "@/lib/catalog/related";
import { breadcrumbListJsonLd } from "@/lib/seo/jsonLd";
import {
  CATALOG_DESCRIPTION,
  compactMetaDescription,
  documentTitle,
  openGraphWebsite,
  pageRobots,
  twitterSummary,
} from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) {
    return {
      title: "Página no encontrada",
      robots: { index: false, follow: false },
    };
  }

  const titleSource = program.seoTitle?.trim() || program.name;
  const description =
    compactMetaDescription(program.seoDescription) ??
    compactMetaDescription(program.shortDescription) ??
    CATALOG_DESCRIPTION;
  const path = `/programas/${program.slug}`;
  const title = documentTitle(titleSource);

  return {
    title: titleSource,
    description,
    alternates: { canonical: path },
    robots: pageRobots(true),
    openGraph: openGraphWebsite({
      title,
      description,
      path,
    }),
    twitter: twitterSummary({
      title,
      description,
    }),
  };
}

export default async function ProgramPage({ params }: PageProps) {
  const { slug } = await params;
  const [program, catalog] = await Promise.all([
    getProgramBySlug(slug),
    getCatalogPrograms().catch(() => []),
  ]);
  if (!program) {
    notFound();
  }

  return (
    <main className="flex-1">
      <ViewItemTracker item={toAnalyticsItem(program)} />
      <JsonLd
        data={breadcrumbListJsonLd({
          programName: program.name,
          slug: program.slug,
        })}
      />
      <ProgramDetail
        program={program}
        related={relatedCatalogPrograms(program, catalog)}
      />
    </main>
  );
}
