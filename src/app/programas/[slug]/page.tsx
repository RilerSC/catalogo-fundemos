import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramDetail } from "@/components/catalog/ProgramDetail";
import { getCatalogPrograms, getProgramBySlug } from "@/lib/catalog/queries";
import { relatedCatalogPrograms } from "@/lib/catalog/related";

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
    notFound();
  }
  return {
    title: program.seoTitle || program.name,
    description: program.seoDescription || program.shortDescription || undefined,
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
      <ProgramDetail
        program={program}
        related={relatedCatalogPrograms(program, catalog)}
      />
    </main>
  );
}
