"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProgramCard } from "@/components/catalog/ProgramCard";
import {
  applyCatalogFilters,
  catalogQueryString,
  parseCatalogSearchParams,
} from "@/lib/catalog/search";
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

const SEARCH_URL_SYNC_MS = 200;

const EMPTY_FILTERS: CatalogFilters = {
  query: "",
  typeSlugs: [],
  fieldSlugs: [],
};

export function CatalogExplorer({
  programs,
  academicTypes,
  knowledgeFields,
  urlFilters,
}: CatalogExplorerProps) {
  const pathname = usePathname();
  const [filters, setFilters] = useState<CatalogFilters>(urlFilters);
  const filtersRef = useRef(urlFilters);
  const urlSyncTimer = useRef<number | null>(null);

  useEffect(() => {
    function onPopState() {
      const next = parseCatalogSearchParams(
        new URLSearchParams(window.location.search),
      );
      filtersRef.current = next;
      setFilters(next);
    }
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      if (urlSyncTimer.current !== null) {
        window.clearTimeout(urlSyncTimer.current);
      }
    };
  }, []);

  const visiblePrograms = useMemo(
    () => applyCatalogFilters(programs, filters),
    [programs, filters],
  );
  const activeFilterCount =
    filters.typeSlugs.length + filters.fieldSlugs.length;
  const hasFilters = Boolean(filters.query || activeFilterCount);

  function syncUrl(next: CatalogFilters) {
    const href = `${pathname}${catalogQueryString(next)}`;
    const current = `${window.location.pathname}${window.location.search}`;
    if (href === current) {
      return;
    }
    // History API keeps the URL shareable without App Router navigation,
    // so CatalogScreen does not refetch Neon on each interaction.
    window.history.replaceState(null, "", href);
  }

  function applyFilters(
    patch: (current: CatalogFilters) => CatalogFilters,
    url: "now" | "debounce",
  ) {
    const next = patch(filtersRef.current);
    filtersRef.current = next;
    setFilters(next);
    if (urlSyncTimer.current !== null) {
      window.clearTimeout(urlSyncTimer.current);
      urlSyncTimer.current = null;
    }
    if (url === "debounce") {
      urlSyncTimer.current = window.setTimeout(() => {
        syncUrl(next);
        urlSyncTimer.current = null;
      }, SEARCH_URL_SYNC_MS);
      return;
    }
    syncUrl(next);
  }

  function toggleValue(values: string[], slug: string): string[] {
    return values.includes(slug)
      ? values.filter((value) => value !== slug)
      : [...values, slug];
  }

  const filterHandlers = {
    onToggleType: (slug: string) =>
      applyFilters(
        (current) => ({
          ...current,
          typeSlugs: toggleValue(current.typeSlugs, slug),
        }),
        "now",
      ),
    onToggleField: (slug: string) =>
      applyFilters(
        (current) => ({
          ...current,
          fieldSlugs: toggleValue(current.fieldSlugs, slug),
        }),
        "now",
      ),
  };

  return (
    <div>
      <div className="rounded-2xl border border-line bg-card p-4 shadow-[0_1px_2px_rgba(20,38,61,0.04)] md:p-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-navy">
            Buscar programas
          </span>
          <input
            type="search"
            name="q"
            value={filters.query}
            onChange={(event) => {
              const query = event.target.value;
              applyFilters((current) => ({ ...current, query }), "debounce");
            }}
            placeholder="Riesgos, dirección, inteligencia artificial…"
            className="w-full min-w-0 rounded-xl border border-line bg-paper px-4 py-3.5 text-base text-navy placeholder:text-muted/80"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[15.5rem_minmax(0,1fr)] xl:grid-cols-[16.5rem_minmax(0,1fr)]">
        <aside>
          <details className="rounded-2xl border border-line bg-card p-4 lg:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-medium text-navy [&::-webkit-details-marker]:hidden">
              <span>Filtros</span>
              {activeFilterCount > 0 ? (
                <span className="rounded-full bg-navy px-2 py-0.5 text-xs font-medium text-white">
                  {activeFilterCount}
                </span>
              ) : null}
            </summary>
            <div className="mt-4">
              <FilterFields
                academicTypes={academicTypes}
                knowledgeFields={knowledgeFields}
                typeSlugs={filters.typeSlugs}
                fieldSlugs={filters.fieldSlugs}
                {...filterHandlers}
              />
            </div>
          </details>
          <div className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pr-1">
              <FilterFields
                academicTypes={academicTypes}
                knowledgeFields={knowledgeFields}
                typeSlugs={filters.typeSlugs}
                fieldSlugs={filters.fieldSlugs}
                {...filterHandlers}
              />
            </div>
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              <span className="font-semibold text-navy">
                {visiblePrograms.length}
              </span>{" "}
              {visiblePrograms.length === 1 ? "programa" : "programas"}
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={() => applyFilters(() => EMPTY_FILTERS, "now")}
                className="min-h-11 text-sm font-medium text-navy-soft hover:underline"
              >
                Limpiar filtros
              </button>
            ) : null}
          </div>
          {activeFilterCount > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {filters.typeSlugs.map((slug) => {
                const type = academicTypes.find((item) => item.slug === slug);
                if (!type) {
                  return null;
                }
                return (
                  <li key={`type-${slug}`}>
                    <button
                      type="button"
                      onClick={() => filterHandlers.onToggleType(slug)}
                      className="rounded-full bg-card px-3 py-1.5 text-xs text-navy hover:bg-paper"
                    >
                      {type.name}
                      <span className="ml-1 text-muted">×</span>
                    </button>
                  </li>
                );
              })}
              {filters.fieldSlugs.map((slug) => {
                const field = knowledgeFields.find((item) => item.slug === slug);
                if (!field) {
                  return null;
                }
                return (
                  <li key={`field-${slug}`}>
                    <button
                      type="button"
                      onClick={() => filterHandlers.onToggleField(slug)}
                      className="rounded-full bg-card px-3 py-1.5 text-xs text-navy hover:bg-paper"
                    >
                      {field.name}
                      <span className="ml-1 text-muted">×</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
          {visiblePrograms.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-card px-6 py-14 text-center">
              <p className="text-lg font-medium text-navy">
                No encontramos programas con estos filtros.
              </p>
              <p className="mt-2 text-sm text-muted">
                Pruebe otra búsqueda o quite alguno de los filtros activos.
              </p>
              <button
                type="button"
                onClick={() => applyFilters(() => EMPTY_FILTERS, "now")}
                className="mt-5 min-h-11 rounded-full bg-navy px-5 text-sm font-medium text-white"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visiblePrograms.map((program) => (
                <li key={program.slug} className="min-w-0">
                  <ProgramCard program={program} />
                </li>
              ))}
            </ul>
          )}
        </div>
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
    <div className="space-y-7">
      <fieldset>
        <legend className="text-sm font-semibold text-navy">
          Tipo de programa
          {typeSlugs.length > 0 ? (
            <span className="ml-1 font-normal text-muted">
              ({typeSlugs.length})
            </span>
          ) : null}
        </legend>
        <p className="mt-1 text-xs text-muted">¿Qué tipo quiere estudiar?</p>
        <ul className="mt-3 space-y-0.5">
          {academicTypes.map((type) => (
            <li key={type.slug}>
              <label className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg px-2 text-sm hover:bg-card">
                <input
                  type="checkbox"
                  checked={typeSlugs.includes(type.slug)}
                  onChange={() => onToggleType(type.slug)}
                  className="size-4 shrink-0 accent-navy"
                />
                <span>{type.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <fieldset>
        <legend className="text-sm font-semibold text-navy">
          Campo de conocimiento
          {fieldSlugs.length > 0 ? (
            <span className="ml-1 font-normal text-muted">
              ({fieldSlugs.length})
            </span>
          ) : null}
        </legend>
        <p className="mt-1 text-xs text-muted">¿Sobre qué quiere estudiar?</p>
        <ul className="mt-3 space-y-0.5">
          {knowledgeFields.map((field) => (
            <li key={field.slug}>
              <label className="flex min-h-11 cursor-pointer items-start gap-2.5 rounded-lg px-2 py-2 text-sm hover:bg-card">
                <input
                  type="checkbox"
                  checked={fieldSlugs.includes(field.slug)}
                  onChange={() => onToggleField(field.slug)}
                  className="mt-0.5 size-4 shrink-0 accent-navy"
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
