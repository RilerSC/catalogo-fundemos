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

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:py-8">
      <header className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-navy md:text-3xl">
          Oferta académica
        </h1>
        <p className="mt-1.5 text-sm text-muted md:text-base">
          Explore técnicos, especialistas, grados y posgrados. Busque o filtre
          por tipo y campo de conocimiento.
        </p>
      </header>
      {loadError ? (
        <p className="mt-8 rounded-2xl bg-card p-6 text-muted">
          No pudimos cargar el catálogo en este momento. Intente de nuevo más
          tarde.
        </p>
      ) : (
        <div className="mt-6">
          <Suspense fallback={<p className="text-muted">Cargando catálogo…</p>}>
            <CatalogExplorer
              programs={programs}
              academicTypes={academicTypes}
              knowledgeFields={knowledgeFields}
              urlFilters={urlFilters}
            />
          </Suspense>
        </div>
      )}
    </main>
  );
}
