import Image from "next/image";
import { Suspense } from "react";
import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import {
  getAcademicTypes,
  getCatalogPrograms,
  getKnowledgeFields,
} from "@/lib/catalog/queries";
import { parseCatalogFilters } from "@/lib/catalog/search";

type CatalogScreenProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function CatalogScreen({ searchParams }: CatalogScreenProps) {
  const params = await searchParams;
  const urlFilters = parseCatalogFilters(params);
  let loadError = false;
  let programs: Awaited<ReturnType<typeof getCatalogPrograms>> = [];
  let academicTypes: Awaited<ReturnType<typeof getAcademicTypes>> = [];
  let knowledgeFields: Awaited<ReturnType<typeof getKnowledgeFields>> = [];

  try {
    [programs, academicTypes, knowledgeFields] = await Promise.all([
      getCatalogPrograms(),
      getAcademicTypes(),
      getKnowledgeFields(),
    ]);
  } catch {
    loadError = true;
  }

  const summary = loadError
    ? []
    : [
        `${programs.length} ${programs.length === 1 ? "programa" : "programas"}`,
        `${academicTypes.length} tipos de programa`,
        `${knowledgeFields.length} campos de conocimiento`,
      ];

  return (
    <main className="flex-1">
      <section className="on-navy relative overflow-hidden bg-navy text-white">
        <Image
          src="/branding/fundepos-roseta-blanca.png"
          alt=""
          width={512}
          height={553}
          aria-hidden="true"
          priority
          className="pointer-events-none absolute -top-14 -right-16 hidden h-[22rem] w-auto opacity-[0.07] md:block"
        />
        <div className="relative mx-auto max-w-7xl px-4 pt-9 pb-20 md:pt-14 md:pb-24">
          <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-gold uppercase">
            Universidad FUNDEPOS
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-[2.1rem] leading-[1.1] font-semibold tracking-tight text-balance md:text-5xl">
            Oferta académica
          </h1>
          <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-white/75 md:text-lg">
            Técnicos, especialistas, grados y posgrados en un mismo lugar.
            Busque por tema, filtre por tipo y guarde los programas que quiera
            consultar después.
          </p>
          {summary.length > 0 ? (
            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
              {summary.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-1 rounded-full bg-gold"
                  />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {/* El buscador monta sobre el borde inferior de la banda azul */}
      <div className="relative z-10 mx-auto -mt-12 w-full max-w-7xl px-4 pb-12 md:pb-16">
        {loadError ? (
          <p className="rounded-2xl border border-line bg-card p-6 text-muted shadow-[0_8px_30px_rgba(15,30,61,0.08)]">
            No pudimos cargar el catálogo en este momento. Intente de nuevo más
            tarde.
          </p>
        ) : (
          <Suspense
            fallback={
              <p className="rounded-2xl border border-line bg-card p-6 text-muted">
                Cargando catálogo…
              </p>
            }
          >
            <CatalogExplorer
              programs={programs}
              academicTypes={academicTypes}
              knowledgeFields={knowledgeFields}
              urlFilters={urlFilters}
            />
          </Suspense>
        )}
      </div>
    </main>
  );
}
