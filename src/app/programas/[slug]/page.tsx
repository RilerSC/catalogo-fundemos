import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramDetail } from "@/components/catalog/ProgramDetail";
import { getProgramBySlug } from "@/lib/catalog/queries";

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
  const program = await getProgramBySlug(slug);
  if (!program) {
    notFound();
  }

  return (
    <main className="flex-1 px-4 py-8 md:py-10">
      <ProgramDetail program={program} />
    </main>
  );
}
