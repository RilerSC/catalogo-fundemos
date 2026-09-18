"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useSyncExternalStore } from "react";
import { ProgramCard } from "@/components/catalog/ProgramCard";
import { applyCatalogFilters, catalogQueryString } from "@/lib/catalog/search";
import type {
  CatalogFilters,
  CatalogProgramCard,
  CatalogTaxonomy,
} from "@/lib/catalog/types";

type CatalogExplorerProps = {
  programs: CatalogProgramCard[];
  academicTypes: CatalogTaxonomy[];
  knowledgeFields: CatalogTaxonomy[];
  urlFilters: CatalogFilters;
};

const emptySubscribe = () => () => undefined;

export function CatalogExplorer({
  programs,
  academicTypes,
  knowledgeFields,
  urlFilters,
}: CatalogExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const query = isClient ? (searchParams.get("q") ?? "") : urlFilters.query;
  const typeSlugs = isClient ? searchParams.getAll("type") : urlFilters.typeSlugs;
  const fieldSlugs = isClient
    ? searchParams.getAll("field")
    : urlFilters.fieldSlugs;
  const hasFilters = Boolean(query || typeSlugs.length || fieldSlugs.length);

  const visiblePrograms = useMemo(
    () =>
      applyCatalogFilters(programs, {
        query,
        typeSlugs,
        fieldSlugs,
      }),
    [programs, query, typeSlugs, fieldSlugs],
  );

  function replaceFilters(next: {
    query?: string;
    typeSlugs?: string[];
    fieldSlugs?: string[];
  }) {
    const href = `${pathname}${catalogQueryString({
      query: next.query ?? query,
      typeSlugs: next.typeSlugs ?? typeSlugs,
      fieldSlugs: next.fieldSlugs ?? fieldSlugs,
    })}`;
    router.replace(href, { scroll: false });
  }

  function toggleValue(values: string[], slug: string): string[] {
    return values.includes(slug)
      ? values.filter((value) => value !== slug)
      : [...values, slug];
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      <aside>
        <details className="rounded-2xl border border-[#ddd6cb] bg-white p-4 lg:hidden">
          <summary className="cursor-pointer font-medium text-[#14263d]">
            Filtros
          </summary>
          <div className="mt-4">
            <FilterFields
              academicTypes={academicTypes}
              knowledgeFields={knowledgeFields}
              typeSlugs={typeSlugs}
              fieldSlugs={fieldSlugs}
              onToggleType={(slug) =>
                replaceFilters({ typeSlugs: toggleValue(typeSlugs, slug) })
              }
              onToggleField={(slug) =>
                replaceFilters({ fieldSlugs: toggleValue(fieldSlugs, slug) })
              }
            />
          </div>
        </details>
        <div className="hidden lg:block">
          <FilterFields
            academicTypes={academicTypes}
            knowledgeFields={knowledgeFields}
            typeSlugs={typeSlugs}
            fieldSlugs={fieldSlugs}
            onToggleType={(slug) =>
              replaceFilters({ typeSlugs: toggleValue(typeSlugs, slug) })
            }
            onToggleField={(slug) =>
              replaceFilters({ fieldSlugs: toggleValue(fieldSlugs, slug) })
            }
          />
        </div>
      </aside>
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <label className="block min-w-0 flex-1">
            <span className="mb-1 block text-sm font-medium text-[#14263d]">
              Buscar programas
            </span>
            <input
              type="search"
              name="q"
              value={query}
              onChange={(event) => replaceFilters({ query: event.target.value })}
              placeholder="Ej. riesgos, dirección, inteligencia artificial"
              className="w-full rounded-xl border border-[#ddd6cb] bg-white px-3 py-2.5 text-[#14263d]"
            />
          </label>
          <p className="text-sm text-[#5b6575]">
            {visiblePrograms.length}{" "}
            {visiblePrograms.length === 1 ? "programa" : "programas"}
          </p>
        </div>
        {hasFilters ? (
          <p className="mt-3">
            <button
              type="button"
              onClick={() =>
                replaceFilters({ query: "", typeSlugs: [], fieldSlugs: [] })
              }
              className="text-sm font-medium text-[#1e3a5f] underline"
            >
              Limpiar filtros
            </button>
          </p>
        ) : null}
        {visiblePrograms.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#ddd6cb] bg-white p-8 text-center">
            <p className="text-lg font-medium text-[#14263d]">
              No encontramos programas con estos filtros.
            </p>
            <button
              type="button"
              onClick={() =>
                replaceFilters({ query: "", typeSlugs: [], fieldSlugs: [] })
              }
              className="mt-4 rounded-full bg-[#14263d] px-4 py-2 text-sm text-white"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {visiblePrograms.map((program) => (
              <li key={program.slug}>
                <ProgramCard program={program} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FilterFields({
  academicTypes,
  knowledgeFields,
  typeSlugs,
  fieldSlugs,
  onToggleType,
  onToggleField,
}: {
  academicTypes: CatalogTaxonomy[];
  knowledgeFields: CatalogTaxonomy[];
  typeSlugs: string[];
  fieldSlugs: string[];
  onToggleType: (slug: string) => void;
  onToggleField: (slug: string) => void;
}) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-sm font-semibold text-[#14263d]">
          ¿Qué tipo de programa quiero estudiar?
        </legend>
        <ul className="mt-3 space-y-2">
          {academicTypes.map((type) => (
            <li key={type.slug}>
              <label className="flex cursor-pointer items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={typeSlugs.includes(type.slug)}
                  onChange={() => onToggleType(type.slug)}
                  className="mt-0.5"
                />
                <span>{type.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <fieldset>
        <legend className="text-sm font-semibold text-[#14263d]">
          ¿Sobre qué quiero estudiar?
        </legend>
        <ul className="mt-3 space-y-2">
          {knowledgeFields.map((field) => (
            <li key={field.slug}>
              <label className="flex cursor-pointer items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={fieldSlugs.includes(field.slug)}
                  onChange={() => onToggleField(field.slug)}
                  className="mt-0.5"
                />
                <span>{field.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  );
}
