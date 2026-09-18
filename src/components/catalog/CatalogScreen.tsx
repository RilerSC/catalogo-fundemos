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
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-[#14263d] md:text-4xl">
        Catálogo de programas
      </h1>
      <p className="mt-3 max-w-2xl text-[#5b6575]">
        Combine búsqueda, tipo de programa y campo de conocimiento para
        encontrar la oferta que le interesa.
      </p>
      {loadError ? (
        <p className="mt-8 rounded-2xl bg-white p-6 text-[#5b6575]">
          No pudimos cargar el catálogo en este momento. Intente de nuevo más
          tarde.
        </p>
      ) : (
        <div className="mt-8">
          <Suspense fallback={<p>Cargando catálogo…</p>}>
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
