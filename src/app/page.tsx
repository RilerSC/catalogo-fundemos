import type { Metadata } from "next";
import { CatalogScreen } from "@/components/catalog/CatalogScreen";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Oferta académica",
  description:
    "Descubra la oferta académica de Universidad FUNDEPOS. Busque y filtre programas por tipo y campo de conocimiento.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function HomePage({ searchParams }: PageProps) {
  return <CatalogScreen searchParams={searchParams} />;
}
