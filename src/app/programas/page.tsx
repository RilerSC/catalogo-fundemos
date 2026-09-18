import type { Metadata } from "next";
import { CatalogScreen } from "@/components/catalog/CatalogScreen";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de programas",
  description:
    "Filtre y busque la oferta académica de Universidad FUNDEPOS por tipo de programa y campo de conocimiento.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function ProgramasPage({ searchParams }: PageProps) {
  return <CatalogScreen searchParams={searchParams} />;
}
